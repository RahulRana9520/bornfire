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
    if (!newMessage.trim() || !user) return;
    setIsSending(true);
    const textToSend = newMessage.trim();
    setNewMessage(''); 

    const { error } = await supabase.from('messages').insert([{
      sender_id: user.id,
      sender_name: userProfile.username || 'User',
      content: textToSend
    }]);

    if (error) { setNewMessage(textToSend); }
    setIsSending(false);
    scrollToBottom();
  };

  return (
    <div className="flex flex-col h-screen w-full bg-white animate-fade-in overflow-hidden -ml-[4px]">
      {/* Container (Full Bleed Flex Flow) */}
      <div className="flex-1 border-l-[4px] border-black flex flex-col dot-grid relative overflow-hidden">
        
        {/* Header Bar */}
        <div className="h-20 flex-shrink-0 border-b-[4px] border-black flex items-center px-8 bg-white z-20">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-black border-[3px] border-black flex items-center justify-center">
              <Hash className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase italic tracking-tighter leading-none">Global Chat</h2>
              <p className="text-[10px] font-black text-muted-foreground uppercase opacity-70 mt-1 tracking-widest text-[#00E5BC]">
                Encryption Loop: Active
              </p>
            </div>
          </div>
        </div>

        {/* Messages area (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-12 space-y-8 custom-scrollbar">
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
                <div className={`p-4 border-[4px] border-black shadow-[6px_6px_0px_0px_#000] font-bold text-[16px] max-w-[85%]
                  ${isMe ? 'bg-[#FFDE00] rounded-l-2xl rounded-tr-2xl' : 'bg-white rounded-r-2xl rounded-tl-2xl'}`}>
                  {msg.content}
                </div>
              </div>
            );
          })}
          <div ref={scrollRef} className="h-10" />
        </div>

        {/* Bottom Input Area (Standard Flow—cannot be overlapped) */}
        <div className="flex-shrink-0 border-t-[4px] border-black bg-white p-6 px-10 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
          <form onSubmit={handleSendMessage} className="flex gap-4">
            <input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 h-14 bg-white border-[4px] border-black px-6 font-bold text-lg focus:outline-none focus:bg-[#fcfcfc] transition-colors"
              disabled={isSending}
            />
            <button
              type="submit"
              disabled={isSending || !newMessage.trim()}
              className="h-14 bg-black text-white px-10 border-[4px] border-black shadow-[4px_4px_0px_0px_#FF89BB] font-black uppercase tracking-[3px] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:scale-95"
            >
              {isSending ? <Loader2 className="w-6 h-6 animate-spin text-white" /> : 'SEND'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
