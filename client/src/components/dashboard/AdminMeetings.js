import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { FiX, FiCalendar, FiClock, FiVideo, FiUser, FiShield, FiExternalLink } from 'react-icons/fi';
import { motion } from 'framer-motion';

const AdminMeetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    fetchMeetings();
    fetchStaff();
  }, []);

  const fetchMeetings = async () => {
    try {
      const { data, error } = await supabase
        .from('meetings')
        .select(`
           *,
           client:profiles!meetings_client_id_fkey(full_name, avatar_url),
           assignee:profiles!meetings_assigned_to_fkey(full_name)
        `)
        .order('start_time', { ascending: true });

      if (error) throw error;
      setMeetings(data);
    } catch (error) {
      console.error('Fetch Error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
     const { data } = await supabase.from('profiles').select('id, full_name').in('role', ['admin', 'employee']);
     setStaff(data || []);
  };

  const updateMeeting = async (id, updates) => {
    try {
      const { error } = await supabase.from('meetings').update(updates).eq('id', id);
      if (error) throw error;
      fetchMeetings();
    } catch (error) {
      alert('Node Update Failed: ' + error.message);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'approved': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'rejected': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'cancelled': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      default: return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter">Strategy Briefings</h1>
          <p className="text-gray-400 mt-2 font-medium">Coordinate client syncs and assignment protocols.</p>
        </div>
        <div className="bg-[#112240] px-6 py-3 rounded-2xl border border-blue-500/10 flex items-center gap-4">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[10px] font-black text-white uppercase tracking-widest">Active Sync Monitor</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {loading ? (
          <div className="flex justify-center py-24 text-blue-500 animate-pulse font-black uppercase tracking-widest">Scanning Synchronized Events...</div>
        ) : meetings.length > 0 ? (
          meetings.map((meeting) => (
            <motion.div 
              key={meeting.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#112240] p-10 rounded-[48px] border border-blue-500/5 flex flex-col xl:flex-row xl:items-center justify-between gap-10 hover:border-blue-500/20 transition-all shadow-2xl relative overflow-hidden group"
            >
              <div className="flex flex-col md:flex-row items-center gap-10 flex-1">
                {/* Tactical Date Node */}
                <div className="h-28 w-28 rounded-[36px] bg-[#0a192f] flex flex-col items-center justify-center border border-blue-500/10 shadow-2xl group-hover:scale-105 transition-transform duration-500">
                  <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                    {new Date(meeting.start_time).toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                  <span className="text-white text-4xl font-black tracking-tighter">
                    {new Date(meeting.start_time).getDate()}
                  </span>
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                       <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(meeting.status)}`}>
                         {meeting.status}
                       </span>
                       {meeting.assignee && (
                         <span className="px-4 py-1 bg-blue-600/10 text-blue-400 border border-blue-500/10 rounded-full text-[9px] font-black uppercase flex items-center gap-2">
                            <FiShield size={10} /> {meeting.assignee.full_name}
                         </span>
                       )}
                    </div>
                    <h3 className="text-2xl font-black text-white tracking-tight">{meeting.title}</h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center text-gray-400 text-xs font-bold">
                      <FiClock className="mr-3 text-blue-500" size={16} />
                      {new Date(meeting.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (30m Session)
                    </div>
                    <div className="flex items-center text-gray-400 text-xs font-bold">
                      <FiUser className="mr-3 text-blue-500" size={16} />
                      Target: {meeting.client?.full_name || 'Anonymous Prospect'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 bg-[#0a192f]/50 p-6 rounded-[32px] border border-blue-500/5">
                {meeting.status === 'pending' ? (
                  <div className="flex items-center gap-4 w-full xl:w-auto">
                    <select 
                       onChange={(e) => updateMeeting(meeting.id, { assigned_to: e.target.value })}
                       className="bg-[#112240] border border-blue-500/10 text-white text-[10px] font-black uppercase tracking-widest px-4 py-3 rounded-xl outline-none"
                    >
                       <option value="">Assign Operative</option>
                       {staff.map(s => <option key={s.id} value={s.id}>{s.full_name}</option>)}
                    </select>
                    <button 
                      onClick={() => updateMeeting(meeting.id, { status: 'approved' })}
                      className="flex-1 xl:flex-none px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase rounded-xl transition-all shadow-xl shadow-emerald-500/20"
                    >
                      Authorize Briefing
                    </button>
                    <button 
                      onClick={() => updateMeeting(meeting.id, { status: 'rejected' })}
                      className="p-3 bg-red-600/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-red-500/10"
                    >
                      <FiX size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                     <button className="px-6 py-3 bg-[#112240] text-gray-400 hover:text-white rounded-xl text-[10px] font-black uppercase border border-blue-500/10 transition-all flex items-center gap-2">
                        <FiExternalLink /> Protocol Brief
                     </button>
                     {meeting.status === 'approved' && (
                       <button className="px-6 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase flex items-center gap-2 shadow-xl shadow-blue-500/20">
                         <FiVideo /> Establish Uplink
                       </button>
                     )}
                  </div>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="bg-[#112240] p-24 rounded-[48px] border border-blue-500/10 text-center text-gray-500 shadow-inner">
            <FiCalendar size={64} className="mx-auto mb-6 opacity-5" />
            <p className="text-2xl font-black text-gray-600 uppercase tracking-widest leading-loose">No Synchronized Strategy<br/>Briefings Detected</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMeetings;

