import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import HomeDashboard from './pages/HomeDashboard';
import Statistics from './pages/Statistics';
import UserProfile from './pages/UserProfile';
import Notifications from './pages/Notifications';

const App: React.FC = () => {
  return (
    <Routes>
      {/* Public routes (no Layout) */}
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Protected routes (with Layout) */}
      <Route path="/onboarding" element={<Layout><Onboarding /></Layout>} />
      <Route path="/" element={<Layout><HomeDashboard /></Layout>} />
      <Route path="/statistics" element={<Layout><Statistics /></Layout>} />
      <Route path="/user" element={<Layout><UserProfile /></Layout>} />
      <Route path="/notifications" element={<Layout><Notifications /></Layout>} />
      
      {/* Redirect to welcome for any unknown route */}
      <Route path="*" element={<Navigate to="/welcome" replace />} />
    </Routes>
  );
};

export default App;
