import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import type { AuthUser } from '../types/auth';

const Statistics: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Sensor graph state
  const [selectedSensor, setSelectedSensor] = useState<'temperature' | 'humidity' | 'noise'>('temperature');
  const [sensorDateRange, setSensorDateRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  // Sleep duration graph state
  const [sleepDateRange, setSleepDateRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

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

  const buildDateList = (startStr: string, endStr: string) => {
    if (!startStr || !endStr) return [];

    const [sy, sm, sd] = startStr.split('-').map(Number);
    const [ey, em, ed] = endStr.split('-').map(Number);

    const start = new Date(sy, sm - 1, sd);
    const end = new Date(ey, em - 1, ed);

    // guard: if user picked end < start
    if (end < start) return [];

    const out: string[] = [];
    const cur = new Date(start);

    while (cur <= end) {
      const y = cur.getFullYear();
      const m = String(cur.getMonth() + 1).padStart(2, '0');
      const d = String(cur.getDate()).padStart(2, '0');
      out.push(`${y}-${m}-${d}`);
      cur.setDate(cur.getDate() + 1);
    }

    return out;
  };

  // Mock sensor data generator
  const generateSensorData = () => {
    const dates = buildDateList(sensorDateRange.start, sensorDateRange.end);

    const sensorConfigs = {
      temperature: { min: 20, max: 25, unit: '°C' },
      humidity: { min: 40, max: 60, unit: '%' },
      noise: { min: 30, max: 50, unit: 'dB' }
    };

    const config = sensorConfigs[selectedSensor];

    return dates.map(date => ({
      date,
      value: +(config.min + Math.random() * (config.max - config.min)).toFixed(1)
    }));
  };

  const generateSleepDurationData = () => {
    const dates = buildDateList(sleepDateRange.start, sleepDateRange.end);

    return dates.map(date => {
      const hours = +(10 + Math.random() * 4).toFixed(1); // mock: 10.0–14.0
      const sessions = 2 + Math.floor(Math.random() * 3); // mock: 2–4
      return { date, hours, sessions };
    });
  };

  const sleepDurationData = generateSleepDurationData();

  // Mock sleep patterns data (24-hour visualization)
  const sleepPatterns = [
    { label: 'Morning nap', start: 8.75, end: 10.83, duration: 2.08 }, // 8:45 - 10:50
    { label: 'Afternoon nap', start: 14.25, end: 16.25, duration: 2.0 }, // 2:15 PM - 4:15 PM
    { label: 'Night sleep', start: 20.25, end: 30.25, duration: 10.0 } // 8:15 PM - 6:15 AM (next day)
  ];

  const sensorData = generateSensorData();

  // Sensor chart options
  const getSensorUnit = () => {
    const units = { temperature: '°C', humidity: '%', noise: 'dB' };
    return units[selectedSensor];
  };

  const sensorChartOptions = {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const point = params[0];
        return `${point.name}<br/>${point.seriesName}: ${point.value}${getSensorUnit()}`;
      }
    },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
    xAxis: { type: 'category', data: sensorData.map(d => d.date), boundaryGap: false },
    yAxis: {
      type: 'value',
      name: getSensorUnit(),
      axisLabel: { formatter: `{value}${getSensorUnit()}` }
    },
    series: [
      {
        name: selectedSensor.charAt(0).toUpperCase() + selectedSensor.slice(1),
        type: 'line',
        smooth: true,
        data: sensorData.map(d => d.value),
        lineStyle: {
          width: 3,
          color:
            selectedSensor === 'temperature'
              ? '#F59E0B'
              : selectedSensor === 'humidity'
                ? '#3B82F6'
                : '#10B981'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color:
                  selectedSensor === 'temperature'
                    ? 'rgba(245, 158, 11, 0.3)'
                    : selectedSensor === 'humidity'
                      ? 'rgba(59, 130, 246, 0.3)'
                      : 'rgba(16, 185, 129, 0.3)'
              },
              {
                offset: 1,
                color:
                  selectedSensor === 'temperature'
                    ? 'rgba(245, 158, 11, 0.05)'
                    : selectedSensor === 'humidity'
                      ? 'rgba(59, 130, 246, 0.05)'
                      : 'rgba(16, 185, 129, 0.05)'
              }
            ]
          }
        },
        itemStyle: {
          color:
            selectedSensor === 'temperature'
              ? '#F59E0B'
              : selectedSensor === 'humidity'
                ? '#3B82F6'
                : '#10B981'
        }
      }
    ]
  };

  // Sleep duration chart options
  const sleepDurationOptions = {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const point = params[0];
        const data = sleepDurationData[point.dataIndex];
        return `${point.name}<br/>Total Sleep: ${point.value}h<br/>Sessions: ${data.sessions}`;
      }
    },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
    xAxis: { type: 'category', data: sleepDurationData.map(d => d.date), axisTick: { alignWithLabel: true } },
    yAxis: { type: 'value', name: 'Hours', min: 0, max: 15 },
    series: [
      {
        name: 'Sleep Duration',
        type: 'bar',
        barWidth: '60%',
        data: sleepDurationData.map(d => ({
          value: d.hours,
          itemStyle: { color: d.hours >= 12 ? '#10B981' : d.hours >= 10 ? '#6366F1' : '#F59E0B' }
        })),
        label: { show: true, position: 'top', formatter: '{c}h' }
      }
    ]
  };

  // --- CHANGED: PRE-PROCESS DATA TO SPLIT MIDNIGHT ---
  const processedSleepPatterns = sleepPatterns.flatMap((p) => {
    const crossesMidnight = p.end < p.start || p.end > 24;
    
    if (crossesMidnight) {
      const endFirst = 24;
      const endSecond = p.end > 24 ? p.end - 24 : p.end;
      // We return two segments. Note: The second segment starts at 0.
      return [
        { ...p, start: p.start, end: endFirst, duration: endFirst - p.start },
        { ...p, start: 0, end: endSecond, duration: endSecond }
      ];
    }
    return p;
  });

  // --- CHANGED: OPTION OBJECT ---
  const sleepPatternsOptions = {
    tooltip: {
      // Use 'item' trigger so we get the specific bar's data
      trigger: 'item',
      formatter: (params: any) => {
        // Retrieve the specific pattern data attached to this bar
        const pattern = params.data.customData; 
        if (!pattern) return '';

        const formatTime = (hour: number) => {
          const h = Math.floor(hour) % 24;
          const m = Math.round((hour % 1) * 60);
          return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        };

        return `
          <b>${pattern.label}</b><br/>
          ${formatTime(pattern.start)} - ${formatTime(pattern.end)}<br/>
          Duration: ${pattern.duration.toFixed(1)}h
        `;
      }
    },
    // Force a single track by using a category axis
    radiusAxis: { 
      type: 'category', 
      data: ['Sleep'], // The "0" index maps to this
      show: false 
    },
    angleAxis: {
      type: 'value',
      min: 0,
      max: 24,
      startAngle: 90,
      clockwise: true,
      splitLine: { show: true, lineStyle: { color: '#E5E7EB', type: 'dashed' } },
      axisLabel: {
        formatter: (value: number) =>
          [0, 6, 12, 18].includes(value) ? `${value.toString().padStart(2, '0')}:00` : ''
      }
    },
    polar: { radius: '75%' },
    series: processedSleepPatterns.flatMap((pattern, idx) => {
      const stackId = `stack-${idx}`;
      
      // Determine color based on label
      let color = '#818CF8'; // Default (Night)
      if (pattern.label.toLowerCase().includes('morning')) color = '#FCD34D';
      if (pattern.label.toLowerCase().includes('afternoon')) color = '#60A5FA';

      return [
        {
          type: 'bar',
          coordinateSystem: 'polar',
          stack: stackId,
          barGap: '-100%', // FORCE OVERLAP on same ring
          tooltip: { show: false },
          itemStyle: { color: 'transparent', borderColor: 'transparent' },
          // FIX: Order must be [RadiusIndex, AngleValue]
          data: [{ value: [0, pattern.start], customData: pattern }], 
          z: 1
        },
        {
          type: 'bar',
          coordinateSystem: 'polar',
          stack: stackId,
          barGap: '-100%',
          barCategoryGap: '0%', 
          roundCap: true,
          barWidth: 30,
          // FIX: Order must be [RadiusIndex, AngleValue]
          data: [{ value: [0, pattern.duration], customData: pattern }],
          itemStyle: { color },
          z: 2
        }
      ];
    })
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#fee2d6] via-[#FAFBFC] to-[#e2f9fb] p-0 md:p-8 overflow-x-hidden relative">
      {/* Decorative background clouds */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img src="/Vector1.svg" alt="" className="absolute top-[10%] left-[20%] w-[200px] h-[100px] opacity-60" />
        <img src="/Vector.svg" alt="" className="absolute top-[5%] right-[5%] w-[120px] h-[60px] opacity-40" />
        <img src="/Vector1.svg" alt="" className="absolute top-[60%] left-[25%] w-[250px] h-[150px]" />
        <img src="/Vector.svg" alt="" className="absolute top-[50%] right-[15%] w-[150px] h-[70px] opacity-50" />
      </div>

      {/* Burger Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
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
            <button onClick={() => setMenuOpen(false)} className="text-2xl text-gray-600 hover:text-gray-800">
              ✕
            </button>
          </div>

          <nav className="flex flex-col gap-4">
            <button
              onClick={() => {
                navigate('/');
                setMenuOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-700 font-medium transition-all"
            >
              <img src="/fluent-home-20-filled.svg" alt="" className="w-5 h-5" />
              Home
            </button>

            <button
              onClick={() => {
                navigate('/statistics');
                setMenuOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#4ECDC4]/10 text-[#4ECDC4] font-medium hover:bg-[#4ECDC4]/20 transition-all"
            >
              <img src="/material-symbols-light-chart-data-outline.svg" alt="" className="w-5 h-5" />
              Statistics
            </button>

            <button
              onClick={() => {
                navigate('/notifications');
                setMenuOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-700 font-medium transition-all"
            >
              <span className="text-xl">🔔</span>
              Alerts
            </button>

            <button
              onClick={() => {
                navigate('/user');
                setMenuOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-700 font-medium transition-all"
            >
              <span className="text-xl">👤</span>
              Profile
            </button>
          </nav>
        </div>

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

      {/* Inner content container */}
      <div className="w-full h-full md:h-auto md:max-w-2xl lg:max-w-3xl relative flex flex-col min-h-screen md:min-h-[600px] isolate">
        {/* Header Section */}
        <section className="pt-6 px-5 pb-6 relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div
                className="cursor-pointer rounded-full hover:bg-gray-50 transition-colors"
                onClick={() => setMenuOpen(true)}
              >
                <img className="w-12 h-[37px]" alt="Menu" src="/hugeicons-menu-02.svg" />
              </div>
            </div>

            <div className="text-center relative">
              <div className="flex flex-col items-center text-center relative">
                <img className="w-12 h-12" src="/streamline-graph-arrow-increase.svg" alt="" />
                <h1 className="text-2xl font-semibold font-[Kodchasan] text-[#000] m-0">Sleep Analytics</h1>
              </div>
              <p className="text-sm font-[Kodchasan] text-gray-600 m-0">{babyName}&apos;s patterns</p>
            </div>

            <img src="/logo.svg" alt="Nappi" className="w-12 h-12" />
          </div>
        </section>

        {/* Main Content */}
        <section className="px-5 pb-8 relative z-10">
          <div className="flex flex-col gap-5">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard icon="🌙" label="Avg. Sleep" value="11h 45m" color="#6366F1" trend="+25min" />
              <StatCard icon="⭐" label="Avg. Quality" value="87/100" color="#10B981" trend="+5pts" />
              <StatCard icon="🔔" label="Awakenings" value="2.1/night" color="#F59E0B" trend="-0.3" />
              <StatCard icon="🏆" label="Best Night" value="Friday" color="#EC4899" trend="13.5h" />
            </div>

            {/* Sensor Data Over Time */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-5 shadow-lg">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <h3 className="text-lg font-semibold text-[#000] font-['Segoe_UI']">Room Conditions</h3>
                <div className="flex flex-wrap gap-2">
                  <select
                    value={selectedSensor}
                    onChange={(e) => setSelectedSensor(e.target.value as any)}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4ECDC4]"
                  >
                    <option value="temperature">🌡️ Temperature</option>
                    <option value="humidity">💧 Humidity</option>
                    <option value="noise">🔊 Noise</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <input
                  type="date"
                  value={sensorDateRange.start}
                  onChange={(e) => setSensorDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4ECDC4]"
                />
                <span className="flex items-center text-gray-500">to</span>
                <input
                  type="date"
                  value={sensorDateRange.end}
                  onChange={(e) => setSensorDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4ECDC4]"
                />
              </div>

              <ReactECharts option={sensorChartOptions} style={{ height: '250px' }} />
            </div>

            {/* Sleep Duration Chart */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-5 shadow-lg">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <h3 className="text-lg font-semibold text-[#000] font-['Segoe_UI']">Daily Sleep Duration</h3>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <input
                  type="date"
                  value={sleepDateRange.start}
                  onChange={(e) => setSleepDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4ECDC4]"
                />
                <span className="flex items-center text-gray-500">to</span>
                <input
                  type="date"
                  value={sleepDateRange.end}
                  onChange={(e) => setSleepDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4ECDC4]"
                />
              </div>

              <ReactECharts option={sleepDurationOptions} style={{ height: '250px' }} />

              <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-gray-100">
                <LegendItem color="#10B981" label="Excellent (12+ hrs)" />
                <LegendItem color="#6366F1" label="Good (10-12 hrs)" />
                <LegendItem color="#F59E0B" label="Fair (<10 hrs)" />
              </div>
            </div>

            {/* Sleep Patterns - 24 Hour Clock */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-5 shadow-lg">
              <h3 className="text-lg font-semibold text-[#000] mb-4 font-['Segoe_UI']">
                Typical Sleep Patterns (24-Hour Clock)
              </h3>

              <ReactECharts option={sleepPatternsOptions} style={{ height: '300px' }} />

              <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-gray-100">
                <LegendItem color="#FCD34D" label="Morning Nap (8:45-10:50)" />
                <LegendItem color="#60A5FA" label="Afternoon Nap (2:15-4:15)" />
                <LegendItem color="#818CF8" label="Night Sleep (8:15 PM-6:15 AM)" />
              </div>
            </div>

            {/* Insights Card */}
            <div className="bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] rounded-3xl p-5 shadow-lg">
              <h3 className="text-lg font-semibold text-[#92400E] mb-3 font-['Segoe_UI'] flex items-center gap-2">
                <span>💡</span> Weekly Insights
              </h3>

              <ul className="m-0 pl-5 text-[#78350F] leading-relaxed text-sm">
                <li className="mb-2">
                  {babyName} slept best on <strong>Friday</strong> with 13.5 hours
                </li>
                <li className="mb-2">
                  Room temperature around <strong>22°C</strong> correlates with better sleep
                </li>
                <li>
                  Morning nap typically starts at <strong>8:45 AM</strong> - great for scheduling activities
                </li>
              </ul>
            </div>

            {/* Coming Soon */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg text-center">
              <span className="text-5xl">🚀</span>
              <h4 className="mt-3 mb-2 text-lg font-semibold text-[#000] font-[Kodchasan]">More Analytics Coming Soon</h4>
              <p className="m-0 text-gray-600 text-sm">
                Sleep stage breakdown, monthly trends, and personalized recommendations
              </p>
            </div>
          </div>
        </section>
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
  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg" style={{ borderLeft: `4px solid ${color}` }}>
    <div className="text-2xl mb-2">{icon}</div>
    <div className="text-xs text-gray-600 mb-1">{label}</div>
    <div className="text-xl font-bold text-[#000]">{value}</div>
    <div
      className={`text-xs mt-1 font-medium ${
        trend.startsWith('+') ? 'text-green-500' : trend.startsWith('-') ? 'text-red-500' : 'text-gray-600'
      }`}
    >
      {trend}
    </div>
  </div>
);

const LegendItem: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <div className="w-3 h-3 rounded" style={{ backgroundColor: color }} />
    <span className="text-xs text-gray-600">{label}</span>
  </div>
);

export default Statistics;