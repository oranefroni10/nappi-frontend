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
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-700 font-medium transition-all"
            >
              <span className="text-xl">🔔</span>
              Alerts
            </button>
            <button
              onClick={() => { navigate('/user'); setMenuOpen(false); }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#4ECDC4]/10 text-[#4ECDC4] font-medium hover:bg-[#4ECDC4]/20 transition-all"
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
                Profile
              </h1>
              <p className="text-sm font-[Kodchasan] text-gray-600 m-0">
                {user?.username || 'User'}
              </p>
            </div>

            <img
              src="/logo.svg"
              alt="Nappi"
              className="w-12 h-12"
            />
          </div>
        </section>

        {/* Main Content */}
        <section className="px-5 pb-8 relative z-10">
          <div className="flex flex-col gap-5">

            {/* Baby Info Card */}
            {user?.baby && (
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-[#000] mb-4 font-['Segoe_UI'] flex items-center gap-2">
                  Baby Information
                </h3>
                
                <div className="flex flex-col gap-3">
                  <ProfileRow label="Name" value={`${user.baby.first_name} ${user.baby.last_name}`} />
                  <ProfileRow label="Age" value={babyAge || 'Unknown'} />
                  <ProfileRow label="Birthdate" value={new Date(user.baby.birthdate).toLocaleDateString()} />
                </div>
              </div>
            )}

            {/* Settings Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-[#000] mb-4 font-['Segoe_UI'] flex items-center gap-2">
                Settings
              </h3>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <div>
                  <p className="m-0 font-medium text-gray-700">Push Notifications</p>
                  <p className="m-0 mt-1 text-xs text-gray-400">
                    Get alerts when baby wakes up
                  </p>
                </div>
                <ToggleSwitch 
                  enabled={notificationsEnabled} 
                  onChange={setNotificationsEnabled} 
                />
              </div>
            </div>

            {/* App Info */}
            <p className="text-center text-gray-400 text-xs mt-4">
              Nappi v1.0.0 • Made with 💛 for better baby sleep
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

const ProfileRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
    <span className="text-gray-600 text-sm">{label}</span>
    <span className="text-[#000] font-medium text-sm">{value}</span>
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
    className={`w-[50px] h-7 rounded-full border-none relative transition-all ${
      enabled ? 'bg-green-500' : 'bg-gray-300'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
  >
    <div 
      className={`w-[22px] h-[22px] rounded-full bg-white absolute top-[3px] transition-all shadow-md ${
        enabled ? 'left-[25px]' : 'left-[3px]'
      }`}
    />
  </button>
);

export default UserProfile;