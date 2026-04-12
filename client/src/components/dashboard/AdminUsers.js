import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { FiShield, FiUser, FiActivity, FiKey, FiMail } from 'react-icons/fi';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [provisionData, setProvisionData] = useState({
    fullName: '',
    email: '',
    role: 'employee',
    whatsapp: '',
    password: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProvision = async (e) => {
    e.preventDefault();
    try {
        // FOR RECURSION BYPASS: We upsert to profiles. 
        // Note: Real auth requires Supabase Admin API or Email Invite.
        // For this secure process, we establish the database identity first.
        const { error } = await supabase
            .from('profiles')
            .upsert({
                id: crypto.randomUUID(), // Mock ID if not using Real Auth yet, or use Real ID
                full_name: provisionData.fullName,
                role: provisionData.role,
                whatsapp: provisionData.whatsapp,
                created_at: new Date()
            });

        if (error) throw error;
        alert("Institutional Identity Provisioned. Please create the Auth account in Supabase Console using assigned password.");
        setShowModal(false);
        fetchUsers();
    } catch (err) {
        alert("Provisioning Failure: " + err.message);
    }
  };

  const updateRole = async (userId, newRole) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
      fetchUsers();
    } catch (error) {
      alert('Security Protocol Violation: ' + error.message);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter">Personnel Archive</h1>
          <p className="text-gray-400 mt-2 font-medium">Control clearance levels and operational access for all personnel.</p>
        </div>
        <button 
           onClick={() => setShowModal(true)}
           className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-500/20 transition-all flex items-center gap-3"
        >
           <FiUser /> Provision New Operative
        </button>
      </div>

      {/* PROVISIONING MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050b1a]/95 backdrop-blur-xl">
           <div className="bg-[#0d152a] w-full max-w-xl rounded-[48px] p-10 border border-blue-500/20 shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                 <h2 className="text-2xl font-black text-white tracking-tight">Onboarding Algorithm</h2>
                 <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white text-3xl font-light">&times;</button>
              </div>
              <form onSubmit={handleProvision} className="space-y-6 scrollable-terminal custom-scrollbar pr-2">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                       <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2 block">Full Name</label>
                       <input required className="w-full bg-[#050b1a] border border-blue-500/10 rounded-xl px-5 py-4 text-white font-bold outline-none" value={provisionData.fullName} onChange={e => setProvisionData({...provisionData, fullName: e.target.value})} />
                    </div>
                    <div>
                       <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2 block">Email ID</label>
                       <input type="email" required className="w-full bg-[#050b1a] border border-blue-500/10 rounded-xl px-5 py-4 text-white font-bold outline-none" value={provisionData.email} onChange={e => setProvisionData({...provisionData, email: e.target.value})} />
                    </div>
                    <div>
                       <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2 block">WhatsApp</label>
                       <input required className="w-full bg-[#050b1a] border border-blue-500/10 rounded-xl px-5 py-4 text-white font-bold outline-none" placeholder="+92..." value={provisionData.whatsapp} onChange={e => setProvisionData({...provisionData, whatsapp: e.target.value})} />
                    </div>
                    <div>
                       <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2 block">Assigned Clearace</label>
                       <select className="w-full bg-[#050b1a] border border-blue-500/10 rounded-xl px-5 py-4 text-white font-bold outline-none" value={provisionData.role} onChange={e => setProvisionData({...provisionData, role: e.target.value})}>
                          <option value="employee">Staff</option>
                          <option value="admin">Administrator</option>
                       </select>
                    </div>
                    <div>
                       <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2 block">Access Key (Password)</label>
                       <input required type="password" className="w-full bg-[#050b1a] border border-blue-500/10 rounded-xl px-5 py-4 text-white font-bold outline-none" value={provisionData.password} onChange={e => setProvisionData({...provisionData, password: e.target.value})} />
                    </div>
                 </div>
                 <button type="submit" className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20">Authorize Personnel</button>
              </form>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="flex justify-center py-20 text-blue-500 animate-pulse">Scanning Personnel Databases...</div>
        ) : users.map((u) => (
          <div key={u.id} className="bg-[#112240] p-8 rounded-[40px] border border-blue-500/10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 group hover:border-blue-500/30 transition-all">
            <div className="flex items-center gap-6 flex-1 min-w-0">
              <div className="w-16 h-16 rounded-2xl bg-[#0a192f] flex items-center justify-center text-blue-500 shadow-inner group-hover:scale-110 transition-transform">
                <FiUser size={30} />
              </div>
              <div className="min-w-0">
                <h3 className="text-xl font-black text-white mb-1 truncate">{u.full_name || 'Anonymous Operative'}</h3>
                <div className="flex flex-wrap items-center gap-y-2 gap-x-6">
                   <div className="flex items-center gap-2 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                      <FiMail size={12} className="text-blue-500" />
                      ID: {u.id.substring(0, 8)}...
                   </div>
                   {u.whatsapp && (
                     <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        WA: {u.whatsapp}
                     </div>
                   )}
                   <div className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-lg ${
                     u.role === 'super_admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-purple-500/5' :
                     u.role === 'admin' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-blue-500/5' :
                     'bg-gray-500/10 text-gray-400 border-gray-500/20 shadow-gray-500/5'
                   }`}>
                     {u.role ? u.role.replace('_', ' ') : 'PENDING ROLE'}
                   </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-[#0a192f] p-3 rounded-2xl border border-blue-500/5">
               <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-4">Clearance:</span>
               {['employee', 'admin', 'super_admin'].map((r) => (
                 <button 
                   key={r}
                   disabled={u.role === 'super_admin'}
                   onClick={() => updateRole(u.id, r)}
                   className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                     u.role === r 
                       ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                       : 'bg-[#112240] text-gray-500 hover:text-white disabled:opacity-30'
                   }`}
                 >
                   {r === 'employee' ? 'Staff' : r.replace('_', ' ')}
                 </button>
               ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;
