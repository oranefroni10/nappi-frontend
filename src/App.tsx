import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
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
      <Route path="/onboarding" element={
        <ProtectedRoute>
          <Layout><Onboarding /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/" element={
        <ProtectedRoute>
          <HomeDashboard />
        </ProtectedRoute>
      } />
      <Route path="/statistics" element={
        <ProtectedRoute>
          <Statistics />
        </ProtectedRoute>
      } />
      <Route path="/user" element={
        <ProtectedRoute>
          <UserProfile />
        </ProtectedRoute>
      } />
      <Route path="/notifications" element={
        <ProtectedRoute>
          <Notifications />
        </ProtectedRoute>
      } />
      
      {/* Redirect to welcome for any unknown route */}
      <Route path="*" element={<Navigate to="/welcome" replace />} />
    </Routes>
  );
};

export default App;
