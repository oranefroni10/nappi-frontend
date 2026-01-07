import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('nappi_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('nappi_user');
    setMenuOpen(false);
    navigate('/login');
  };

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
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#fee2d6] via-[#FAFBFC] to-[#e2f9fb] p-0 md:p-8 overflow-x-hidden relative">
      
      {/* Decorative background clouds */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img
          src="/Vector1.svg"
          alt=""
          className="absolute top-[10%] left-[20%] w-[200px] h-[100px] opacity-60"
        />
        <img
          src="/Vector.svg"
          alt=""
          className="absolute top-[5%] right-[5%] w-[120px] h-[60px] opacity-40"
        />
        <img
          src="/Vector1.svg"
          alt=""
          className="absolute top-[60%] left-[25%] w-[250px] h-[150px]"
        />
        <img
          src="/Vector.svg"
          alt=""
          className="absolute top-[50%] right-[15%] w-[150px] h-[70px] opacity-50"
        />
      </div>

      {/* Burger Menu Overlay */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Burger Menu Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full w-60 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-semibold font-[Kodchasan]">Menu</h3>
            <button
              onClick={() => setMenuOpen(false)}
              className="text-2xl text-gray-600 hover:text-gray-800"
            >
              ✕
            </button>
          </div>

          <nav className="flex flex-col gap-4">
            <button
              onClick={() => { navigate('/'); setMenuOpen(false); }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-700 font-medium transition-all"
            >
              <img src="/fluent-home-20-filled.svg" alt="" className="w-5 h-5" />
              Home
            </button>
            <button
              onClick={() => { navigate('/statistics'); setMenuOpen(false); }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-700 font-medium transition-all"
            >
              <img src="/material-symbols-light-chart-data-outline.svg" alt="" className="w-5 h-5" />
              Statistics
            </button>
            <button
              onClick={() => { navigate('/notifications'); setMenuOpen(false); }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#4ECDC4]/10 text-[#4ECDC4] font-medium hover:bg-[#4ECDC4]/20 transition-all"
            >
              <span className="text-xl">🔔</span>
              Alerts
            </button>
            <button
              onClick={() => { navigate('/user'); setMenuOpen(false); }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-700 font-medium transition-all"
            >
              <span className="text-xl">👤</span>
              Profile
            </button>
          </nav>
        </div>

        {/* Logout Button at Bottom */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 text-red-600 font-medium hover:bg-red-100 transition-all"
          >
            <span className="text-xl">🚪</span>
            Log Out
          </button>
        </div>
      </div>

      {/* Inner content container - centered and responsive */}
      <div className="w-full h-full md:h-auto md:max-w-2xl lg:max-w-3xl relative flex flex-col min-h-screen md:min-h-[600px] isolate">
        
        {/* Header Section */}
        <section className="pt-6 px-5 pb-6 relative z-10">
          <div className="flex items-center justify-between mb-6">
            
            <div className="flex items-center gap-2">
              <div 
                className="cursor-pointer rounded-full hover:bg-gray-50 transition-colors"
                onClick={() => setMenuOpen(true)}
              >
                <img
                  className="[border:none] p-0 bg-[transparent] w-12 h-[37px] relative"
                  alt="Menu"
                  src="/hugeicons-menu-02.svg"
                />
              </div>
            </div>

            <div className="text-center"> 
              <h1 className="text-2xl font-semibold font-[Kodchasan] text-[#000] m-0">
                Notifications
              </h1>
              <p className="text-sm font-[Kodchasan] text-gray-600 m-0">
                {unreadCount > 0 ? `${unreadCount} unread alerts` : 'All caught up!'}
              </p>
            </div>

            <img
              src="/logo.svg"
              alt="Nappi"
              className="w-12 h-12"
            />
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
          <div className="flex flex-col gap-4">
            {notifications.length === 0 ? (
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-lg text-center">
                <span className="text-6xl">🎉</span>
                <h3 className="mt-4 mb-2 text-xl font-semibold text-[#000] font-[Kodchasan]">
                  No notifications
                </h3>
                <p className="m-0 text-gray-600">
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
                    className={`bg-white/90 backdrop-blur-sm rounded-3xl p-5 shadow-lg cursor-pointer transition-all hover:shadow-xl active:scale-[0.99] ${
                      notification.read ? 'opacity-70' : ''
                    }`}
                    style={{
                      borderLeft: `4px solid ${styles.border}`
                    }}
                  >
                    <div className="flex gap-4">
                      <div 
                        className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                          notification.read ? 'bg-gray-100' : 'bg-white'
                        }`}
                        style={{
                          backgroundColor: notification.read ? '#F3F4F6' : styles.bg
                        }}
                      >
                        {notification.icon}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={`m-0 text-base font-semibold font-[Kodchasan] ${
                            notification.read ? 'text-gray-600' : 'text-[#000]'
                          }`}>
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div 
                              className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                              style={{ backgroundColor: styles.border }}
                            />
                          )}
                        </div>
                        
                        <p className={`m-0 mb-2 text-sm leading-relaxed ${
                          notification.read ? 'text-gray-400' : 'text-gray-700'
                        }`}>
                          {notification.message}
                        </p>
                        
                        <span className="text-xs text-gray-400 font-medium">
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
          <p className="text-center text-gray-400 text-xs mt-8">
            Notifications are based on sensor data and sleep analysis
          </p>
        </section>
      </div>
    </div>
  );
};

export default Notifications;