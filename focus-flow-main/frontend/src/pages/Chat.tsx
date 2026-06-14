import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Send, Hash, MessageSquare, Loader2, Users, Globe } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useTaskContext } from '@/contexts/TaskContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  sender_id: string;
  sender_name: string;
  content: string;
  created_at: string;
}

const Chat = () => {
  const { user } = useAuth();
  const { userProfile, friends } = useTaskContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [filter, setFilter] = useState<'friends' | 'global'>('friends');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const isGlobal = filter === 'global';
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('is_global', isGlobal)
        .order('created_at', { ascending: true })
        .limit(70); // Keep last 70 as requested
      
      if (data) setMessages(data);
      scrollToBottom();
    };
    fetchMessages();

    const channel = supabase
      .channel('chat-room')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages'
      }, (payload) => {
        const newMessage = payload.new as Message & { is_global: boolean };
        const isGlobalView = filter === 'global';
        
        // Only add if it matches the current view's type
        if (newMessage.is_global === isGlobalView) {
          setMessages((prev) => {
            const updated = [...prev, newMessage];
            // Keep frontend state limited to 70 as well
            return updated.slice(-70);
          });
          scrollToBottom();
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [filter]); // Re-fetch when filter changes

  // Filter messages based on friends (Secondary layer for Friends view)
  const filteredMessages = useMemo(() => {
    if (filter === 'global') return messages;
    
    const friendIds = new Set(friends.map(f => f.id));
    return messages.filter(msg => msg.sender_id === user?.id || friendIds.has(msg.sender_id));
  }, [messages, filter, friends, user]);

  const scrollToBottom = () => {
    setTimeout(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, 100);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('PORTAL ERROR: You must be logged in to access the Squad Feed.');
      return;
    }
    
    if (!newMessage.trim()) return;
    
    setIsSending(true);
    const textToSend = newMessage.trim();
    const isGlobal = filter === 'global';
    setNewMessage(''); 

    try {
      const { error } = await supabase.from('messages').insert([{
        sender_id: user.id,
        sender_name: userProfile.username || 'User',
        content: textToSend,
        is_global: isGlobal
      }]);

      if (error) {
        console.error('Chat Error:', error);
        alert(`NETWORK ERROR: ${error.message}`);
        setNewMessage(textToSend);
      }
    } catch (err: any) {
      console.error('Chat Crash:', err);
      alert(`SYSTEM ERROR: ${err.message || 'Supabase Connection Lost'}`);
      setNewMessage(textToSend);
    } finally {
      setIsSending(false);
      scrollToBottom();
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-white animate-fade-in overflow-hidden lg:-ml-[4px]">
      {/* Container (Full Bleed Flex Flow) */}
      <div className="flex-1 border-l-0 lg:border-l-[4px] border-black flex flex-col dot-grid relative overflow-hidden">
        
        {/* Header Bar */}
        <div className="h-20 lg:h-24 flex-shrink-0 border-b-[4px] border-black flex items-center justify-between px-4 lg:px-8 bg-white z-20">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-black border-[3px] border-black flex items-center justify-center">
              {filter === 'global' ? (
                <Globe className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              ) : (
                <Users className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              )}
            </div>
            <div>
              <h2 className="text-lg lg:text-2xl font-black uppercase italic tracking-tighter leading-none">
                {filter === 'friends' ? 'Squad Chat' : 'Global Feed'}
              </h2>
              <p className="text-[8px] lg:text-[10px] font-black text-muted-foreground uppercase opacity-70 mt-1 tracking-widest text-[#00E5BC]">
                {filter === 'friends' ? 'Members: Friends Only' : 'Encryption: Active'}
              </p>
            </div>
          </div>

          {/* Filter Toggle */}
          <div className="flex gap-2 bg-black/5 p-1 rounded-none border-[3px] border-black shadow-[4px_4px_0px_0px_#000]">
            <Button
              id="tour-squad-chat"
              variant={filter === 'friends' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('friends')}
              className={cn(
                "h-8 lg:h-10 px-3 lg:px-4 font-black uppercase tracking-tighter rounded-none transition-all",
                filter === 'friends' ? "bg-black text-white hover:bg-black/90" : "text-black hover:bg-black/10"
              )}
            >
              Friends
            </Button>
            <Button
              id="tour-global-chat"
              variant={filter === 'global' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('global')}
              className={cn(
                "h-8 lg:h-10 px-3 lg:px-4 font-black uppercase tracking-tighter rounded-none transition-all",
                filter === 'global' ? "bg-black text-white hover:bg-black/90" : "text-black hover:bg-black/10"
              )}
            >
              Global
            </Button>
          </div>
        </div>

        {/* Messages area (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-12 space-y-4 lg:space-y-8 custom-scrollbar">
          {filteredMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full opacity-20 text-center space-y-4">
              <MessageSquare className="w-16 h-16" />
              <p className="font-black uppercase tracking-widest">No messages in {filter} feed</p>
            </div>
          ) : (
            filteredMessages.map((msg, index) => {
              const isMe = msg.sender_id === user?.id;
              return (
                <div key={msg.id || index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${isMe ? 'text-[#FF89BB]' : 'text-[#00E5BC]'}`}>
                      {msg.sender_name}
                    </span>
                    <span className="text-[8px] font-bold text-black/20 italic">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className={`p-3 lg:p-4 border-[3px] lg:border-[4px] border-black shadow-[4px_4px_0px_0px_#000] lg:shadow-[6px_6px_0px_0px_#000] font-bold text-sm lg:text-[16px] max-w-[90%] lg:max-w-[85%]
                    ${isMe ? 'bg-[#FFDE00] rounded-l-xl lg:rounded-l-2xl rounded-tr-xl lg:rounded-tr-2xl' : 'bg-white rounded-r-xl lg:rounded-r-2xl rounded-tl-xl lg:rounded-tl-2xl'}`}>
                    {msg.content}
                  </div>
                </div>
              );
            })
          )}
          <div ref={scrollRef} className="h-4 lg:h-10" />
        </div>

        {/* Bottom Input Area */}
        <div className="flex-shrink-0 border-t-[3px] sm:border-t-[4px] border-black bg-white p-3 lg:p-6 lg:px-10 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] pb-[calc(0.75rem+4.5rem)] lg:pb-6">
          <form onSubmit={handleSendMessage} className="flex gap-2 lg:gap-4">
            <input
              type="text"
              placeholder={filter === 'friends' ? "Message your squad..." : "Broadcast to global feed..."}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 h-12 lg:h-14 bg-white border-[3px] lg:border-[4px] border-black px-4 lg:px-6 font-bold text-base lg:text-lg focus:outline-none focus:bg-[#fcfcfc] transition-colors"
              style={{ fontSize: '16px' }} // Force 16px to prevent iOS zoom
              disabled={isSending}
            />
            <button
              type="submit"
              className={`h-12 lg:h-14 bg-black text-white px-4 lg:px-10 border-[3px] lg:border-[4px] border-black shadow-[3px_3px_0px_0px_#FF89BB] lg:shadow-[4px_4px_0px_0px_#FF89BB] font-black uppercase tracking-widest hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:scale-95 ${(!newMessage.trim() || isSending) ? 'opacity-50' : 'opacity-100'}`}
              disabled={isSending}
            >
              {isSending ? <Loader2 className="w-5 h-5 lg:w-6 lg:h-6 animate-spin text-white" /> : (
                <>
                  <span className="hidden lg:inline">SEND</span>
                  <Send className="lg:hidden w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
