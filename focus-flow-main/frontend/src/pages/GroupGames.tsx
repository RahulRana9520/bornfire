import React, { useState, useEffect } from 'react';
import { Gamepad2, Users, Globe, Lock, Play, Plus, Loader2, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useTaskContext } from '@/contexts/TaskContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GameRoom {
  id: string;
  game_type: string;
  room_type: 'squad' | 'global';
  created_by: string;
  player1_id: string;
  player2_id: string | null;
  player1_name: string;
  player2_name: string | null;
  status: 'waiting' | 'playing' | 'finished' | 'locked';
  created_at: string;
}

const GroupGames = () => {
  const { user } = useAuth();
  const { userProfile, friends } = useTaskContext();
  const [filter, setFilter] = useState<'squad' | 'global'>('squad');
  const [rooms, setRooms] = useState<GameRoom[]>([]);
  const [activeRoom, setActiveRoom] = useState<GameRoom | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchRooms();

    // Cleanup stale waiting rooms (older than 5 mins) to keep the lobby clean
    const cleanupRooms = async () => {
      const expirationTime = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      await supabase
        .from('game_rooms')
        .delete()
        .eq('status', 'waiting')
        .lt('created_at', expirationTime);
    };
    cleanupRooms();
    
    // Subscribe to general lobby changes
    const channel = supabase
      .channel('game-lobbies')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'game_rooms' 
      }, () => {
        fetchRooms();
      })
      .subscribe();

    // Fallback polling every 10s
    const pollInterval = setInterval(fetchRooms, 10000);

    return () => { 
      supabase.removeChannel(channel); 
      clearInterval(pollInterval);
    };
  }, [filter]);

  // Separate effect to sync the specific active room's status
  useEffect(() => {
    if (!activeRoom?.id) return;

    const channel = supabase
      .channel(`active-room-sync-${activeRoom.id}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'game_rooms',
        filter: `id=eq.${activeRoom.id}`
      }, (payload) => {
        console.log('Active room updated:', payload.new);
        setActiveRoom(payload.new as GameRoom);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeRoom?.id]);

  const fetchRooms = async () => {
    // Only set loading on first fetch
    if (rooms.length === 0) setIsLoading(true);
    try {
      let query = supabase
        .from('game_rooms')
        .select('*')
        .eq('room_type', filter)
        .eq('status', 'waiting')
        .order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      setRooms(data || []);

      // Synchronize active room state if we are currently in a room and waiting for a partner
      if (activeRoom && activeRoom.status === 'waiting') {
        const updatedActiveRoom = (data || []).find(r => r.id === activeRoom.id);
        if (updatedActiveRoom) {
          setActiveRoom(updatedActiveRoom);
        } else {
          // If the room is gone, we should probably exit
          const { data: singleRoom } = await supabase
            .from('game_rooms')
            .select('*')
            .eq('id', activeRoom.id)
            .single();
          if (singleRoom) setActiveRoom(singleRoom);
        }
      }
    } catch (err) {
      console.error('Error fetching rooms:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createRoom = async () => {
    if (!user) return;
    setIsCreating(true);
    try {
      const { data, error } = await supabase
        .from('game_rooms')
        .insert([{
          game_type: 'Tower Builder',
          room_type: filter,
          created_by: user.id,
          player1_id: user.id,
          player1_name: userProfile.username || 'User',
          status: 'waiting'
        }])
        .select()
        .single();

      if (error) throw error;
      setActiveRoom(data);
    } catch (err: any) {
      console.error('Error creating room:', err);
      alert(`LOBBY ERROR: ${err.message || 'Database connection lost'}`);
    } finally {
      setIsCreating(false);
    }
  };

  const joinRoom = async (room: GameRoom) => {
    if (!user || room.player2_id) return;
    
    try {
      const { data, error } = await supabase
        .from('game_rooms')
        .update({
          player2_id: user.id,
          player2_name: userProfile.username || 'User',
          status: 'locked'
        })
        .eq('id', room.id)
        .select()
        .single();

      if (error) throw error;
      setActiveRoom(data);
    } catch (err: any) {
      console.error('Error joining room:', err);
      alert(`JOIN ERROR: ${err.message || 'Room is no longer available'}`);
    }
  };

  const deleteRoom = async (roomId: string) => {
    try {
      await supabase.from('game_rooms').delete().eq('id', roomId);
      fetchRooms();
    } catch (err) {
      console.error('Error deleting room:', err);
    }
  };

  const leaveRoom = async () => {
    if (!activeRoom) {
      setActiveRoom(null);
      return;
    }
    
    try {
      if (user?.id === activeRoom.player1_id) {
        // Host is leaving - Delete the whole room to prevent abandoned rooms
        await supabase.from('game_rooms').delete().eq('id', activeRoom.id);
      } else if (user?.id === activeRoom.player2_id) {
        if (activeRoom.status === 'locked' || activeRoom.status === 'finished') {
          // Game was active/locked or finished - if one leaves, room is effectively dead
          await supabase.from('game_rooms').delete().eq('id', activeRoom.id);
        } else {
          // Guest left a waiting room - just make it available again
          await supabase.from('game_rooms')
            .update({ player2_id: null, status: 'waiting' })
            .eq('id', activeRoom.id);
        }
      }
    } catch (err) {
      console.error('Error cleaning up room:', err);
    } finally {
      setActiveRoom(null);
      fetchRooms();
    }
  };

  if (activeRoom) {
    return (
      <div className="flex flex-col h-screen bg-black overflow-hidden relative">
        {/* Game Header */}
        <div className="absolute top-4 left-4 z-50">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={leaveRoom}
            className="neo-brutal-white bg-white border-black border-[3px] shadow-[4px_4px_0px_0px_#000]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quit Game
          </Button>
        </div>

        {/* Game iframe */}
        <iframe 
          src={`/GroupGame/game1.html?room=${activeRoom.id}&p1=${activeRoom.player1_id}&p2=${activeRoom.player2_id || ''}&uid=${user?.id}&sburl=${encodeURIComponent(import.meta.env.VITE_SUPABASE_URL || '')}&sbkey=${encodeURIComponent(import.meta.env.VITE_SUPABASE_ANON_KEY || '')}`}
          className="w-full h-full border-none"
          title="Group Game"
        />
        
        {/* Game Status Overlay (If waiting) */}
        {activeRoom.status === 'waiting' && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white p-8 text-center z-40">
            <Loader2 className="w-16 h-16 animate-spin mb-6 text-[#FFDE00]" />
            <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-2">Waiting for Player 2</h2>
            <p className="text-muted-foreground font-bold uppercase tracking-widest text-sm mb-6">
              {filter === 'squad' ? 'Ask a friend to join your squad room!' : 'Waiting for someone to join the global lobby...'}
            </p>
            <Button 
              variant="outline" 
              onClick={fetchRooms}
              className="neo-brutal-white border-white/20 text-white hover:bg-white/10 mb-8"
            >
              <Loader2 className="w-4 h-4 mr-2" />
              Refresh Status
            </Button>
            <div className="mt-8 p-4 border-2 border-dashed border-white/20 font-mono text-xs opacity-50">
              ROOM ID: {activeRoom.id}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-[32px] sm:text-[48px] font-black uppercase italic tracking-tighter leading-none flex items-center gap-4">
            <Gamepad2 className="w-10 h-10 lg:w-12 lg:h-12" />
            Group Games
          </h1>
          <p className="text-muted-foreground mt-2 font-bold uppercase text-[12px] tracking-widest">
            Multiplayer stress busters for you and your squad
          </p>
        </div>

        <div className="flex gap-2 bg-black/5 p-1 rounded-none border-[3px] border-black shadow-[4px_4px_0px_0px_#000]">
          <Button
            variant={filter === 'squad' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('squad')}
            className={cn(
              "h-10 px-6 font-black uppercase tracking-tighter rounded-none transition-all",
              filter === 'squad' ? "bg-black text-white" : "text-black hover:bg-black/10"
            )}
          >
            <Users className="w-4 h-4 mr-2" />
            Squad
          </Button>
          <Button
            variant={filter === 'global' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('global')}
            className={cn(
              "h-10 px-6 font-black uppercase tracking-tighter rounded-none transition-all",
              filter === 'global' ? "bg-black text-white" : "text-black hover:bg-black/10"
            )}
          >
            <Globe className="w-4 h-4 mr-2" />
            Global
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Game Info Card */}
        <div id="tour-create-game" className="lg:col-span-1 space-y-6">
          <div className="bg-white border-[4px] border-black shadow-[8px_8px_0px_0px_#000] overflow-hidden group">
            <div className="h-48 border-b-[4px] border-black relative overflow-hidden group-hover:opacity-90 transition-opacity">
              <img 
                src="/GroupGame/game1_thumb.png" 
                alt="Tower Builder Game Screenshot" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-black uppercase italic tracking-tighter">Tower Builder</h3>
              <p className="text-sm font-bold text-muted-foreground mt-2 mb-6">
                Take turns building the tallest neo-brutalist tower. Don't be the one to let it collapse!
              </p>
              <Button 
                onClick={createRoom}
                disabled={isCreating}
                className="w-full h-14 bg-black text-white border-[4px] border-black shadow-[4px_4px_0px_0px_#00E5BC] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-black uppercase tracking-widest"
              >
                {isCreating ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                  <>
                    <Plus className="w-5 h-5 mr-2" />
                    Host {filter === 'squad' ? 'Squad' : 'Global'} Room
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Lobby Area */}
        <div className="lg:col-span-2">
          <div className="bg-white border-[4px] border-black shadow-[8px_8px_0px_0px_#000] p-6 min-h-[400px]">
            <div className="flex items-center justify-between mb-8 border-b-[3px] border-black pb-4">
              <h3 className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-2">
                {filter === 'squad' ? 'Friends Waiting' : 'Global Lobbies'}
              </h3>
              <span className="bg-[#00E5BC] px-3 py-1 border-[2px] border-black font-black text-xs">
                {rooms.length} ACTIVE
              </span>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
                <Loader2 className="w-10 h-10 animate-spin" />
                <p className="font-black uppercase text-xs tracking-widest">Scanning Grid...</p>
              </div>
            ) : rooms.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
                <Gamepad2 className="w-16 h-16 mb-4" />
                <p className="font-black uppercase text-sm tracking-widest">No active lobbies detected</p>
                <p className="text-[10px] font-bold mt-1 uppercase">Start a room to challenge someone</p>
              </div>
            ) : (
              <div className="space-y-4">
                {rooms.map((room) => (
                  <div 
                    key={room.id}
                    className={cn(
                      "flex items-center justify-between p-4 border-[3px] border-black transition-all",
                      room.status === 'locked' ? "bg-black/5 opacity-70" : "bg-white hover:translate-x-[4px] hover:shadow-[4px_0px_0px_0px_#000]"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#FF89BB] border-[3px] border-black flex items-center justify-center font-black text-xl italic">
                        {room.player1_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-black uppercase text-sm">{room.player1_name}'s Room</div>
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          {room.status === 'locked' ? 'Game in Progress' : 'Waiting for Player 2'}
                        </div>
                      </div>
                    </div>

                    {room.status === 'locked' ? (
                      <div className="flex items-center gap-2 text-xs font-black uppercase opacity-50 px-4">
                        <Lock className="w-4 h-4" />
                        Locked
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {user?.id === room.player1_id ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteRoom(room.id)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 font-black uppercase text-[10px] h-10 border-[3px] border-red-500/20 px-4"
                          >
                            Delete
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => joinRoom(room)}
                            className="neo-brutal-yellow h-10 px-6 border-[3px] border-black shadow-[4px_4px_0px_0px_#000] font-black uppercase text-xs tracking-widest"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Join
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupGames;
