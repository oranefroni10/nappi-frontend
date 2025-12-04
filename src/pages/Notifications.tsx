import React, { useEffect, useState } from 'react';
import type { AuthUser } from '../types/auth';

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  createdAt: string;
  severity: 'info' | 'warning' | 'critical';
  icon: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    title: 'Baby woke up',
    message: 'Baby was awake for 5 minutes at 03:12.',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    severity: 'info',
    icon: '👶',
    read: false,
  },
  {
    id: 2,
    title: 'Room temperature high',
    message: 'Temperature reached 26°C at 15:42. Consider turning on the AC.',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    severity: 'warning',
    icon: '🌡️',
    read: false,
  },
  {
    id: 3,
    title: 'Great sleep quality!',
    message: 'Last night\'s sleep scored 92/100. Keep up the good environment!',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    severity: 'info',
    icon: '⭐',
    read: true,
  },
  {
    id: 4,
    title: 'Noise level alert',
    message: 'Detected loud noise (65dB) at 14:30. This may affect nap quality.',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    severity: 'warning',
    icon: '🔊',
    read: true,
  },
];

const severityStyles: Record<NotificationItem['severity'], { bg: string; border: string; text: string }> = {
  info: { bg: '#EFF6FF', border: '#3B82F6', text: '#1E40AF' },
  warning: { bg: '#FEF3C7', border: '#F59E0B', text: '#92400E' },
  critical: { bg: '#FEE2E2', border: '#EF4444', text: '#991B1B' },
};

const Notifications: React.FC = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  useEffect(() => {
    const stored = localStorage.getItem('nappi_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const babyName = user?.baby?.first_name || 'Baby';
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  };

  return (
    <div style={{ padding: '0.5rem' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <div>
          <h1 style={{ 
            margin: '0 0 0.25rem 0', 
            fontSize: '1.75rem', 
            color: '#1F2937',
            fontWeight: '600'
          }}>
            Notifications 🔔
          </h1>
          <p style={{ margin: 0, color: '#6B7280' }}>
            {unreadCount > 0 ? `${unreadCount} unread alerts` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            style={{
              background: '#F3F4F6',
              border: 'none',
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              fontSize: '0.8rem',
              color: '#4B5563',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {notifications.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '3rem 1.5rem',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
          }}>
            <span style={{ fontSize: '3rem' }}>🎉</span>
            <h3 style={{ margin: '1rem 0 0.5rem 0', color: '#1F2937' }}>
              No notifications
            </h3>
            <p style={{ margin: 0, color: '#6B7280' }}>
              {babyName} is sleeping soundly!
            </p>
          </div>
        ) : (
          notifications.map(notification => {
            const styles = severityStyles[notification.severity];
            return (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                style={{
                  background: notification.read ? 'white' : styles.bg,
                  borderRadius: '16px',
                  padding: '1.25rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  borderLeft: `4px solid ${styles.border}`,
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  opacity: notification.read ? 0.7 : 1
                }}
              >
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: notification.read ? '#F3F4F6' : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    flexShrink: 0
                  }}>
                    {notification.icon}
                  </div>
                  
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start',
                      marginBottom: '0.35rem'
                    }}>
                      <h4 style={{ 
                        margin: 0, 
                        fontSize: '1rem', 
                        fontWeight: '600',
                        color: notification.read ? '#6B7280' : '#1F2937'
                      }}>
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: styles.border,
                          flexShrink: 0,
                          marginTop: '6px'
                        }} />
                      )}
                    </div>
                    
                    <p style={{ 
                      margin: '0 0 0.5rem 0', 
                      fontSize: '0.9rem',
                      color: notification.read ? '#9CA3AF' : '#4B5563',
                      lineHeight: '1.4'
                    }}>
                      {notification.message}
                    </p>
                    
                    <span style={{ 
                      fontSize: '0.75rem', 
                      color: '#9CA3AF',
                      fontWeight: '500'
                    }}>
                      {formatTime(notification.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Info Footer */}
      <p style={{ 
        textAlign: 'center', 
        color: '#9CA3AF', 
        fontSize: '0.75rem',
        marginTop: '2rem'
      }}>
        Notifications are based on sensor data and sleep analysis
      </p>
    </div>
  );
};

export default Notifications;
