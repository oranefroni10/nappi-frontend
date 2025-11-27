import React, { useEffect, useState } from 'react';
import { fetchLastSleepSummary } from '../api/sleep';
import { fetchCurrentRoomMetrics } from '../api/room';
import type { LastSleepSummary, RoomMetrics } from '../types/metrics';

const HomeDashboard: React.FC = () => {
  const [sleepSummary, setSleepSummary] = useState<LastSleepSummary | null>(null);
  const [roomMetrics, setRoomMetrics] = useState<RoomMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p style={{ color: '#6B7280' }}>Loading dashboard...</p>
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
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      {/* Baby Profile Card */}
      {sleepSummary && (
        <div style={{
          background: 'linear-gradient(135deg, #FFE4E1 0%, #E6F7FF 100%)',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '1rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: '#B4E7E5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem'
            }}>
              👶
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#1F2937' }}>
                {sleepSummary.baby_name}
              </h2>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#6B7280' }}>
                Age: 2 months
              </p>
            </div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '1rem'
          }}>
            <h3 style={{ 
              margin: '0 0 0.75rem 0', 
              fontSize: '1rem',
              color: '#374151',
              fontWeight: '600'
            }}>
              Last Nap
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <InfoRow icon="⏰" label="NapTime" value="9:20-11:15" />
              <InfoRow icon="🌡️" label="NapTemp" value={`${roomMetrics?.temperature_c.toFixed(0)}°C On average`} />
              <InfoRow icon="🔊" label="Noise level" value={`${roomMetrics?.noise_db.toFixed(0)} decibels`} />
              <InfoRow icon="💧" label="Humidity" value={`${roomMetrics?.humidity_percent.toFixed(0)}%`} />
            </div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1rem'
          }}>
            <h4 style={{ 
              margin: '0 0 0.75rem 0', 
              fontSize: '0.875rem',
              color: '#374151',
              fontWeight: '600'
            }}>
              {sleepSummary.baby_name} sleeps best in
            </h4>
            
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'space-around' }}>
              <MetricCard icon="🌡️" label="Temp" value="-" />
              <MetricCard icon="☀️" label="Light" value="+" />
              <MetricCard icon="💧" label="Humidity" value="+" />
            </div>

            <p style={{
              fontSize: '0.75rem',
              color: '#6B7280',
              marginTop: '0.75rem',
              marginBottom: 0,
              lineHeight: '1.4'
            }}>
              Most of {sleepSummary.baby_name}&apos;s longest naps happened at around 25°C. Try keeping the room at 25°C for better sleep.
            </p>
          </div>
        </div>
      )}

      {/* Room Metrics Summary Card */}
      {roomMetrics && (
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '1rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.125rem', color: '#1F2937' }}>
              Current Room Status
            </h3>
            <button
              onClick={loadData}
              style={{
                background: '#F3F4F6',
                border: 'none',
                borderRadius: '6px',
                padding: '0.5rem 0.75rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                color: '#4B5563',
                fontWeight: '500'
              }}
            >
              🔄 Refresh
            </button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <StatusCard 
              icon="🌡️" 
              label="Temperature" 
              value={`${roomMetrics.temperature_c.toFixed(1)}°C`}
              color="#FF6B6B"
            />
            <StatusCard 
              icon="💧" 
              label="Humidity" 
              value={`${roomMetrics.humidity_percent.toFixed(0)}%`}
              color="#4ECDC4"
            />
            <StatusCard 
              icon="🔊" 
              label="Noise" 
              value={`${roomMetrics.noise_db.toFixed(0)} dB`}
              color="#95E1D3"
            />
            <StatusCard 
              icon="💡" 
              label="Light" 
              value={`${roomMetrics.light_lux.toFixed(0)} lux`}
              color="#FFD93D"
            />
          </div>

          <p style={{ 
            fontSize: '0.75rem', 
            color: '#9CA3AF', 
            marginTop: '1rem',
            marginBottom: 0,
            textAlign: 'center'
          }}>
            Updated at {new Date(roomMetrics.measured_at).toLocaleTimeString()}
          </p>
        </div>
      )}

      {/* Nappi Recommendations Card */}
      {sleepSummary && sleepSummary.sleep_quality_score < 80 && (
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '1rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #FFD166'
        }}>
          <h3 style={{ 
            margin: '0 0 0.75rem 0', 
            fontSize: '1rem',
            color: '#1F2937',
            fontWeight: '600'
          }}>
            💡 Nappi Recommends
          </h3>
          <p style={{ 
            margin: 0, 
            fontSize: '0.875rem',
            color: '#4B5563',
            lineHeight: '1.5'
          }}>
            {sleepSummary.baby_name}&apos;s last nap quality was {sleepSummary.sleep_quality_score}/100. 
            Try adjusting the room temperature or reducing noise levels for better sleep.
          </p>
        </div>
      )}
    </div>
  );
};

const InfoRow: React.FC<{ icon: string; label: string; value: string }> = ({ icon, label, value }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
    <span>{icon}</span>
    <span style={{ fontSize: '0.875rem', color: '#6B7280', flex: 1 }}>{label}:</span>
    <span style={{ fontSize: '0.875rem', color: '#1F2937', fontWeight: '500' }}>{value}</span>
  </div>
);

const MetricCard: React.FC<{ icon: string; label: string; value: string }> = ({ icon, label, value }) => (
  <div style={{
    flex: 1,
    textAlign: 'center',
    padding: '0.75rem',
    background: '#F9FAFB',
    borderRadius: '8px'
  }}>
    <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{icon}</div>
    <div style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '0.25rem' }}>{label}</div>
    <div style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1F2937' }}>{value}</div>
  </div>
);

const StatusCard: React.FC<{ icon: string; label: string; value: string; color: string }> = ({ 
  icon, 
  label, 
  value, 
  color 
}) => (
  <div style={{
    padding: '1rem',
    background: '#F9FAFB',
    borderRadius: '12px',
    borderLeft: `3px solid ${color}`
  }}>
    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{icon}</div>
    <div style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '0.25rem' }}>{label}</div>
    <div style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1F2937' }}>{value}</div>
  </div>
);

export default HomeDashboard;
