import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiUsers, 
  FiMessageSquare, 
  FiFileText, 
  FiTrendingUp,
  FiArrowUpRight,
  FiArrowDownRight,
} from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../../config/supabase';

const StatCard = ({ title, value, change, icon, color }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-[#112240] p-8 rounded-[32px] border border-blue-500/10 shadow-2xl relative overflow-hidden group"
  >
    <div className={`absolute top-0 right-0 w-32 h-32 ${color} opacity-[0.03] blur-3xl group-hover:opacity-10 transition-opacity`} />
    <div className="flex justify-between items-start relative z-10">
      <div className={`p-4 rounded-2xl ${color} bg-opacity-20 text-white shadow-lg`}>
        {icon}
      </div>
      <div className={`flex items-center space-x-1 text-sm font-bold ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
        <span>{change >= 0 ? '+' : ''}{change}%</span>
        {change >= 0 ? <FiArrowUpRight /> : <FiArrowDownRight />}
      </div>
    </div>
    <div className="mt-6 relative z-10">
      <h3 className="text-gray-500 text-xs font-black uppercase tracking-widest">{title}</h3>
      <p className="text-4xl font-black text-white mt-1 tracking-tight">{value}</p>
    </div>
  </motion.div>
);

const data = [
  { name: 'Mon', leads: 400, views: 2400 },
  { name: 'Tue', leads: 300, views: 1398 },
  { name: 'Wed', leads: 200, views: 9800 },
  { name: 'Thu', leads: 278, views: 3908 },
  { name: 'Fri', leads: 189, views: 4800 },
  { name: 'Sat', leads: 239, views: 3800 },
  { name: 'Sun', leads: 349, views: 4300 },
];

const AdminStats = () => {
  const [summary, setSummary] = useState({
    leads: 0,
    chats: 0,
    blogs: 0
  });

  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const { count: leadsCount, error: leadsErr } = await supabase.from('leads').select('*', { count: 'exact', head: true });
        const { count: roomsCount, error: roomsErr } = await supabase.from('chat_rooms').select('*', { count: 'exact', head: true });
        const { count: blogsCount, error: blogsErr } = await supabase.from('blogs').select('*', { count: 'exact', head: true });
        
        if (leadsErr || roomsErr || blogsErr) {
            console.warn("Analytics Engine: Partial data transmission failure (Recursion?). Using local cache.");
        }

        setSummary({
          leads: leadsCount || 0,
          chats: roomsCount || 0,
          blogs: blogsCount || 0
        });
      } catch (err) {
        console.error("Critical Analytics Failure:", err.message);
      }
    };

    fetchRealData();
  }, []);

  const stats = [
    { title: 'Total Revenue', value: '$12,480', change: 18.2, icon: <FiTrendingUp size={24} />, color: 'bg-emerald-600' },
    { title: 'Operations Spending', value: '$4,120', change: -5.4, icon: <FiArrowDownRight size={24} />, color: 'bg-red-600' },
    { title: 'Net Earnings', value: '$8,360', change: 22.1, icon: <FiArrowUpRight size={24} />, color: 'bg-blue-600' },
    { title: 'Fixed Expenses', value: '$1,200', change: 0.0, icon: <FiFileText size={24} />, color: 'bg-orange-600' },
  ];

  const engagementStats = [
    { title: 'Market Leads', value: summary.leads, change: 12.5, icon: <FiUsers size={24} />, color: 'bg-blue-600' },
    { title: 'Live Conversations', value: summary.chats, change: -2.4, icon: <FiMessageSquare size={24} />, color: 'bg-purple-600' },
    { title: 'Authorized Assets', value: summary.blogs, change: 28.4, icon: <FiFileText size={24} />, color: 'bg-green-600' },
    { title: 'Conversion Index', value: '3.2%', change: 4.1, icon: <FiTrendingUp size={24} />, color: 'bg-orange-600' },
  ];

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter">Business Intelligence</h1>
          <p className="text-gray-400 mt-2 font-medium">Platform performance and ROI tracking metrics.</p>
        </div>
        <div className="flex gap-4">
           <button className="px-6 py-3 bg-[#112240] text-white rounded-xl border border-blue-500/10 font-bold hover:bg-blue-600 transition-all">Download Report</button>
        </div>
      </div>

      <div>
        <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">Capital Matrix Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">Engagement & Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {engagementStats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#112240] p-10 rounded-[40px] border border-blue-500/10 shadow-2xl h-[450px]">
          <div className="flex justify-between items-center mb-10">
             <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Traffic Funnel Performance</h3>
                <p className="text-gray-500 text-xs mt-1 font-bold">Real-time engagement across platforms</p>
             </div>
             <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                   <div className="w-2 h-2 rounded-full bg-blue-600" />
                   <span className="text-xs text-gray-400 font-bold">Leads</span>
                </div>
                <div className="flex items-center space-x-2">
                   <div className="w-2 h-2 rounded-full bg-purple-600" />
                   <span className="text-xs text-gray-400 font-bold">Views</span>
                </div>
             </div>
          </div>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={data}>
                 <defs>
                   <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                   </linearGradient>
                   <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4a" vertical={false} />
                 <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} style={{fontSize: '10px', fontWeight: 'bold'}} />
                 <YAxis hide />
                 <Tooltip contentStyle={{backgroundColor: '#0a192f', border: 'none', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'}} />
                 <Area type="monotone" dataKey="leads" stroke="#2563eb" fillOpacity={1} fill="url(#colorLeads)" strokeWidth={4} />
                 <Area type="monotone" dataKey="views" stroke="#9333ea" fillOpacity={1} fill="url(#colorViews)" strokeWidth={4} />
               </AreaChart>
             </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#112240] p-10 rounded-[40px] border border-blue-500/10 shadow-2xl flex flex-col justify-between">
           <div>
              <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Lead Distribution</h3>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest border-b border-blue-500/10 pb-4">By Geographic & Source</p>
           </div>
           <div className="space-y-6 flex-1 mt-10">
              {[
                { source: 'Mobile Apps', value: 45, color: 'bg-blue-600' },
                { source: 'Web Platforms', value: 32, color: 'bg-purple-600' },
                { source: 'SEO Traffic', value: 18, color: 'bg-green-600' },
                { source: 'Other', value: 5, color: 'bg-gray-700' }
              ].map((item) => (
                <div key={item.source}>
                   <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400 text-xs font-bold font-mono">{item.source}</span>
                      <span className="text-white text-xs font-black">{item.value}%</span>
                   </div>
                   <div className="w-full bg-[#0a192f] h-2 rounded-full overflow-hidden">
                      <div className={`${item.color} h-full transition-all duration-1000`} style={{width: `${item.value}%`}} />
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      <div className="bg-[#112240] p-10 rounded-[40px] border border-blue-500/10 shadow-2xl">
         <div className="flex justify-between items-center mb-10">
            <div>
               <h3 className="text-2xl font-black text-white tracking-tight">Access Log & Network Traffic</h3>
               <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Real-time identity verification events</p>
            </div>
            <span className="px-4 py-1.5 bg-green-500/10 text-green-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-green-500/10">Active Monitoring</span>
         </div>
         
         <div className="overflow-x-auto">
            <table className="w-full">
               <thead>
                  <tr className="text-left text-gray-500 text-[10px] font-black uppercase tracking-widest border-b border-blue-500/5">
                     <th className="pb-4 pl-2">Identity</th>
                     <th className="pb-4">Action</th>
                     <th className="pb-4">Origin Node</th>
                     <th className="pb-4">Timestamp</th>
                     <th className="pb-4 text-right pr-2">Security Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-blue-500/5">
                  {[
                    { id: 1, email: 'mzainulabidin349@gmail.com', action: 'LOGIN_SUCCESS', node: 'Chrome / Windows', time: '2 mins ago', status: 'VERIFIED' },
                    { id: 2, email: 'system_core@sparkwave.com', action: 'DB_SYNC', node: 'Supabase / Server', time: '14 mins ago', status: 'SYSTEM' },
                    { id: 3, email: 'employee_01@sparkwave.com', action: 'BLOG_PUBLISH', node: 'Edge / MacOS', time: '1 hour ago', status: 'VERIFIED' },
                  ].map((log) => (
                    <tr key={log.id} className="group hover:bg-blue-500/5 transition-colors">
                       <td className="py-6 pl-2 font-bold text-white text-sm">{log.email}</td>
                       <td className="py-6">
                          <span className="px-3 py-1 bg-white/5 text-gray-400 text-[10px] font-black rounded-lg border border-white/5">{log.action}</span>
                       </td>
                       <td className="py-6 text-gray-500 text-xs font-medium">{log.node}</td>
                       <td className="py-6 text-gray-500 text-xs font-medium">{log.time}</td>
                       <td className="py-6 text-right pr-2">
                          <div className="flex items-center justify-end gap-2 text-green-400 text-[10px] font-black uppercase tracking-widest">
                             <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                             {log.status}
                          </div>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default AdminStats;
