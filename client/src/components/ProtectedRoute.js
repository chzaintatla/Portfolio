import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, role } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a192f]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Use the centralized resilient role from AuthContext
  if (allowedRoles && !allowedRoles.includes(role)) {
    console.warn("Access Denied: Role mismatch.", { role, allowedRoles });
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
