import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import ProjectDetail from './components/ProjectDetail';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/dashboard/DashboardLayout';
import AdminStats from './components/dashboard/AdminStats';
import AdminLeads from './components/dashboard/AdminLeads';
import AdminChat from './components/dashboard/AdminChat';
import AdminMeetings from './components/dashboard/AdminMeetings';
import AdminBlogs from './components/dashboard/AdminBlogs';
import AdminUsers from './components/dashboard/AdminUsers';
import AdminSettings from './components/dashboard/AdminSettings';
import ClientPortal from './components/ClientPortal';

/**
 * ADMIN OS - INTERNAL DASHBOARD HANDLER
 */
const AdminDashboard = () => {
  const { role, user, loading } = useAuth();
  
  if (loading) return null;

  return (
    <DashboardLayout>
      <Routes>
        {/* Dynamic Home based on role */}
        <Route index element={role === 'employee' ? <AdminChat /> : <AdminStats />} />
        
        {/* Universal Routes */}
        <Route path="blogs" element={<AdminBlogs />} />
        <Route path="chat" element={<AdminChat />} />
        
        {/* Management Routes (Admin/SuperAdmin only) */}
        {(role === 'super_admin' || role === 'admin') && (
          <>
            <Route path="meetings" element={<AdminMeetings />} />
            <Route path="leads" element={<AdminLeads />} />
            <Route path="analytics" element={<AdminStats />} />
          </>
        )}

        {/* Super Admin Restricted */}
        {role === 'super_admin' && (
          <>
            <Route path="users" element={<AdminUsers />} />
            <Route path="settings" element={<AdminSettings />} />
          </>
        )}
        
        {/* Auto Redirect to Home */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

function App() {
  useEffect(() => {
    document.title = 'SparkWave Digitals | Build. Scale. Succeed.';
    
    // EMERGENCY LOCK PURGE: Clear the old broken v3 locks to ensure clean v4 initialization
    if (localStorage.getItem('sparkwave-auth-v3')) {
        console.log("System Guard: Purging legacy authentication locks...");
        localStorage.removeItem('sparkwave-auth-v3');
        window.location.reload();
    }
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="App overflow-x-hidden w-full bg-[#0a192f]">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            
            {/* Admin OS Gate */}
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute allowedRoles={['super_admin', 'admin', 'employee']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Client Portal Gate */}
            <Route 
              path="/portal/*" 
              element={
                <ProtectedRoute allowedRoles={['client']}>
                  <ClientPortal />
                </ProtectedRoute>
              } 
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
