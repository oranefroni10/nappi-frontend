// src/components/Layout.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { AuthUser } from '../types/auth';

// Same helper you already use
const calculateAge = (birthdate: string): string => {
  const birth = new Date(birthdate);
  const today = new Date();
  const months =
    (today.getFullYear() - birth.getFullYear()) * 12 +
    (today.getMonth() - birth.getMonth());

  if (months < 1) {
    const days = Math.floor(
      (today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24)
    );
    return `${days} days`;
  } else if (months < 24) {
    return `${months} month${months !== 1 ? 's' : ''}`;
  } else {
    const years = Math.floor(months / 12);
    return `${years} year${years !== 1 ? 's' : ''}`;
  }
};

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // IMPORTANT logic from your old Layout
  const isActive = (path: string) => location.pathname === path;

  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('nappi_user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('nappi_user');
    setMenuOpen(false);
    navigate('/login');
  };

  const navItems = useMemo(
    () => [
      {
        path: '/',
        label: 'Home',
        icon: <img src="/fluent-home-20-filled.svg" alt="" className="w-5 h-5" />,
      },
      {
        path: '/statistics',
        label: 'Statistics',
        icon: (
          <img
            src="/material-symbols-light-chart-data-outline.svg"
            alt=""
            className="w-5 h-5"
          />
        ),
      },
      { path: '/notifications', label: 'Alerts', icon: <span className="text-xl">🔔</span> },
      { path: '/user', label: 'Profile', icon: <span className="text-xl">👤</span> },
    ],
    []
  );

  const isHome = location.pathname === '/';

  const pageTitle = (() => {
    if (isHome) return '';
    if (isActive('/statistics')) return 'Statistics';
    if (isActive('/notifications')) return 'Notifications';
    if (isActive('/user')) return 'Profile';
    return 'Nappi';
  })();

  const babyName = user?.baby?.first_name || 'Baby';
  const babyAge = user?.baby?.birthdate ? calculateAge(user.baby.birthdate) : null;

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
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          <nav className="flex flex-col gap-4">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    active
                      ? 'bg-[#4ECDC4]/10 text-[#4ECDC4] hover:bg-[#4ECDC4]/20'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-gray-700 font-medium hover:bg-red-50 transition-all"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Inner content container */}
      <div className="w-full h-full md:h-auto md:max-w-2xl lg:max-w-3xl relative flex flex-col min-h-screen md:min-h-[600px] isolate">
        {/* Header Section */}
        <section className="pt-6 px-5 pb-6 relative z-10">
          <div className="flex items-center justify-between mb-6">
            {/* Burger button */}
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

            {/* Center header */}
            <div className="text-center">
              {isHome ? (
                <>
                  <h1 className="text-2xl font-semibold font-[Kodchasan] text-[#000] m-0">
                    {getGreeting()}
                  </h1>
                  <p className="text-sm font-[Kodchasan] text-gray-600 m-0">
                    {user ? `${user.first_name} ${user.last_name}` : 'there'}
                  </p>
                </>
              ) : (
                <h1 className="text-2xl font-semibold font-[Kodchasan] text-[#000] m-0">
                  {pageTitle}
                </h1>
              )}
            </div>

            {/* Logo */}
            <img src="/logo.svg" alt="Nappi" className="w-12 h-12" />
          </div>

          {/* Home-only baby card (from HomeDashboard) */}
          {isHome && (
            <div className="flex items-center justify-center gap-4">
              <img
                src="/baby.png"
                alt={`${babyName}'s profile`}
                className="w-20 h-20 rounded-full shadow-md object-cover"
              />
              <div>
                <h2 className="text-xl font-semibold font-[Kodchasan] text-[#000] m-0">
                  Baby {babyName}
                </h2>
                {babyAge && (
                  <p className="text-sm text-gray-600 m-0 mt-1">Age: {babyAge} old</p>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Page content */}
        <main className="px-5 pb-8 relative z-10">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
