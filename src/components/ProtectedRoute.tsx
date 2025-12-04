import React from 'react';
import { Navigate } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const stored = localStorage.getItem('nappi_user');
  
  if (!stored) {
    // Not logged in - redirect to welcome
    return <Navigate to="/welcome" replace />;
  }

  try {
    const user = JSON.parse(stored);
    
    // Check if user has a baby (except for onboarding route)
    if (!user.baby_id && window.location.pathname !== '/onboarding') {
      return <Navigate to="/onboarding" replace />;
    }
  } catch {
    // Invalid data in localStorage - redirect to welcome
    localStorage.removeItem('nappi_user');
    return <Navigate to="/welcome" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

