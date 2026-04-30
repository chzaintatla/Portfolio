import React, { useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import ProjectDetail from './components/ProjectDetail';
import BlogList from './components/blog/BlogList';
import BlogDetail from './components/blog/BlogDetail';
import ProtectedRoute from './components/ProtectedRoute';
import FloatingChat from './components/FloatingChat';

// PERFORMANCE OPTIMIZATION: Lazy Loading Dashboard Node
const DashboardLayout = React.lazy(() => import('./components/dashboard/DashboardLayout'));
const AdminStats = React.lazy(() => import('./components/dashboard/AdminStats'));
const AdminLeads = React.lazy(() => import('./components/dashboard/AdminLeads'));
const AdminChat = React.lazy(() => import('./components/dashboard/AdminChat'));
const AdminMeetings = React.lazy(() => import('./components/dashboard/AdminMeetings'));
const AdminBlogs = React.lazy(() => import('./components/dashboard/AdminBlogs'));
const AdminUsers = React.lazy(() => import('./components/dashboard/AdminUsers'));
const AdminSettings = React.lazy(() => import('./components/dashboard/AdminSettings'));
const ClientPortal = React.lazy(() => import('./components/ClientPortal'));

/**
 * ADMIN OS - INTERNAL DASHBOARD HANDLER
 */
const AdminDashboard = () => {
  const { role, user, loading } = useAuth();
  
  if (loading) return null;

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a192f] flex items-center justify-center text-blue-500 font-bold uppercase tracking-widest animate-pulse">Initializing Dashboard Domain...</div>}>
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
    </Suspense>
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
        <Suspense fallback={<div className="min-h-screen bg-[#0a192f] flex items-center justify-center text-blue-500 font-bold uppercase tracking-widest animate-pulse">Loading SparkWave OS...</div>}>
          <div className="App overflow-x-hidden w-full bg-[#0a192f]">
            <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            
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
          <FloatingChat />
        </div>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
