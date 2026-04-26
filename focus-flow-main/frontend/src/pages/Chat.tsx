import React, { useState, useEffect, useRef } from 'react';
import { Send, Hash, MessageSquare, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useTaskContext } from '@/contexts/TaskContext';

interface Message {
  id: string;
  sender_id: string;
  sender_name: string;
  content: string;
  created_at: string;
}

const Chat = () => {
  const { user } = useAuth();
  const { userProfile } = useTaskContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(100);
      
      if (data) setMessages(data);
      scrollToBottom();
    };
    fetchMessages();

    const channel = supabase
      .channel('global-chat')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        setMessages((prev) => [...prev, payload.new as Message]);
        scrollToBottom();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

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
    setNewMessage(''); 

    try {
      const { error } = await supabase.from('messages').insert([{
        sender_id: user.id,
        sender_name: userProfile.username || 'User',
        content: textToSend
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
        <div className="h-16 lg:h-20 flex-shrink-0 border-b-[4px] border-black flex items-center px-4 lg:px-8 bg-white z-20">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-black border-[3px] border-black flex items-center justify-center">
              <Hash className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg lg:text-xl font-black uppercase italic tracking-tighter leading-none">Global Chat</h2>
              <p className="text-[8px] lg:text-[10px] font-black text-muted-foreground uppercase opacity-70 mt-1 tracking-widest text-[#00E5BC]">
                Encryption: Active
              </p>
            </div>
          </div>
        </div>

        {/* Messages area (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-12 space-y-4 lg:space-y-8 custom-scrollbar">
          {messages.map((msg, index) => {
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
          })}
          <div ref={scrollRef} className="h-4 lg:h-10" />
        </div>

        {/* Bottom Input Area */}
        <div className="flex-shrink-0 border-t-[4px] border-black bg-white p-3 lg:p-6 lg:px-10 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
          <form onSubmit={handleSendMessage} className="flex gap-2 lg:gap-4">
            <input
              type="text"
              placeholder="Type..."
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
