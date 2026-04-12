import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, 
  FiFileText, 
  FiMessageSquare, 
  FiCalendar, 
  FiUsers, 
  FiTrendingUp, 
  FiSettings, 
  FiLogOut,
  FiShield
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { signOut, role, profile } = useAuth();

  const menuItems = [
    { title: 'Command Center', icon: <FiHome />, path: '/admin', roles: ['super_admin', 'admin', 'employee'] },
    { title: 'Manuscript Engine', icon: <FiFileText />, path: '/admin/blogs', roles: ['super_admin', 'admin', 'employee'] },
    { title: 'Global Sync Matrix', icon: <FiMessageSquare />, path: '/admin/chat', roles: ['super_admin', 'admin', 'employee'] },
    { title: 'Strategy Briefings', icon: <FiCalendar />, path: '/admin/meetings', roles: ['super_admin', 'admin'] },
    { title: 'Capital Funnel (Leads)', icon: <FiUsers />, path: '/admin/leads', roles: ['super_admin', 'admin'] },
    { title: 'ROI Intelligence', icon: <FiTrendingUp />, path: '/admin/analytics', roles: ['super_admin', 'admin'] },
    { title: 'Personnel Archive', icon: <FiShield />, path: '/admin/users', roles: ['super_admin'] },
    { title: 'Institutional Protocols', icon: <FiSettings />, path: '/admin/settings', roles: ['super_admin'] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(role));

  return (
    <div className="h-screen w-72 bg-[#112240] text-gray-300 flex flex-col border-r border-blue-500/10 shadow-2xl z-20">
      <div className="p-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <FiShield size={24} />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">SparkWave OS</h2>
        </div>
        <div className="flex items-center space-x-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full w-fit">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[10px] text-blue-400 font-black uppercase tracking-widest">
            {profile?.role?.replace('_', ' ') || 'Staff'}
          </span>
        </div>
      </div>
      
      <nav className="flex-1 mt-4 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        {filteredMenu.map((item) => (
          <NavLink
            key={item.title}
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) => 
              `flex items-center space-x-3 px-5 py-4 rounded-2xl transition-all group ${
                isActive 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-500/20 translate-x-1' 
                : 'hover:bg-blue-600/5 hover:text-white'
              }`
            }
          >
            <span className={`text-xl transition-transform group-hover:scale-110`}>{item.icon}</span>
            <span className="font-bold tracking-wide text-sm">{item.title}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-6 mt-auto border-t border-blue-500/5">
        <div className="bg-[#0a192f] p-4 rounded-2xl mb-4 border border-blue-500/5">
           <p className="text-xs text-gray-500 font-bold uppercase mb-1">Signed in as</p>
           <p className="text-white text-sm font-bold truncate">{profile?.full_name || 'Administrator'}</p>
        </div>
        <button
          onClick={signOut}
          className="flex items-center space-x-3 w-full px-5 py-4 text-red-400 hover:bg-red-500/10 rounded-2xl transition-all font-bold text-sm"
        >
          <FiLogOut />
          <span>Terminate Session</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
