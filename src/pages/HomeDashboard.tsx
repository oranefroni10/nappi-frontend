import React, { useEffect, useState } from 'react';
import { fetchLastSleepSummary } from '../api/sleep';
import { fetchCurrentRoomMetrics } from '../api/room';
import type { LastSleepSummary, RoomMetrics } from '../types/metrics';
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

// Get greeting based on time of day
const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const HomeDashboard: React.FC = () => {
  const [sleepSummary, setSleepSummary] = useState<LastSleepSummary | null>(null);
  const [roomMetrics, setRoomMetrics] = useState<RoomMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    // Load user from localStorage
    const stored = localStorage.getItem('nappi_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [sleep, room] = await Promise.all([
        fetchLastSleepSummary(),
        fetchCurrentRoomMetrics(),
      ]);
      setSleepSummary(sleep);
      setRoomMetrics(room);
    } catch (err) {
      console.error(err);
      setError('Failed to load data from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Get baby name from user data or fallback to sleep summary
  const babyName = user?.baby?.first_name || sleepSummary?.baby_name || 'Baby';
  const babyAge = user?.baby?.birthdate ? calculateAge(user.baby.birthdate) : null;

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '50vh'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '3rem', 
            marginBottom: '1rem',
            animation: 'pulse 1.5s ease-in-out infinite'
          }}>
            👶
          </div>
          <p style={{ color: '#6B7280' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p style={{ color: '#EF4444', marginBottom: '1rem' }}>{error}</p>
        <button
          onClick={loadData}
          style={{
            background: '#FFD166',
            border: 'none',
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '0.5rem' }}>
      {/* Greeting Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ 
          margin: '0 0 0.25rem 0', 
          fontSize: '1.75rem', 
          color: '#1F2937',
          fontWeight: '600'
        }}>
          {getGreeting()}, {user?.username || 'there'}! 👋
        </h1>
        <p style={{ 
          margin: 0, 
          color: '#6B7280',
          fontSize: '1rem'
        }}>
          Here&apos;s how {babyName} is doing today
        </p>
      </div>

      {/* Baby Profile Card */}
      <div style={{
        background: 'linear-gradient(135deg, #FFE4E1 0%, #E6F7FF 100%)',
        borderRadius: '20px',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #B4E7E5 0%, #7DD3C8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.25rem',
            boxShadow: '0 4px 8px rgba(125, 211, 200, 0.3)'
          }}>
            👶
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#1F2937', fontWeight: '600' }}>
              {babyName}
            </h2>
            {babyAge && (
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#6B7280' }}>
                {babyAge} old
              </p>
            )}
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '1.25rem',
          marginBottom: '1rem'
        }}>
          <h3 style={{ 
            margin: '0 0 1rem 0', 
            fontSize: '1.1rem',
            color: '#374151',
            fontWeight: '600'
          }}>
            Last Nap Summary
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <InfoRow icon="⏰" label="Nap Time" value="9:20 - 11:15" />
            <InfoRow icon="🌡️" label="Average Temp" value={`${roomMetrics?.temperature_c.toFixed(0) || '--'}°C`} />
            <InfoRow icon="🔊" label="Noise Level" value={`${roomMetrics?.noise_db.toFixed(0) || '--'} dB`} />
            <InfoRow icon="💧" label="Humidity" value={`${roomMetrics?.humidity_percent.toFixed(0) || '--'}%`} />
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '1.25rem'
        }}>
          <h4 style={{ 
            margin: '0 0 1rem 0', 
            fontSize: '1rem',
            color: '#374151',
            fontWeight: '600'
          }}>
            {babyName}&apos;s Sleep Preferences
          </h4>
          
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <MetricCard icon="🌡️" label="Temp" value="−" trend="cooler" />
            <MetricCard icon="☀️" label="Light" value="+" trend="brighter" />
            <MetricCard icon="💧" label="Humidity" value="+" trend="more" />
          </div>

          <p style={{
            fontSize: '0.85rem',
            color: '#6B7280',
            marginTop: '1rem',
            marginBottom: 0,
            lineHeight: '1.5',
            background: '#F9FAFB',
            padding: '0.75rem',
            borderRadius: '8px'
          }}>
            💡 Most of {babyName}&apos;s longest naps happened at around 24°C. Try keeping the room at this temperature for better sleep.
          </p>
        </div>
      </div>

      {/* Room Metrics Summary Card */}
      {roomMetrics && (
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#1F2937', fontWeight: '600' }}>
              Room Status
            </h3>
            <button
              onClick={loadData}
              style={{
                background: '#F3F4F6',
                border: 'none',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                color: '#4B5563',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <span>🔄</span> Refresh
            </button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <StatusCard 
              icon="🌡️" 
              label="Temperature" 
              value={`${roomMetrics.temperature_c.toFixed(1)}°C`}
              color="#FF6B6B"
              status={roomMetrics.temperature_c > 26 ? 'high' : roomMetrics.temperature_c < 18 ? 'low' : 'normal'}
            />
            <StatusCard 
              icon="💧" 
              label="Humidity" 
              value={`${roomMetrics.humidity_percent.toFixed(0)}%`}
              color="#4ECDC4"
              status="normal"
            />
            <StatusCard 
              icon="🔊" 
              label="Noise" 
              value={`${roomMetrics.noise_db.toFixed(0)} dB`}
              color="#95E1D3"
              status={roomMetrics.noise_db > 50 ? 'high' : 'normal'}
            />
            <StatusCard 
              icon="💡" 
              label="Light" 
              value={`${roomMetrics.light_lux.toFixed(0)} lux`}
              color="#FFD93D"
              status="normal"
            />
          </div>

          <p style={{ 
            fontSize: '0.8rem', 
            color: '#9CA3AF', 
            marginTop: '1.25rem',
            marginBottom: 0,
            textAlign: 'center'
          }}>
            Last updated: {new Date(roomMetrics.measured_at).toLocaleTimeString()}
          </p>
        </div>
      )}

      {/* Nappi Recommendations Card */}
      {sleepSummary && sleepSummary.sleep_quality_score < 80 && (
        <div style={{
          background: 'linear-gradient(135deg, #FFF9E6 0%, #FFFBF0 100%)',
          borderRadius: '20px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          borderLeft: '4px solid #FFD166'
        }}>
          <h3 style={{ 
            margin: '0 0 0.75rem 0', 
            fontSize: '1.1rem',
            color: '#92400E',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>💡</span> Nappi Recommends
          </h3>
          <p style={{ 
            margin: 0, 
            fontSize: '0.95rem',
            color: '#78350F',
            lineHeight: '1.6'
          }}>
            {babyName}&apos;s last nap quality was <strong>{sleepSummary.sleep_quality_score}/100</strong>. 
            Try adjusting the room temperature or reducing noise levels for better sleep.
          </p>
        </div>
      )}
    </div>
  );
};

const InfoRow: React.FC<{ icon: string; label: string; value: string }> = ({ icon, label, value }) => (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    gap: '0.75rem',
    padding: '0.5rem 0',
    borderBottom: '1px solid #F3F4F6'
  }}>
    <span style={{ fontSize: '1.25rem' }}>{icon}</span>
    <span style={{ fontSize: '0.95rem', color: '#6B7280', flex: 1 }}>{label}</span>
    <span style={{ fontSize: '0.95rem', color: '#1F2937', fontWeight: '600' }}>{value}</span>
  </div>
);

const MetricCard: React.FC<{ icon: string; label: string; value: string; trend: string }> = ({ icon, label, value, trend }) => (
  <div style={{
    flex: 1,
    textAlign: 'center',
    padding: '1rem 0.5rem',
    background: '#F9FAFB',
    borderRadius: '12px'
  }}>
    <div style={{ fontSize: '1.75rem', marginBottom: '0.35rem' }}>{icon}</div>
    <div style={{ fontSize: '0.8rem', color: '#6B7280', marginBottom: '0.25rem' }}>{label}</div>
    <div style={{ 
      fontSize: '1.5rem', 
      fontWeight: '700', 
      color: value === '+' ? '#10B981' : value === '−' ? '#3B82F6' : '#1F2937'
    }}>
      {value}
    </div>
    <div style={{ fontSize: '0.7rem', color: '#9CA3AF', marginTop: '0.25rem' }}>{trend}</div>
  </div>
);

const StatusCard: React.FC<{ 
  icon: string; 
  label: string; 
  value: string; 
  color: string;
  status: 'normal' | 'high' | 'low';
}> = ({ icon, label, value, color, status }) => (
  <div style={{
    padding: '1.25rem',
    background: status === 'high' ? '#FEF2F2' : status === 'low' ? '#EFF6FF' : '#F9FAFB',
    borderRadius: '16px',
    borderLeft: `4px solid ${color}`
  }}>
    <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{icon}</div>
    <div style={{ fontSize: '0.8rem', color: '#6B7280', marginBottom: '0.35rem' }}>{label}</div>
    <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1F2937' }}>{value}</div>
    {status !== 'normal' && (
      <div style={{ 
        fontSize: '0.7rem', 
        color: status === 'high' ? '#DC2626' : '#2563EB',
        marginTop: '0.25rem',
        fontWeight: '500'
      }}>
        {status === 'high' ? '⚠️ Too high' : '❄️ Too low'}
      </div>
    )}
  </div>
);

export default HomeDashboard;
