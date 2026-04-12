import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiMessageSquare, FiCalendar, FiUser, FiLogOut, FiShield } from 'react-icons/fi';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

const ClientPortal = () => {
  const { user, profile, signOut } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [room, setRoom] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const scrollRef = useRef();

  useEffect(() => {
    initPortal();
  }, []);

  const initPortal = async () => {
    // 1. Get or Create Chat Room for this client
    let { data: existingRoom } = await supabase
      .from('chat_rooms')
      .select('*')
      .eq('client_id', user.id)
      .single();

    if (!existingRoom) {
      const { data: newRoom } = await supabase
        .from('chat_rooms')
        .insert([{ client_id: user.id, name: `Chat: ${profile?.full_name}` }])
        .select()
        .single();
      existingRoom = newRoom;
    }
    setRoom(existingRoom);

    // 2. Fetch Meetings
    const { data: userMeetings } = await supabase
      .from('meetings')
      .select('*, assignee:profiles!meetings_assigned_to_fkey(full_name)')
      .eq('client_id', user.id)
      .order('start_time', { ascending: true });
    setMeetings(userMeetings || []);

    if (existingRoom) fetchMessages(existingRoom.id);
  };

  useEffect(() => {
    if (room) {
      const channel = supabase
        .channel(`client-room-${room.id}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${room.id}` }, 
        (p) => setMessages(prev => [...prev, p.new]))
        .subscribe();
      return () => supabase.removeChannel(channel);
    }
  }, [room]);

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

  return (
    <div className="min-h-screen bg-[#050b1a] text-white p-6 md:p-12">
      <nav className="max-w-7xl mx-auto flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-xl shadow-xl shadow-blue-500/20">S</div>
           <div>
              <h1 className="text-xl font-black tracking-tighter uppercase italic">Client Workspace</h1>
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Secured Strategy Terminal</p>
           </div>
        </div>
        <button onClick={signOut} className="flex items-center gap-2 px-6 py-3 bg-[#112240] border border-blue-500/10 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-500/10 hover:text-red-500 transition-all">
           <FiLogOut /> Terminal Exit
        </button>
      </nav>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 h-[calc(100vh-200px)]">
        {/* Interaction Node (Chat) */}
        <div className="lg:col-span-2 bg-[#112240] rounded-[48px] border border-blue-500/10 flex flex-col overflow-hidden shadow-2xl">
           <div className="p-8 border-b border-blue-500/5 bg-[#0d152a] flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 <h2 className="text-sm font-black uppercase tracking-widest text-blue-400">Administration Uplink</h2>
              </div>
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest italic">Encrypted Session Active</span>
           </div>

           <div ref={scrollRef} className="flex-1 p-8 overflow-y-auto space-y-6 scrollbar-hide">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-20">
                   <FiMessageSquare size={80} className="mb-6" />
                   <p className="font-black uppercase tracking-widest">Awaiting Communication...</p>
                </div>
              )}
              {messages.map((m, i) => (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={i} className={`flex ${m.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[80%] p-5 rounded-3xl ${m.sender_id === user.id ? 'bg-blue-600 text-white rounded-tr-none shadow-xl shadow-blue-500/10' : 'bg-[#0a192f] border border-blue-500/10 text-gray-200 rounded-tl-none shadow-xl'}`}>
                      <p className="text-sm font-medium leading-relaxed">{m.content}</p>
                      <span className="text-[9px] mt-2 block opacity-40 font-black">{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                   </div>
                </motion.div>
              ))}
           </div>

           <form onSubmit={sendMessage} className="p-8 bg-[#0d152a] border-t border-blue-500/5">
              <div className="flex items-center gap-4 bg-[#050b1a] p-2 rounded-2xl border border-blue-500/10">
                 <input 
                   className="flex-1 bg-transparent border-none outline-none px-6 py-2 text-sm font-bold placeholder-gray-600"
                   placeholder="Signal to administration..."
                   value={newMessage}
                   onChange={e => setNewMessage(e.target.value)}
                 />
                 <button type="submit" className="p-4 bg-blue-600 text-white rounded-xl shadow-xl shadow-blue-500/20 hover:scale-105 transition-all">
                    <FiSend size={18} />
                 </button>
              </div>
           </form>
        </div>

        {/* Intelligence Node (Meetings) */}
        <div className="space-y-8 overflow-y-auto pr-2">
           <div className="bg-[#112240] p-8 rounded-[48px] border border-blue-500/10 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                 <div className="p-3 bg-blue-600/10 text-blue-500 rounded-2xl"><FiCalendar size={20} /></div>
                 <h3 className="font-black uppercase tracking-widest text-xs">Strategy Syncs</h3>
              </div>
              <div className="space-y-4">
                 {meetings.map((m, i) => (
                   <div key={i} className="p-5 bg-[#0a192f] rounded-3xl border border-blue-500/5 space-y-3">
                      <div className="flex justify-between items-start">
                         <h4 className="text-xs font-black text-white hover:text-blue-400 transition-colors uppercase tracking-tight line-clamp-1">{m.title}</h4>
                         <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase border ${m.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>{m.status}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-500 text-[10px] font-bold">
                         <FiCalendar /> {new Date(m.start_time).toLocaleDateString()}
                      </div>
                      {m.assignee && (
                        <div className="flex items-center gap-3 text-blue-400 text-[9px] font-black uppercase tracking-widest bg-blue-600/5 p-2 rounded-lg">
                           <FiShield /> Assigned: {m.assignee.full_name}
                        </div>
                      )}
                   </div>
                 ))}
                 {meetings.length === 0 && <p className="text-[10px] text-gray-600 text-center uppercase font-black py-4">No Active Syncs</p>}
              </div>
           </div>

           <div className="bg-[#112240] p-8 rounded-[48px] border border-blue-500/10 shadow-2xl space-y-6">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-purple-600/10 text-purple-500 rounded-2xl"><FiUser size={20} /></div>
                 <h3 className="font-black uppercase tracking-widest text-xs">User Identity</h3>
              </div>
              <div>
                 <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">Authenticated Label</p>
                 <p className="text-sm font-black text-white">{profile?.full_name}</p>
              </div>
              <div>
                 <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">Clearance Protocol</p>
                 <p className="text-xs font-black text-purple-500 uppercase tracking-widest bg-purple-600/10 inline-block px-3 py-1 rounded-lg">Verified Partner</p>
              </div>
           </div>

           <div className="bg-[#112240] p-8 rounded-[48px] border border-blue-500/10 shadow-2xl space-y-6">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-amber-600/10 text-amber-500 rounded-2xl"><FiShield size={20} /></div>
                 <h3 className="font-black uppercase tracking-widest text-xs">Security Credentials</h3>
              </div>
              <form className="space-y-4" onSubmit={async (e) => {
                 e.preventDefault();
                 const pass = e.target.clientPass.value;
                 try {
                    const { error } = await supabase.auth.updateUser({ password: pass });
                    if (error) throw error;
                    alert("Credential Update Success: Link Restored.");
                    e.target.reset();
                 } catch (err) {
                    alert("Security Rejection: " + err.message);
                 }
              }}>
                 <div>
                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2 block">New Password Link</label>
                    <input name="clientPass" required type="password" className="w-full bg-[#050b1a] border border-blue-500/10 rounded-xl px-4 py-3 text-white text-xs font-bold outline-none" />
                 </div>
                 <button type="submit" className="w-full py-3 bg-amber-600/10 text-amber-500 border border-amber-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 hover:text-white transition-all">Rotate Access Key</button>
              </form>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ClientPortal;
