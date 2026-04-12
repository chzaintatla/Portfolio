import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { FiSearch, FiFilter, FiMoreVertical, FiMail, FiPhone, FiTag, FiClock } from 'react-icons/fi';

const AdminLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn("Lead Ingestion: Storage node response failure. Falling back to empty state.");
        setLeads([]);
        return;
      }
      setLeads(data);
    } catch (error) {
      console.error('Critical Lead Failure:', error.message);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (id, status) => {
    try {
      const { error } = await supabase.from('leads').update({ status }).eq('id', id);
      if (error) throw error;
      fetchLeads();
    } catch (error) {
      console.error('Error updating status:', error.message);
    }
  };

  const statusColors = {
    new: 'bg-blue-500/10 text-blue-500 border-blue-500/10',
    hot: 'bg-red-500/10 text-red-500 border-red-500/10',
    cold: 'bg-gray-500/10 text-gray-500 border-gray-500/10',
    converted: 'bg-green-500/10 text-green-500 border-green-500/10',
    lost: 'bg-orange-500/10 text-orange-500 border-orange-500/10',
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Lead Intelligence</h1>
          <p className="text-gray-400 mt-1 font-medium italic">Track your ROI and client conversion funnel.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-xl">
              <span className="text-blue-400 font-black text-sm">{leads.length} Total Leads</span>
           </div>
        </div>
      </div>

      <div className="bg-[#112240] rounded-[32px] border border-blue-500/10 shadow-2xl overflow-hidden backdrop-blur-xl">
        <div className="p-8 border-b border-blue-500/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative flex-1 max-w-md group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text"
              placeholder="Search by name, email or company..."
              className="w-full bg-[#0a192f] border border-blue-500/10 rounded-2xl py-4 pl-12 pr-6 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 text-white bg-[#0a192f] hover:bg-blue-600 transition-all px-6 py-4 rounded-2xl border border-blue-500/10 font-bold text-sm">
              <FiFilter />
              <span>Funnel State</span>
            </button>
            <button className="flex items-center space-x-2 text-white bg-blue-600 hover:bg-blue-700 transition-all px-6 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-blue-500/20">
              Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#0a192f]/50 text-gray-500 text-[10px] uppercase font-black tracking-[0.2em]">
                <th className="px-8 py-6">Prospect Detail</th>
                <th className="px-8 py-6">Engagement</th>
                <th className="px-8 py-6">Funnel Status</th>
                <th className="px-8 py-6">Ingestion Date</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-500/5">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto" />
                  </td>
                </tr>
              ) : leads.length > 0 ? (
                leads.filter(l => l.full_name?.toLowerCase().includes(searchTerm.toLowerCase())).map((lead) => (
                  <tr key={lead.id} className="hover:bg-blue-600/5 transition-all group">
                    <td className="px-8 py-6">
                      <div className="font-black text-white text-lg">{lead.full_name}</div>
                      <div className="flex items-center gap-2 mt-1">
                         <span className="text-blue-500/80 text-[10px] font-bold uppercase tracking-widest">{lead.company || lead.source || 'Direct Client'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 text-gray-400 group-hover:text-blue-400 transition-colors text-sm font-medium">
                          <FiMail />
                          <span>{lead.email}</span>
                        </div>
                        {lead.phone && (
                          <div className="flex items-center gap-3 text-gray-500 text-xs">
                            <FiPhone />
                            <span>{lead.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <select 
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border focus:outline-none cursor-pointer transition-all ${statusColors[lead.status] || 'bg-gray-500/10 text-gray-500'}`}
                        style={{ appearance: 'none' }}
                      >
                        <option value="new">🆕 New Lead</option>
                        <option value="hot">🔥 Hot Prospect</option>
                        <option value="cold">❄️ Cold</option>
                        <option value="converted">✅ Converted</option>
                        <option value="lost">❌ Lost</option>
                      </select>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-gray-400 text-sm font-bold">
                         <FiClock className="text-blue-500/50" />
                         {new Date(lead.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button className="p-3 bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white rounded-xl transition-all" title="Add Note">
                           <FiTag size={16} />
                        </button>
                        <button className="p-3 bg-[#0a192f] text-gray-400 hover:text-white rounded-xl transition-all" title="More Options">
                           <FiMoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center text-gray-500 italic font-medium">
                    The funnel is currently empty.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminLeads;
