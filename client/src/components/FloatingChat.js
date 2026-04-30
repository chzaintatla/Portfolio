import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiX, FiSend, FiMinimize2 } from 'react-icons/fi';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

const FloatingChat = () => {
  const { user, profile, isClient } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [room, setRoom] = useState(null);
  const scrollRef = useRef();

  useEffect(() => {
    if (user) {
      initChat();
    }
  }, [user]);

  const initChat = async () => {
    let { data: existingRoom } = await supabase
      .from('chat_rooms')
      .select('*')
      .eq('client_id', user.id)
      .single();

    if (!existingRoom) {
      const { data: newRoom } = await supabase
        .from('chat_rooms')
        .insert([{ client_id: user.id, name: `Chat: ${profile?.full_name || user.email}` }])
        .select()
        .single();
      existingRoom = newRoom;
    }
    setRoom(existingRoom);
    if (existingRoom) fetchMessages(existingRoom.id);
  };

  useEffect(() => {
    if (room && isOpen) {
      const channel = supabase
        .channel(`floating-room-${room.id}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${room.id}` }, 
        (p) => setMessages(prev => [...prev, p.new]))
        .subscribe();
      return () => supabase.removeChannel(channel);
    }
  }, [room, isOpen]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const fetchMessages = async (roomId) => {
    const { data } = await supabase.from('messages').select('*').eq('room_id', roomId).order('created_at', { ascending: true });
    setMessages(data || []);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !room) return;
    const { error } = await supabase.from('messages').insert([{ room_id: room.id, sender_id: user.id, content: newMessage }]);
    if (!error) setNewMessage('');
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 w-80 md:w-96 h-[500px] bg-[#112240] rounded-[32px] border border-blue-500/20 shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl"
          >
            <div className="p-5 bg-gradient-to-r from-blue-600 to-indigo-700 flex justify-between items-center">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                 <h3 className="text-white text-xs font-black uppercase tracking-widest">SparkWave Support</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white opacity-60 hover:opacity-100 transition-opacity">
                <FiMinimize2 size={18} />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 p-5 overflow-y-auto space-y-4 scrollbar-hide">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-xs ${m.sender_id === user.id ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-[#0a192f] text-gray-300 border border-blue-500/10 rounded-tl-none'}`}>
                    {m.content}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={sendMessage} className="p-4 bg-[#0d152a] border-t border-blue-500/10">
              <div className="flex items-center gap-3 bg-[#050b1a] p-2 rounded-xl border border-blue-500/10">
                <input 
                  className="flex-1 bg-transparent border-none outline-none px-4 py-2 text-xs font-bold text-white placeholder-gray-600"
                  placeholder="Ask our experts..."
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                />
                <button type="submit" className="p-3 bg-blue-600 text-white rounded-lg shadow-lg hover:scale-105 transition-all">
                  <FiSend size={14} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-blue-500/40 border border-white/10 group overflow-hidden relative"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        {isOpen ? <FiX size={24} /> : <FiMessageSquare size={24} />}
      </motion.button>
    </div>
  );
};

export default FloatingChat;
