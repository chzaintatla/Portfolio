import { useState } from 'react';
import { FiGlobe, FiShield, FiCpu, FiLayout, FiKey } from 'react-icons/fi';
import { supabase } from '../../config/supabase';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    googleAnalytics: 'UA-12345678-1',
    brandingName: 'SparkWave Digital',
    cdnEnabled: true,
    aiModel: 'GPT-4 / Claude 3',
    backupFrequency: 'Daily'
  });

  const Toggle = ({ enabled, onChange }) => (
    <button 
      onClick={onChange}
      className={`w-14 h-7 rounded-full transition-all relative ${enabled ? 'bg-blue-600' : 'bg-[#0a192f] border border-blue-500/20'}`}
    >
      <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${enabled ? 'left-8' : 'left-1'}`} />
    </button>
  );

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter">Institutional Protocols</h1>
          <p className="text-gray-400 mt-2 font-medium italic">Global configuration and system-level parameters.</p>
        </div>
        <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-105 transition-all">Synchronize All Nodes</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Core Configuration */}
        <div className="bg-[#112240] p-10 rounded-[48px] border border-blue-500/10 shadow-2xl space-y-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-600/10 text-blue-500 rounded-2xl border border-blue-500/10"><FiLayout size={24} /></div>
            <h3 className="text-xl font-black text-white">Interface & Branding</h3>
          </div>
          
          <div className="space-y-6">
            <div className="group">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 pl-1 text-blue-400">Platform Identity</label>
              <input value={settings.brandingName} onChange={e => setSettings({...settings, brandingName: e.target.value})} className="w-full bg-[#0a192f] border border-blue-500/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-blue-500/40 transition-all" />
            </div>
            <div className="flex items-center justify-between p-6 bg-[#0a192f] rounded-[24px] border border-blue-500/5">
              <div>
                <h4 className="text-white font-bold text-sm italic">Maintenance Gateway</h4>
                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mt-1">Restrict public access to all services</p>
              </div>
              <Toggle enabled={settings.maintenanceMode} onChange={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})} />
            </div>
          </div>
        </div>

        {/* Global SEO & Analytics */}
        <div className="bg-[#112240] p-10 rounded-[48px] border border-blue-500/10 shadow-2xl space-y-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-600/10 text-emerald-500 rounded-2xl border border-emerald-500/10"><FiGlobe size={24} /></div>
            <h3 className="text-xl font-black text-white">Global SEO Matrix</h3>
          </div>
          
          <div className="space-y-6">
            <div className="group">
              <label className="block text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-3 pl-1">Telemetry ID (Google Analytics)</label>
              <input value={settings.googleAnalytics} onChange={e => setSettings({...settings, googleAnalytics: e.target.value})} className="w-full bg-[#0a192f] border border-emerald-500/10 rounded-2xl px-6 py-4 text-white font-mono text-sm outline-none focus:border-emerald-500/40 transition-all" />
            </div>
            <div className="flex items-center justify-between p-6 bg-[#0a192f] rounded-[24px] border border-blue-500/5">
              <div>
                <h4 className="text-white font-bold text-sm italic">CDN Acceleration</h4>
                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mt-1">Edge distribution for global assets</p>
              </div>
              <Toggle enabled={settings.cdnEnabled} onChange={() => setSettings({...settings, cdnEnabled: !settings.cdnEnabled})} />
            </div>
          </div>
        </div>

        {/* Intelligence Config */}
        <div className="bg-[#112240] p-10 rounded-[48px] border border-blue-500/10 shadow-2xl space-y-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-600/10 text-purple-500 rounded-2xl border border-purple-500/10"><FiCpu size={24} /></div>
            <h3 className="text-xl font-black text-white">Semantic AI Kernels</h3>
          </div>
          
          <div className="space-y-6">
             <div className="grid grid-cols-2 gap-4">
                {['GPT-4o', 'Claude 3.5 Sonnet', 'Gemini 1.5 Pro', 'Llama 3 Local'].map(model => (
                  <button 
                    key={model}
                    onClick={() => setSettings({...settings, aiModel: model})}
                    className={`py-4 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${settings.aiModel === model ? 'bg-purple-600/10 border-purple-500 text-purple-400' : 'bg-[#0a192f] border-purple-500/5 text-gray-500'}`}
                  >
                    {model}
                  </button>
                ))}
             </div>
          </div>
        </div>

        {/* Security & Data */}
        <div className="bg-[#112240] p-10 rounded-[48px] border border-blue-500/10 shadow-2xl space-y-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-red-600/10 text-red-500 rounded-2xl border border-red-500/10"><FiShield size={24} /></div>
            <h3 className="text-xl font-black text-white">Vault Security</h3>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-6 bg-[#0a192f] rounded-[24px] border border-red-500/5">
              <div>
                <h4 className="text-white font-bold text-sm italic">Encrypted Backups</h4>
                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mt-1">Automatic snapshot of all data</p>
              </div>
              <select className="bg-[#112240] border border-red-500/10 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl outline-none">
                <option>Every 6 Hours</option>
                <option selected>Daily at 00:00</option>
                <option>Weekly Matrix</option>
              </select>
            </div>
            
            <button className="w-full py-4 bg-red-500/5 hover:bg-red-500/10 text-red-500 border border-red-500/10 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all">Initialize Factory Reset</button>
          </div>
        </div>

        {/* Password Security Node */}
        <div className="bg-[#112240] p-10 rounded-[48px] border border-blue-500/10 shadow-2xl space-y-8 col-span-1 lg:col-span-2 scrollable-terminal custom-scrollbar">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-amber-600/10 text-amber-500 rounded-2xl border border-amber-500/10"><FiKey size={24} /></div>
            <h3 className="text-xl font-black text-white">Access Key Rotation</h3>
          </div>
          
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={async (e) => {
             e.preventDefault();
             const newPass = e.target.newPass.value;
             try {
                const { error } = await supabase.auth.updateUser({ password: newPass });
                if (error) throw error;
                alert("Security Gateway Updated: Access Key Synchronized.");
                e.target.reset();
             } catch (err) {
                alert("Security Protocol Refused: " + err.message);
             }
          }}>
             <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">New Terminal Password</label>
                <input name="newPass" type="password" required className="w-full bg-[#0a192f] border border-blue-500/10 rounded-2xl px-6 py-4 text-white font-bold outline-none font-mono" />
             </div>
             <div className="flex items-end pb-1">
                <button type="submit" className="w-full py-4 bg-amber-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-amber-500/20 hover:bg-amber-700 transition-all">Update Access Node</button>
             </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
