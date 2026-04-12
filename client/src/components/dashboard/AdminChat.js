import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../context/AuthContext';
import { FiSend, FiPaperclip, FiUser, FiMessageSquare, FiCpu } from 'react-icons/fi';
import { generateAIResponse } from '../../utils/ai';


const AdminChat = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { user } = useAuth();
  const [isAiLoading, setIsAiLoading] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      fetchMessages(selectedRoom.id);
      
      // Subscribe to real-time messages (Supabase v2 Syntax)
      const channel = supabase
        .channel(`room-${selectedRoom.id}`)
        .on(
          'postgres_changes',
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'messages', 
            filter: `room_id=eq.${selectedRoom.id}` 
          },
          (payload) => {
            // Prevent duplicate message rendering if client just sent it
            setMessages((prev) => {
              if (prev.some(m => m.id === payload.new.id)) return prev;
              return [...prev, payload.new];
            });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedRoom]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_rooms')
        .select('*, profiles:client_id(full_name, avatar_url)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRooms(data);
    } catch (error) {
      console.error('Error fetching rooms:', error.message);
    }
  };

  const fetchMessages = async (roomId) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error.message);
    }
  };

  const handleAiSuggest = async () => {
    if (messages.length === 0) return;
    setIsAiLoading(true);
    try {
      const lastClientMessage = [...messages].reverse().find(m => m.sender_id !== user.id);
      const res = await generateAIResponse(lastClientMessage?.content || "Hello", 'chat');
      setNewMessage(res.text);
    } catch (error) {
      console.error('AI Error:', error);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedRoom) return;

    try {
      const { error } = await supabase.from('messages').insert([
        {
          room_id: selectedRoom.id,
          sender_id: user.id,
          content: newMessage,
        },
      ]);

      if (error) throw error;
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error.message);
    }
  };

  return (
    <div className="h-[calc(100vh-160px)] flex bg-[#112240] rounded-2xl border border-blue-500/10 shadow-xl overflow-hidden">
      {/* Sidebar: Chat Rooms */}
      <div className="w-80 border-r border-blue-500/10 overflow-y-auto">
        <div className="p-4 border-b border-blue-500/10">
          <h2 className="text-xl font-bold text-white">Inbox</h2>
        </div>
        <div className="divide-y divide-blue-500/5">
          {rooms.map((room) => (
            <div
              key={room.id}
              onClick={() => setSelectedRoom(room)}
              className={`p-4 cursor-pointer transition-all ${
                selectedRoom?.id === room.id ? 'bg-blue-600/10 border-l-4 border-blue-600' : 'hover:bg-[#1e2d4a]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                  {room.profiles?.avatar_url ? (
                    <img src={room.profiles.avatar_url} alt="" className="h-full w-full rounded-full" />
                  ) : (
                    <FiUser />
                  )}
                </div>
                <div>
                  <h4 className="text-white font-medium">{room.profiles?.full_name || 'Client'}</h4>
                  <p className="text-gray-500 text-xs truncate w-40">Click to view messages</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-[#0a192f]/30">
        {selectedRoom ? (
          <>
            <div className="p-4 border-b border-blue-500/10 bg-[#112240]">
              <h3 className="text-white font-bold">{selectedRoom.profiles?.full_name}</h3>
            </div>
            
            <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] p-4 rounded-2xl text-sm ${
                      msg.sender_id === user.id
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-[#1e2d4a] text-gray-200 rounded-tl-none'
                    }`}
                  >
                    {msg.content}
                    <div className="text-[10px] mt-2 opacity-50">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 bg-[#112240] border-t border-blue-500/10">
              <div className="flex items-center space-x-3">
                <button type="button" className="text-gray-400 hover:text-white transition-colors">
                  <FiPaperclip size={20} />
                </button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 bg-[#1e2d4a] border border-blue-500/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleAiSuggest}
                  disabled={isAiLoading || messages.length === 0}
                  className={`p-3 rounded-xl transition-all border ${isAiLoading ? 'animate-pulse bg-purple-500/20 text-purple-400' : 'bg-purple-600/10 text-purple-400 border-purple-500/20 hover:bg-purple-600 hover:text-white'}`}
                  title="AI Suggest Reply"
                >
                  <FiCpu size={20} />
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-all shadow-lg shadow-blue-500/20"
                >
                  <FiSend size={20} />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <FiMessageSquare size={64} className="mb-4 opacity-10" />
            <p className="text-lg">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChat;
