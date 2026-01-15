import React, { useEffect, useState, useCallback } from 'react';
import type { AuthUser } from '../types/auth';
import { useLayoutContext } from '../components/LayoutContext';
import { fetchAlerts, markAlertAsRead, markAllAlertsAsRead } from '../api/alerts';
import type { Alert } from '../api/alerts';
import { useAlerts } from '../hooks/useAlerts';

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  createdAt: string;
  severity: 'info' | 'warning' | 'critical';
  icon: string;
  read: boolean;
}

// Map alert types to icons
const getIconForType = (type: string): string => {
  switch (type) {
    case 'awakening':
      return '👶';
    case 'temperature':
      return '🌡️';
    case 'humidity':
      return '💧';
    case 'noise':
      return '🔊';
    default:
      return '🔔';
  }
};

// Convert API Alert to NotificationItem
const alertToNotification = (alert: Alert): NotificationItem => ({
  id: alert.id,
  title: alert.title,
  message: alert.message,
  createdAt: alert.created_at,
  severity: alert.severity,
  icon: getIconForType(alert.type),
  read: alert.read,
});

const severityStyles: Record<NotificationItem['severity'], { bg: string; border: string; text: string }> = {
  info: { bg: '#EFF6FF', border: '#3B82F6', text: '#1E40AF' },
  warning: { bg: '#FEF3C7', border: '#F59E0B', text: '#92400E' },
  critical: { bg: '#FEE2E2', border: '#EF4444', text: '#991B1B' },
};

const Notifications: React.FC = () => {
  const { setMenuOpen } = useLayoutContext();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('nappi_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  // Subscribe to real-time alerts
  const { latestAlert } = useAlerts({
    userId: user?.user_id,
    onNewAlert: (alert) => {
      // Add new alert to the top of the list
      setNotifications((prev) => [alertToNotification(alert), ...prev]);
    },
  });

  // Load alerts from API
  const loadAlerts = useCallback(async () => {
    if (!user?.user_id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetchAlerts(user.user_id, { limit: 50 });
      setNotifications(response.alerts.map(alertToNotification));
    } catch (err) {
      console.error('Failed to load alerts:', err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, [user?.user_id]);

  // Load alerts when user is available
  useEffect(() => {
    if (user?.user_id) {
      loadAlerts();
    }
  }, [user?.user_id, loadAlerts]);

  const babyName = user?.baby?.first_name || 'Baby';
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = async (id: number) => {
    if (!user?.user_id) return;

    // Optimistic update
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

    try {
      await markAlertAsRead(id, user.user_id);
    } catch (err) {
      // Revert on error
      console.error('Failed to mark alert as read:', err);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: false } : n)));
    }
  };

  const markAllAsRead = async () => {
    if (!user?.user_id) return;

    // Optimistic update
    const previousNotifications = [...notifications];
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    try {
      await markAllAlertsAsRead(user.user_id);
    } catch (err) {
      // Revert on error
      console.error('Failed to mark all alerts as read:', err);
      setNotifications(previousNotifications);
    }
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
    <>
      {/* Header Section */}
      <section className="pt-6 px-5 pb-6 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="cursor-pointer rounded-full hover:bg-gray-50 transition-colors" onClick={() => setMenuOpen(true)}>
              <img className="[border:none] p-0 bg-[transparent] w-12 h-[37px] relative" alt="Menu" src="/hugeicons-menu-02.svg" />
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-semibold font-[Kodchasan] text-[#000] m-0">Notifications</h1>
            <p className="text-sm font-[Kodchasan] text-gray-600 m-0">{unreadCount > 0 ? `${unreadCount} unread alerts` : 'All caught up!'}</p>
          </div>

          <img src="/logo.svg" alt="Nappi" className="w-12 h-12" />
        </div>

        {/* Mark All Read Button */}
        {unreadCount > 0 && (
          <div className="flex justify-end">
            <button
              onClick={markAllAsRead}
              className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 shadow-md hover:shadow-lg transition-all active:scale-95 text-sm font-medium text-gray-700"
            >
              Mark all read
            </button>
          </div>
        )}
      </section>

      {/* Main Content */}
      <section className="px-5 pb-8 relative z-10">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <img
                src="/logo.svg"
                alt="Loading..."
                className="w-16 h-16 mx-auto mb-4"
                style={{ animation: 'pulse 1.5s ease-in-out infinite' }}
              />
              <p className="text-gray-600 font-[Kodchasan]">Loading notifications...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg text-center">
            <span className="text-4xl mb-4 block">⚠️</span>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadAlerts}
              className="bg-[#5DCCCC] text-white px-4 py-2 rounded-xl font-medium hover:bg-[#4DBDBD] transition-all"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {notifications.length === 0 ? (
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-lg text-center">
                <span className="text-6xl">🎉</span>
                <h3 className="mt-4 mb-2 text-xl font-semibold text-[#000] font-[Kodchasan]">No notifications</h3>
                <p className="m-0 text-gray-600">{babyName} is sleeping soundly!</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const styles = severityStyles[notification.severity];
                return (
                  <div
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className={`bg-white/90 backdrop-blur-sm rounded-3xl p-5 shadow-lg cursor-pointer transition-all hover:shadow-xl active:scale-[0.99] ${
                      notification.read ? 'opacity-70' : ''
                    }`}
                    style={{
                      borderLeft: `4px solid ${styles.border}`,
                    }}
                  >
                    <div className="flex gap-4">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                          notification.read ? 'bg-gray-100' : 'bg-white'
                        }`}
                        style={{
                          backgroundColor: notification.read ? '#F3F4F6' : styles.bg,
                        }}
                      >
                        {notification.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={`m-0 text-base font-semibold font-[Kodchasan] ${notification.read ? 'text-gray-600' : 'text-[#000]'}`}>
                            {notification.title}
                          </h4>
                          {!notification.read && <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ backgroundColor: styles.border }} />}
                        </div>

                        <p className={`m-0 mb-2 text-sm leading-relaxed ${notification.read ? 'text-gray-400' : 'text-gray-700'}`}>{notification.message}</p>

                        <span className="text-xs text-gray-400 font-medium">{formatTime(notification.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Info Footer */}
        <p className="text-center text-gray-400 text-xs mt-8">Notifications are based on sensor data and sleep analysis</p>
      </section>

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
      `}</style>
    </>
  );
};

export default Notifications;
