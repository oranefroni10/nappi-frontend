import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AuthUser } from '../types/auth';

// Helper function to calculate age from birthdate
const calculateAge = (birthdate: string): string => {
  const birth = new Date(birthdate);
  const today = new Date();
  const months = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
  
  if (months < 1) {
    const days = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    return `${days} days`;
  } else if (months < 24) {
    return `${months} month${months !== 1 ? 's' : ''}`;
  } else {
    const years = Math.floor(months / 12);
    return `${years} year${years !== 1 ? 's' : ''}`;
  }
};

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('nappi_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('nappi_user');
    navigate('/login');
  };

  const babyAge = user?.baby?.birthdate ? calculateAge(user.baby.birthdate) : null;

  return (
    <div style={{ padding: '0.5rem' }}>
      {/* Profile Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
        borderRadius: '20px',
        padding: '2rem 1.5rem',
        marginBottom: '1.5rem',
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
          fontSize: '2.5rem',
          border: '3px solid rgba(255,255,255,0.3)'
        }}>
          👤
        </div>
        <h2 style={{ margin: '0 0 0.25rem 0', fontSize: '1.5rem', fontWeight: '600' }}>
          {user?.username || 'User'}
        </h2>
        <p style={{ margin: 0, opacity: 0.9, fontSize: '0.9rem' }}>
          Parent Account
        </p>
      </div>

      {/* Baby Info Card */}
      {user?.baby && (
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '1.5rem',
          marginBottom: '1rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{ 
            margin: '0 0 1rem 0', 
            fontSize: '1.1rem', 
            color: '#1F2937',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>👶</span> Baby Information
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <ProfileRow label="Name" value={`${user.baby.first_name} ${user.baby.last_name}`} />
            <ProfileRow label="Age" value={babyAge || 'Unknown'} />
            <ProfileRow label="Birthdate" value={new Date(user.baby.birthdate).toLocaleDateString()} />
          </div>
        </div>
      )}

      {/* Settings Card */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '1.5rem',
        marginBottom: '1rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
      }}>
        <h3 style={{ 
          margin: '0 0 1rem 0', 
          fontSize: '1.1rem', 
          color: '#1F2937',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>⚙️</span> Settings
        </h3>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.75rem 0',
          borderBottom: '1px solid #F3F4F6'
        }}>
          <div>
            <p style={{ margin: 0, fontWeight: '500', color: '#374151' }}>Push Notifications</p>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: '#9CA3AF' }}>
              Get alerts when baby wakes up
            </p>
          </div>
          <ToggleSwitch 
            enabled={notificationsEnabled} 
            onChange={setNotificationsEnabled} 
          />
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.75rem 0'
        }}>
          <div>
            <p style={{ margin: 0, fontWeight: '500', color: '#374151' }}>Dark Mode</p>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: '#9CA3AF' }}>
              Coming soon
            </p>
          </div>
          <ToggleSwitch enabled={false} onChange={() => {}} disabled />
        </div>
      </div>

      {/* Account Actions */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '1.5rem',
        marginBottom: '1rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
      }}>
        <h3 style={{ 
          margin: '0 0 1rem 0', 
          fontSize: '1.1rem', 
          color: '#1F2937',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>🔐</span> Account
        </h3>

        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '1rem',
            background: 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)',
            border: 'none',
            borderRadius: '12px',
            color: '#DC2626',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <span>🚪</span> Log Out
        </button>
      </div>

      {/* App Info */}
      <p style={{ 
        textAlign: 'center', 
        color: '#9CA3AF', 
        fontSize: '0.75rem',
        marginTop: '2rem'
      }}>
        Nappi v1.0.0 • Made with 💛 for better baby sleep
      </p>
    </div>
  );
};

const ProfileRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 0',
    borderBottom: '1px solid #F3F4F6'
  }}>
    <span style={{ color: '#6B7280', fontSize: '0.95rem' }}>{label}</span>
    <span style={{ color: '#1F2937', fontWeight: '500', fontSize: '0.95rem' }}>{value}</span>
  </div>
);

const ToggleSwitch: React.FC<{ 
  enabled: boolean; 
  onChange: (val: boolean) => void;
  disabled?: boolean;
}> = ({ enabled, onChange, disabled }) => (
  <button
    onClick={() => !disabled && onChange(!enabled)}
    disabled={disabled}
    style={{
      width: '50px',
      height: '28px',
      borderRadius: '14px',
      border: 'none',
      background: enabled ? '#10B981' : '#E5E7EB',
      cursor: disabled ? 'not-allowed' : 'pointer',
      position: 'relative',
      transition: 'background 0.2s',
      opacity: disabled ? 0.5 : 1
    }}
  >
    <div style={{
      width: '22px',
      height: '22px',
      borderRadius: '50%',
      background: 'white',
      position: 'absolute',
      top: '3px',
      left: enabled ? '25px' : '3px',
      transition: 'left 0.2s',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    }} />
  </button>
);

export default UserProfile;
