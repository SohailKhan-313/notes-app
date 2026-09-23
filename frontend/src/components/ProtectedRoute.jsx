import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAuthChecking } = useAuth();
  const location = useLocation();

  if (isAuthChecking) {
    return (
      <div className="full-screen-loader">
        <div className="spinner"></div>
        <p>Restoring your workspace...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
