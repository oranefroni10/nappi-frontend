import React, { useEffect, useState } from 'react';
import type { AuthUser } from '../types/auth';

const Statistics: React.FC = () => {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('nappi_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const babyName = user?.baby?.first_name || 'Baby';

  // Mock data - will be replaced with real data later
  const weeklyData = [
    { day: 'Mon', hours: 7.5, quality: 85 },
    { day: 'Tue', hours: 8.2, quality: 92 },
    { day: 'Wed', hours: 6.8, quality: 78 },
    { day: 'Thu', hours: 7.9, quality: 88 },
    { day: 'Fri', hours: 8.5, quality: 95 },
    { day: 'Sat', hours: 7.2, quality: 82 },
    { day: 'Sun', hours: 8.0, quality: 90 },
  ];

  const maxHours = Math.max(...weeklyData.map(d => d.hours));

  return (
    <div style={{ padding: '0.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ 
          margin: '0 0 0.25rem 0', 
          fontSize: '1.75rem', 
          color: '#1F2937',
          fontWeight: '600'
        }}>
          Sleep Statistics 📊
        </h1>
        <p style={{ margin: 0, color: '#6B7280' }}>
          {babyName}&apos;s sleep patterns this week
        </p>
      </div>

      {/* Summary Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <StatCard 
          icon="🌙" 
          label="Avg. Sleep" 
          value="7h 45m" 
          color="#6366F1"
          trend="+12min"
        />
        <StatCard 
          icon="⭐" 
          label="Avg. Quality" 
          value="87/100" 
          color="#10B981"
          trend="+5pts"
        />
        <StatCard 
          icon="🔔" 
          label="Awakenings" 
          value="2.1/night" 
          color="#F59E0B"
          trend="-0.3"
        />
        <StatCard 
          icon="🏆" 
          label="Best Night" 
          value="Friday" 
          color="#EC4899"
          trend="95 pts"
        />
      </div>

      {/* Weekly Chart */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
      }}>
        <h3 style={{ 
          margin: '0 0 1.25rem 0', 
          fontSize: '1.1rem', 
          color: '#1F2937',
          fontWeight: '600'
        }}>
          Sleep Duration (hours)
        </h3>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'flex-end', 
          justifyContent: 'space-between',
          height: '150px',
          gap: '0.5rem'
        }}>
          {weeklyData.map((data, index) => (
            <div key={index} style={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{ 
                fontSize: '0.7rem', 
                color: '#6B7280',
                fontWeight: '500'
              }}>
                {data.hours}h
              </span>
              <div style={{
                width: '100%',
                height: `${(data.hours / maxHours) * 100}%`,
                background: data.quality >= 90 
                  ? 'linear-gradient(180deg, #10B981 0%, #34D399 100%)'
                  : data.quality >= 80
                  ? 'linear-gradient(180deg, #6366F1 0%, #818CF8 100%)'
                  : 'linear-gradient(180deg, #F59E0B 0%, #FBBF24 100%)',
                borderRadius: '8px 8px 4px 4px',
                minHeight: '20px',
                transition: 'height 0.3s ease'
              }} />
              <span style={{ 
                fontSize: '0.75rem', 
                color: '#9CA3AF',
                fontWeight: '500'
              }}>
                {data.day}
              </span>
            </div>
          ))}
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '1.5rem',
          marginTop: '1rem',
          paddingTop: '1rem',
          borderTop: '1px solid #F3F4F6'
        }}>
          <LegendItem color="#10B981" label="Excellent (90+)" />
          <LegendItem color="#6366F1" label="Good (80-89)" />
          <LegendItem color="#F59E0B" label="Fair (<80)" />
        </div>
      </div>

      {/* Insights Card */}
      <div style={{
        background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
        borderRadius: '20px',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
      }}>
        <h3 style={{ 
          margin: '0 0 1rem 0', 
          fontSize: '1.1rem', 
          color: '#92400E',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>💡</span> Weekly Insights
        </h3>
        
        <ul style={{ 
          margin: 0, 
          padding: '0 0 0 1.25rem',
          color: '#78350F',
          lineHeight: '1.8'
        }}>
          <li>{babyName} slept best on <strong>Friday</strong> with 8.5 hours</li>
          <li>Room temperature around <strong>23°C</strong> correlates with better sleep</li>
          <li>Naps between <strong>1-3 PM</strong> show highest quality scores</li>
        </ul>
      </div>

      {/* Coming Soon */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '1.5rem',
        textAlign: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
      }}>
        <span style={{ fontSize: '2.5rem' }}>🚀</span>
        <h4 style={{ margin: '0.75rem 0 0.5rem 0', color: '#1F2937' }}>
          More Analytics Coming Soon
        </h4>
        <p style={{ margin: 0, color: '#6B7280', fontSize: '0.9rem' }}>
          Sleep stage breakdown, monthly trends, and personalized recommendations
        </p>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ 
  icon: string; 
  label: string; 
  value: string;
  color: string;
  trend: string;
}> = ({ icon, label, value, color, trend }) => (
  <div style={{
    background: 'white',
    borderRadius: '16px',
    padding: '1.25rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    borderLeft: `4px solid ${color}`
  }}>
    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{icon}</div>
    <div style={{ fontSize: '0.8rem', color: '#6B7280', marginBottom: '0.25rem' }}>{label}</div>
    <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1F2937' }}>{value}</div>
    <div style={{ 
      fontSize: '0.75rem', 
      color: trend.startsWith('+') ? '#10B981' : trend.startsWith('-') ? '#EF4444' : '#6B7280',
      marginTop: '0.25rem',
      fontWeight: '500'
    }}>
      {trend}
    </div>
  </div>
);

const LegendItem: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
    <div style={{ 
      width: '12px', 
      height: '12px', 
      borderRadius: '3px', 
      background: color 
    }} />
    <span style={{ fontSize: '0.7rem', color: '#6B7280' }}>{label}</span>
  </div>
);

export default Statistics;
