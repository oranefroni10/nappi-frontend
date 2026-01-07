import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

type MetricType = 'temp' | 'soon' | 'humidity' | 'noise' | null;

const HomeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [sleepSummary, setSleepSummary] = useState<LastSleepSummary | null>(null);
  const [roomMetrics, setRoomMetrics] = useState<RoomMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openMetric, setOpenMetric] = useState<MetricType>(null);
  const [showSpinner, setShowSpinner] = useState(false);

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
    setShowSpinner(false); // Reset spinner state
    // 1. The Data Promise
    const dataPromise = Promise.all([
      fetchLastSleepSummary(),
      fetchCurrentRoomMetrics(),
    ]);
    // 2. The 300ms Threshold Promise
    const thresholdPromise = new Promise<string>((resolve) => 
      setTimeout(() => resolve('timeout'), 300)
    );
    // 3. Race them
    const winner = await Promise.race([
      dataPromise.then(() => 'data'),
      thresholdPromise
    ]);
    if (winner === 'data') {
      // Scenario A: Fast (<300ms). Show no spinner, just render data.
      const [sleep, room] = await dataPromise;
      setSleepSummary(sleep);
      setRoomMetrics(room);
      setLoading(false);
    } else {
      // Scenario B: Slow (>300ms). Show spinner AND wait 1.5s minimum.
      setShowSpinner(true); 
      
      const minLoadingTime = new Promise(resolve => setTimeout(resolve, 1500));
      const [[sleep, room]] = await Promise.all([
        dataPromise,
        minLoadingTime
      ]);

      setSleepSummary(sleep);
      setRoomMetrics(room);
      setLoading(false);
    }
  } catch (err) {
      console.error(err);
      setError('Failed to load data from server.');
  }}

  useEffect(() => {
    loadData();
  }, []);

  const handleMetricClick = (metric: MetricType) => {
    if (openMetric === metric) {
      setOpenMetric(null); // Close if clicking the same card
    } else {
      setOpenMetric(metric); // Open the clicked card
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('nappi_user');
    setMenuOpen(false);
    navigate('/login');
  };

  const getMetricInfo = (metric: MetricType): string => {
    switch (metric) {
      case 'temp':
        return `Most of ${babyName}'s longest naps happened at around 24°C. Try keeping the room at this temperature for better sleep.`;
      case 'soon':
        return `Exciting updates are on the way! The next version of Nappi will feature new advanced sensors, giving you even deeper insights in ${babyName} sleep environment.`;
      case 'humidity':
        return `Higher humidity levels (around 50-60%) help ${babyName} sleep longer. Consider using a humidifier.`;
      case 'noise':
        return `${babyName} sleeps better with some background noise. White noise machines can help mask sudden sounds.`;
      default:
        return '';
    }
  };

  // Get baby name from user data or fallback to sleep summary
  const babyName = user?.baby?.first_name || sleepSummary?.baby_name || 'Baby';
  const babyAge = user?.baby?.birthdate ? calculateAge(user.baby.birthdate) : null;

  if (loading) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-b from-[#fee2d6] via-white to-[#e2f9fb] p-0 md:p-8 overflow-hidden">
        
        {/* Only show the Logo/Spinner if the threshold was crossed */}
        {showSpinner && (
          <div className="text-center flex flex-col items-center justify-center fade-in">
            <img 
              src="/logo.svg" 
              alt="Loading..."
              className="w-24 h-24 mb-6"
              style={{
                animation: 'pulse 1.5s ease-in-out infinite'
              }}
            />
            <p className="text-gray-600 font-[Kodchasan]">Loading dashboard...</p>
          </div>
        )}

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.05); }
          }
          .fade-in {
            animation: fadeIn 0.3s ease-in;
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-b from-[#fee2d6] via-white to-[#e2f9fb] p-0 md:p-8 overflow-hidden">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg max-w-md">
          <div className="text-5xl mb-4">
            <img 
              src="/logo.svg" 
              alt="Loading..."
              className="w-24 h-24 mb-6"
            ></img>
          </div>
          <p className="text-red-600 mb-4 font-medium">{error}</p>
          <button
            onClick={loadData}
            className="bg-[#ffc857] hover:bg-[#ffb83d] text-black font-semibold px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            <img
              src="/refresh.svg"
              alt="refresh"
              className="w-6 h-6"
            />
            retry
          </button>
        </div>
      </div>
    );
  }

  return (
    // Outer container with full-screen gradient background - valid x slider dissapear
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
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#4ECDC4]/10 text-[#4ECDC4] font-medium hover:bg-[#4ECDC4]/20 transition-all"
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
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-gray-700 font-medium hover:bg-red-50 transition-all">
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
                {getGreeting()}
              </h1>
              <p className="text-sm font-[Kodchasan] text-gray-600 m-0">
                {user?.username || 'there'}
              </p>
            </div>

            <img
              src="/logo.svg"
              alt="Nappi"
              className="w-12 h-12"
            />
          </div>

          {/* Baby Profile Card */}
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
                <p className="text-sm text-gray-600 m-0 mt-1">
                  Age: {babyAge} old
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="px-5 pb-8 relative z-10">
          <div className="flex flex-col gap-5">
            
            {/* Last Nap Info */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#000] m-0 font-['Segoe_UI']">
                  Last Nap Info
                </h3>

                <div className="flex items-center gap-3">
                  <button
                    onClick={loadData}
                    className="cursor-pointer"
                  >
                    <img
                      src="/refresh.svg"
                      alt="refresh"
                      className="w-6 h-6"
                    />
                  </button>

                  <button 
                    onClick={() => navigate('/sleep-data')}
                    className="text-[#4ECDC4] hover:text-[#3db8b0] transition-colors"
                  >
                    <img
                      src="/material-symbols-light-chart-data-outline.svg"
                      alt="View data"
                      className="w-7 h-7"
                    />
                  </button>
                </div>
              </div>

              <div className="rounded-2xl p-4">
                <div className="flex flex-col gap-3">
                  <InfoRow 
                    icon={<img src="/napTime-icon.svg" alt="Nap" className="w-5 h-5" />} 
                    label="Nap Time" 
                    value="9:20 - 11:15" 
                  />
                  <InfoRow 
                    icon={<img src="/iconoir-temperature-low.svg" alt="Temp" className="w-5 h-5" />} 
                    label="Average Temperature" 
                    value={`${roomMetrics?.temperature_c.toFixed(0) || '--'}°C`} 
                  />
                  <InfoRow 
                    icon={<img src="/cbi-moisture.svg" alt="Humidity" className="w-5 h-5" />} 
                    label="Average Humidity" 
                    value={`${roomMetrics?.humidity_percent.toFixed(0) || '--'}%`} 
                  />
                  <InfoRow 
                    icon={<img src="/sound-icon.svg" alt="Sound" className="w-5 h-5" />} 
                    label="Max Noise Level" 
                    value={`${roomMetrics?.noise_db.toFixed(0) || '--'} dB`} 
                  />
                </div>
              </div>
            </div>

            {/* Sleep Preferences */}
            <div className="h-fit">
              <div className="flex items-start py-0 px-[18px] mb-4">
                <h3 className="text-lg font-semibold text-[#000] m-0 font-['Segoe_UI']">
                  {babyName} sleeps best in
                </h3>
              </div>
              
                <div className="flex items-center justify-start md:justify-center gap-4 overflow-x-auto overflow-y-hidden whitespace-nowrap font-[Kodchasan] pb-4 px-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <MetricCard 
                  icon={<img src="/temp-icon.svg" alt="Temp" className="w-[38px]" />} 
                  label="Temperture" 
                  symbol="+"
                  isOpen={openMetric === 'temp'}
                  onClick={() => handleMetricClick('temp')}
                />
                <MetricCard 
                  icon={<img src="/cbi-moisture1.svg" alt="Humidity" className="w-[38px]" />} 
                  label="Humidity" 
                  symbol="+"
                  isOpen={openMetric === 'humidity'}
                  onClick={() => handleMetricClick('humidity')}
                />
                <MetricCard 
                  icon={<img src="/sound-icon1.svg" alt="Noise" className="w-[38px]" />} 
                  label="Noise level" 
                  symbol="+"
                  isOpen={openMetric === 'noise'}
                  onClick={() => handleMetricClick('noise')}
                />
                <MetricCard 
                  icon={<img src="/star.svg" alt="star" className="w-[38px]" />} 
                  label="Coming Soon" 
                  symbol="+"
                  isOpen={openMetric === 'soon'}
                  onClick={() => handleMetricClick('soon')}
                />
              </div>

              {/* Info box that appears when a metric is selected */}
              {openMetric && (
                <div 
                  className="bg-white h-[86px] rounded-[20px] overflow-hidden shrink-0 flex items-center justify-center py-4 px-[19px] box-border "
                  style={{
                    animation: 'fadeIn 0.3s ease-out'
                  }}
                >
                  <p className="text-sm text-gray-700 m-0 leading-relaxed">
                    💡 {getMetricInfo(openMetric)}
                  </p>
                </div>
              )}
            </div>

            {/* Room Status */}
            {roomMetrics && (
              <div className="">
                <h3 className="text-lg font-semibold text-[#000] mb-4 font-['Segoe_UI']">
                  Room Status
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <StatusCard 
                    icon={<img src="/temp-icon.svg" alt="Temp" className="w-[38px]" />} 
                    label="Temperature" 
                    value={`${roomMetrics.temperature_c.toFixed(1)}°C`}
                    color="#FF6B6B"
                    status={roomMetrics.temperature_c > 26 ? 'high' : roomMetrics.temperature_c < 18 ? 'low' : 'normal'}
                  />
                  <StatusCard 
                    icon={<img src="/cbi-moisture1.svg" alt="Humidity" className="w-[38px]" />} 
                    label="Humidity" 
                    value={`${roomMetrics.humidity_percent.toFixed(0)}%`}
                    color="#4ECDC4"
                    status="normal"
                  />
                  <StatusCard 
                    icon={<img src="/sound-icon1.svg" alt="Noise" className="w-[38px]" />}  
                    label="Noise" 
                    value={`${roomMetrics.noise_db.toFixed(0)} dB`}
                    color="#95E1D3"
                    status={roomMetrics.noise_db > 50 ? 'high' : 'normal'}
                  />
                </div>

                <p className="text-xs text-gray-400 mt-4 text-center m-0">
                  Last updated: {new Date(roomMetrics.measured_at).toLocaleTimeString()}
                </p>
              </div>
            )}

            {/* Nappi Recommends */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-5 shadow-lg">
              <h3 className="text-lg font-semibold text-[#000] mb-3 font-['Segoe_UI']">
                Nappi Recommends
              </h3>
              <p className="text-base leading-snug text-gray-700 m-0">
                {sleepSummary && sleepSummary.sleep_quality_score < 80 ? (
                  <>
                    {babyName}&apos;s last nap quality was <strong>{sleepSummary.sleep_quality_score}/100</strong>. 
                    Try adjusting the room temperature or reducing noise levels for better sleep.
                  </>
                ) : (
                  <>
                    {babyName}&apos;s last nap was probably interrupted by a sudden high noise at around 10:15 AM. 
                    Try keeping the room quiet or using gentle white noise to help them rest longer.
                  </>
                )}
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 py-2">
    <span className="flex items-center justify-center w-6 h-6">{icon}</span>
    <span className="text-sm text-gray-600 flex-1">{label}</span>
    <span className="text-sm text-[#000] font-semibold">{value}</span>
  </div>
);

const MetricCard: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  symbol: string;
  isOpen: boolean;
  onClick: () => void;
}> = ({ icon, label, symbol, isOpen, onClick }) => (
<div 
    onClick={onClick}
    className={`relative h-[115.8px] rounded-[42.7px] bg-white shrink-0 flex flex-col items-center pt-[9px] px-[23px] pb-[8.4px] box-border gap-[12.2px] cursor-pointer transition-all hover:shadow-lg ${
      isOpen ? 'shadow-lg overflow-visible z-10' : 'overflow-hidden'
    }`}
  >
    <div className="flex items-start justify-center">
      {icon}
    </div>
    <div className={`h-[30px] relative leading-[91%] font-semibold text-base font-[Kodchasan] flex items-center justify-center ${
      label.includes('level') ? 'whitespace-pre-line text-center' : ''
    }`}>
      {label}
    </div>
    <div className="flex items-center justify-center">
      <div className="h-3.5 relative leading-[89%] font-semibold text-base font-[Kodchasan]">
        {isOpen ? '−' : symbol}
      </div>
    </div>

    {isOpen && (
      <img
        src="/open-box-nack.svg"
        alt=""
        className="absolute left-1/2 -translate-x-1/2 w-[109px] max-w-none pointer-events-none"
        style={{ 
          bottom: '-30px', 
          zIndex: 20,
          marginLeft: '25px'
        }}
      />
    )}
  </div>
);

const StatusCard: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  color: string;
  status: 'normal' | 'high' | 'low';
}> = ({ icon, label, value, color, status }) => (
  <div 
    className={`rounded-3xl p-5 shadow-lg ${
      status === 'high' ? 'bg-red-50' : status === 'low' ? 'bg-gray-50' : 'bg-white/90'
    }`}
    style={{ borderLeftColor: color }}
  >
    <div className="text-3xl mb-2">{icon}</div>
    <div className="text-xs text-gray-600 mb-1">{label}</div>
    <div className="text-xl font-bold text-gray-800">{value}</div>
    {status !== 'normal' && (
      <div className={`text-xs font-medium mt-1 ${status === 'high' ? 'text-red-600' : 'text-blue-600'}`}>
        {status === 'high' ? '⚠️ Too high' : '❄️ Too low'}
      </div>
    )}
  </div>
);

export default HomeDashboard;