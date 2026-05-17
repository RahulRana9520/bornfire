import React, { useState } from 'react';
import { Users, UserPlus, Search, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useTaskContext } from '@/contexts/TaskContext';
import { FriendCard } from '@/components/friends/FriendCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Friends = () => {
  const { friends, addFriendById } = useTaskContext();
  const [friendIdSearch, setFriendIdSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchMsg, setSearchMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const onlineFriends = friends.filter(f => f.isOnline);
  const offlineFriends = friends.filter(f => !f.isOnline);

  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendIdSearch.trim() || friendIdSearch.length < 4) return;
    
    setIsSearching(true);
    setSearchMsg(null);
    
    const result = await addFriendById(friendIdSearch.trim().toUpperCase());
    
    if (result.success) {
      setSearchMsg({ type: 'success', text: 'SQUAD CONNECTED! REFRESH TO SEE THEM.' });
      setFriendIdSearch('');
    } else {
      setSearchMsg({ type: 'error', text: result.error || 'COULD NOT FIND USER' });
    }
    setIsSearching(false);
  };

  return (
    <div className="space-y-8 animate-fade-in p-2 sm:p-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-[32px] sm:text-[40px] font-black uppercase italic tracking-tighter leading-none">
            Watch Friends
          </h1>
          <p className="text-muted-foreground mt-2 font-bold uppercase text-[12px] tracking-widest">
            Monitor your study squad in real-time
          </p>
        </div>
      </div>

      {/* Invite System (Neo-Brutalist Add Bar) */}
      <div className="bg-white border-[4px] border-black shadow-[8px_8px_0px_0px_#000] p-6 rounded-2xl">
        <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-primary fill-primary/20" />
          Invite by Bornfire ID
        </h3>
        <form onSubmit={handleAddFriend} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Input 
              placeholder="#BF-XXXXXX" 
              value={friendIdSearch}
              onChange={(e) => setFriendIdSearch(e.target.value)}
              className="neo-input h-14 text-lg font-black tracking-widest bg-[#f8f8f8]"
              disabled={isSearching}
            />
          </div>
          <button 
            type="submit"
            disabled={isSearching || !friendIdSearch}
            className="h-14 bg-[#FFDE00] border-[4px] border-black shadow-[4px_4px_0px_0px_#000] px-8 font-black uppercase tracking-wider hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:bg-[#e6c800] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSearching ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'Connect Squad'}
          </button>
        </form>

        {searchMsg && (
          <div className={cn(
            "mt-4 p-4 border-[3px] border-black shadow-[4px_4px_0px_0px_#000] flex items-center gap-3 font-bold text-xs uppercase",
            searchMsg.type === 'success' ? "bg-[#00E5BC] text-black" : "bg-[#FF89BB] text-black"
          )}>
            {searchMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {searchMsg.text}
          </div>
        )}
      </div>

      {/* Online Friends */}
      {onlineFriends.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-black text-[10px] uppercase tracking-[4px] text-muted-foreground flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#00E5BC] border-2 border-black" />
            Live Status ({onlineFriends.length})
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {onlineFriends.map(friend => (
              <FriendCard key={friend.id} friend={friend} />
            ))}
          </div>
        </div>
      )}

      {/* Offline Friends */}
      {offlineFriends.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-black text-[10px] uppercase tracking-[4px] text-muted-foreground">
            Stationary ({offlineFriends.length})
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {offlineFriends.map(friend => (
              <FriendCard key={friend.id} friend={friend} />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {friends.length === 0 && (
        <div className="text-center py-20 bg-white border-[4px] border-black shadow-[10px_10px_0px_0px_#000] rounded-3xl">
          <Users className="w-20 h-20 mx-auto mb-6 text-muted-foreground/30" />
          <h3 className="text-2xl font-black uppercase italic">Squad Empty</h3>
          <p className="text-muted-foreground mt-2 font-bold uppercase text-[10px] tracking-[2px]">
            No study buddies detected in your sector
          </p>
        </div>
      )}
    </div>
  );
};

// Help with style
const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

export default Friends;
