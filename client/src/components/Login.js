import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiShield, FiHelpCircle } from 'react-icons/fi';
import { supabase } from '../config/supabase';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [superAdminExists, setSuperAdminExists] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('employee');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin'; // Default to admin for staff

  useEffect(() => {
    checkSuperAdmin();
  }, []);

  const checkSuperAdmin = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'super_admin')
      .limit(1);
    
    if (data && data.length > 0) {
      setSuperAdminExists(true);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/login`,
        });
        if (error) throw error;
        setSuccess('Reset link dispatched. Check your transmission inbox.');
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        const { data, error } = await signIn({ email, password });
        if (error) throw error;
        
        // Log Activity (Non-blocking)
        supabase.from('user_activity').insert({
            email,
            action: 'LOGIN_SUCCESS',
            user_agent: navigator.userAgent
        }).then();

        // HYBRID ROLE DETECTION: Fallback to metadata if DB is locked/recursive
        const userMetadataRole = data.user?.user_metadata?.role;
        const finalRole = userMetadataRole || (email === 'mzainulabidin349@gmail.com' ? 'super_admin' : 'client');
        
        console.log("Login Success. Role found:", finalRole);

        if (finalRole === 'super_admin' || finalRole === 'admin' || finalRole === 'employee') {
          // GENERATE SESSION TOKEN FOR SUPER ADMIN
          if (finalRole === 'super_admin') {
            const newSessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
            localStorage.setItem('sparkwave_master_session', newSessionId);
            
            // Sync to DB (Non-blocking but critical)
            supabase.from('profiles').update({ 
               active_session_id: newSessionId,
               last_login: new Date()
            }).eq('id', data.user.id).then();
          }

          navigate('/admin', { replace: true });
        } else {
          // Send clients to their specific dashboardportal
          navigate('/portal', { replace: true });
        }
      } else {
        // Prevent duplicate Super Admin
        if (role === 'super_admin' && superAdminExists) {
            throw new Error("System violation: Super Administrator protocol already established.");
        }

        const { data, error: signUpError } = await signUp({ 
            email, 
            password,
            options: { 
                data: { 
                    full_name: fullName,
                    role: role // Store role in metadata to bypass RLS recursion
                } 
            }
        });

        if (signUpError) throw signUpError;

        if (data?.user) {
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert({
                    id: data.user.id,
                    full_name: fullName,
                    role: role,
                    updated_at: new Date()
                });
            
            if (profileError) throw profileError;
            
            setSuccess('Initialization complete. Protocol established.');
            checkSuperAdmin(); // Update check
            setTimeout(() => {
                setIsLogin(true);
                setSuccess('');
            }, 2000);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (isForgotPassword) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#050b1a] px-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-[480px] bg-[#0d152a]/80 backdrop-blur-3xl p-12 rounded-[48px] border border-blue-500/10 shadow-2xl">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-600/10 text-orange-500 mb-6 border border-orange-500/10">
                        <FiHelpCircle size={32} />
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight">Recover Access</h2>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-2">Emergency Credential Reset</p>
                </div>
                <form onSubmit={handleResetPassword} className="space-y-6">
                    {error && <div className="text-red-400 text-xs font-bold bg-red-500/10 p-4 rounded-2xl border border-red-500/20">{error}</div>}
                    {success && <div className="text-green-400 text-xs font-bold bg-green-500/10 p-4 rounded-2xl border border-green-500/20">{success}</div>}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-gray-600 group-focus-within:text-blue-500 transition-colors">
                            <FiMail size={18} />
                        </div>
                        <input type="email" required className="block w-full pl-14 pr-6 py-5 bg-[#050b1a] border border-blue-500/5 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold text-sm" placeholder="Enterprise ID" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <button type="submit" disabled={loading} className="w-full py-5 bg-gradient-to-r from-orange-600 to-red-700 text-white font-black rounded-2xl shadow-xl shadow-orange-500/20">{loading ? 'Processing...' : 'SEND RESET SIGNAL'}</button>
                    <button type="button" onClick={() => setIsForgotPassword(false)} className="w-full text-center text-gray-500 text-xs font-bold hover:text-white transition-colors">Return to Authorization</button>
                </form>
            </motion.div>
        </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050b1a] px-4 relative selection:bg-blue-500/30">
      {/* Background Mesh */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
         <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[160px] animate-pulse" />
         <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[160px]" style={{animationDelay: '2s'}} />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[480px] z-10">
        <div className="bg-[#0d152a]/80 backdrop-blur-3xl p-12 rounded-[48px] shadow-2xl border border-blue-500/10 relative overflow-hidden">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-[28px] bg-gradient-to-br from-blue-600 to-indigo-700 text-white mb-8 border border-white/10">
              <FiShield size={36} />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight mb-3">SparkWave <span className="italic font-serif opacity-70">OS</span></h1>
            <p className="text-gray-500 text-[10px] font-black tracking-[0.3em] uppercase">{isLogin ? 'Authorization Required' : 'Asset Registry'}</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <AnimatePresence>
               {error && <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} className="bg-red-500/5 text-red-400 p-4 rounded-2xl text-[11px] font-bold border border-red-500/20">{error}</motion.div>}
               {success && <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} className="bg-green-500/5 text-green-400 p-4 rounded-2xl text-[11px] font-bold border border-green-500/20">{success}</motion.div>}
            </AnimatePresence>

            <div className="space-y-4">
              {/* PUBLIC REGISTRY RESTRICTED TO CLIENTS ONLY */}
              {!isLogin && (
                <>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-5 flex items-center text-gray-600 group-focus-within:text-blue-500"><FiUser size={18} /></div>
                    <input type="text" required className="block w-full pl-14 pr-6 py-5 bg-[#050b1a] border border-blue-500/5 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold text-sm" placeholder="Client Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                  </div>
                  <div className="p-4 bg-blue-600/5 border border-blue-500/10 rounded-2xl">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-relaxed">System Note: Professional clearance (Admin/Staff) must be provisioned by the Super Admin through the Institutional Protocols.</p>
                  </div>
                </>
              )}
              <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center text-gray-600 group-focus-within:text-blue-500"><FiMail size={18} /></div>
                <input type="email" required className="block w-full pl-14 pr-6 py-5 bg-[#050b1a] border border-blue-500/5 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold text-sm" placeholder="ID / Identity" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center text-gray-600 group-focus-within:text-blue-500"><FiLock size={18} /></div>
                <input type="password" required className="block w-full pl-14 pr-6 py-5 bg-[#050b1a] border border-blue-500/5 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold text-sm" placeholder="Access Key" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>

            <div className="pt-6">
              <button type="submit" disabled={loading} className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-[13px] font-black rounded-2xl shadow-xl shadow-blue-500/30 disabled:opacity-50 uppercase tracking-widest">
                {loading ? 'Validating...' : (isLogin ? 'VERIFY IDENTITY' : 'PROVISION ASSET')}
              </button>
            </div>
            
            <div className="flex flex-col gap-5 text-center pt-8 border-t border-blue-500/5">
               {isLogin && <button type="button" onClick={() => setIsForgotPassword(true)} className="text-gray-600 hover:text-blue-400 font-bold text-[10px] uppercase tracking-widest transition-colors">Lost Access Key? Emergency Recovery</button>}
               <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-gray-500 hover:text-blue-400 font-black text-[11px] uppercase tracking-widest transition-colors">
                 {isLogin ? "PROTOCOL: New Account Registry" : "PROTOCOL: Access Authorization"}
               </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
