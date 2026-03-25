import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ClientModulePlaceholder from '../pages/ClientModulePlaceholder';

export default function ClientRedirect({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'client') {
    return <ClientModulePlaceholder />;
  }

  return children;
}

