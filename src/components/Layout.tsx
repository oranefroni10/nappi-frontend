import React, { type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#F8F9FA'
    }}>
      {/* Header */}
      <header style={{ 
        background: 'white',
        padding: '1rem 1.5rem',
        borderBottom: '1px solid #E5E7EB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>👶</span>
          <h1 style={{ 
            margin: 0, 
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#1F2937'
          }}>
            nappi
          </h1>
        </div>
        <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </div>
      </header>

      {/* Main Content */}
      <main style={{ 
        flex: 1,
        padding: '1.5rem',
        overflow: 'auto'
      }}>
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav style={{ 
        background: 'white',
        borderTop: '1px solid #E5E7EB',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '0.75rem 0',
        position: 'sticky',
        bottom: 0
      }}>
        <NavItem 
          to="/" 
          icon="🏠" 
          label="Home" 
          active={isActive('/')} 
        />
        <NavItem 
          to="/statistics" 
          icon="📊" 
          label="Stats" 
          active={isActive('/statistics')} 
        />
        <NavItem 
          to="/notifications" 
          icon="🔔" 
          label="Alerts" 
          active={isActive('/notifications')} 
        />
        <NavItem 
          to="/user" 
          icon="👤" 
          label="Profile" 
          active={isActive('/user')} 
        />
      </nav>
    </div>
  );
};

interface NavItemProps {
  to: string;
  icon: string;
  label: string;
  active: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, active }) => (
  <Link
    to={to}
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.25rem',
      textDecoration: 'none',
      color: active ? '#FFD166' : '#6B7280',
      fontSize: '0.75rem',
      minWidth: '60px',
      transition: 'color 0.2s'
    }}
  >
    <span style={{ fontSize: '1.5rem' }}>{icon}</span>
    <span style={{ fontWeight: active ? '600' : '400' }}>{label}</span>
  </Link>
);

export default Layout;
