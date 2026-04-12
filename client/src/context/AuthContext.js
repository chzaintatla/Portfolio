import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../config/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        
        if (currentUser) {
          // fetchProfile is now non-blocking for the initial UI render
          fetchProfile(currentUser.id);
        }
      } catch (err) {
        console.error("Auth Init Error:", err);
      } finally {
        // We set loading to false as soon as the Auth session is determined
        // regardless of whether the profile has finished loading.
        setLoading(false);
      }
    };

    checkSession();

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          fetchProfile(currentUser.id);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn('Profile DB fetch blocked (Recursion?):', error.message);
        return;
      }

      // SINGLE NODE AUTHORITY: Enforce 1 device limit for Super Admin
      if (data.role === 'super_admin') {
         const localSessionId = localStorage.getItem('sparkwave_master_session');
         const currentDbSession = data.active_session_id;

         if (!localSessionId) {
            // First load/New login, sync local with DB
            localStorage.setItem('sparkwave_master_session', currentDbSession);
         } else if (localSessionId !== currentDbSession) {
            // DETECTED SESSION STEALING: Another device took the lock
            console.error("SECURITY ALERT: Single Node Authority Violation. Terminating current session.");
            supabase.auth.signOut();
            window.location.href = '/login?error=session_conflict';
            return;
         }
      }

      setProfile(data);
    } catch (error) {
      console.error('Error in fetchProfile:', error.message);
    }
  };

  // HYBRID ROLE DETECTION: Fallback to metadata if DB is locked/recursive
  let effectiveRole = profile?.role || user?.user_metadata?.role;

  // EMERGENCY MASTER BYPASS & CLIENT DEFAULT
  if (!effectiveRole && user) {
    if (user.email === 'mzainulabidin349@gmail.com') {
      effectiveRole = 'super_admin';
    } else {
      effectiveRole = 'client'; // Default to client if no role found
    }
  }

  const value = {
    signUp: (data) => supabase.auth.signUp(data),
    signIn: (data) => supabase.auth.signInWithPassword(data),
    signOut: () => supabase.auth.signOut(),
    user,
    profile,
    isAdmin: effectiveRole === 'super_admin' || effectiveRole === 'admin',
    isEmployee: effectiveRole === 'employee',
    isClient: effectiveRole === 'client',
    role: effectiveRole,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
