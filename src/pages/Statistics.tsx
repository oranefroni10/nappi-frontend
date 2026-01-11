import React, { useEffect, useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { AuthUser } from '../types/auth';
import { useLayoutContext } from '../components/LayoutContext';

const Statistics: React.FC = () => {
  const { setMenuOpen } = useLayoutContext();
  const [user, setUser] = useState<AuthUser | null>(null);

  // Sensor graph state
  const [selectedSensor, setSelectedSensor] = useState<'temperature' | 'humidity' | 'noise'>('temperature');
  const [sensorDateRange, setSensorDateRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });

  // Sleep duration graph state
  const [sleepDateRange, setSleepDateRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    const stored = localStorage.getItem('nappi_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const babyName = user?.baby?.first_name || 'Baby';

  const buildDateList = (startStr: string, endStr: string) => {
    if (!startStr || !endStr) return [];

    const [sy, sm, sd] = startStr.split('-').map(Number);
    const [ey, em, ed] = endStr.split('-').map(Number);

    const start = new Date(sy, sm - 1, sd);
    const end = new Date(ey, em - 1, ed);

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

  // Mock sensor data generator - MEMOIZED to prevent unnecessary recalculation
  const sensorData = useMemo(() => {
    const dates = buildDateList(sensorDateRange.start, sensorDateRange.end);

    const sensorConfigs = {
      temperature: { min: 20, max: 25, unit: '°C' },
      humidity: { min: 40, max: 60, unit: '%' },
      noise: { min: 30, max: 50, unit: 'dB' },
    };

    const config = sensorConfigs[selectedSensor];

    return dates.map((date) => ({
      date,
      value: +(config.min + Math.random() * (config.max - config.min)).toFixed(1),
    }));
  }, [sensorDateRange.start, sensorDateRange.end, selectedSensor]);

  // MEMOIZED sleep duration data
  const sleepDurationData = useMemo(() => {
    const dates = buildDateList(sleepDateRange.start, sleepDateRange.end);

    return dates.map((date) => {
      const hours = +(10 + Math.random() * 4).toFixed(1);
      const sessions = 2 + Math.floor(Math.random() * 3);
      return { date, hours, sessions };
    });
  }, [sleepDateRange.start, sleepDateRange.end]);

  // Mock sleep patterns data (24-hour visualization) - STATIC, no dependencies
  const sleepPatterns = useMemo(
    () => [
      { label: 'Morning nap', start: 8.75, end: 10.83, duration: 2.08 },
      { label: 'Afternoon nap', start: 14.25, end: 16.25, duration: 2.0 },
      { label: 'Night sleep', start: 20.25, end: 30.25, duration: 10.0 },
    ],
    []
  );

  // Sensor chart options - MEMOIZED
  const getSensorUnit = () => {
    const units = { temperature: '°C', humidity: '%', noise: 'dB' };
    return units[selectedSensor];
  };

  const sensorChartOptions = useMemo(
    () => ({
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const point = params[0];
          return `${point.name}<br/>${point.seriesName}: ${point.value}${getSensorUnit()}`;
        },
      },
      grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
      xAxis: { type: 'category', data: sensorData.map((d) => d.date), boundaryGap: false },
      yAxis: {
        type: 'value',
        name: getSensorUnit(),
        axisLabel: { formatter: `{value}${getSensorUnit()}` },
      },
      series: [
        {
          name: selectedSensor.charAt(0).toUpperCase() + selectedSensor.slice(1),
          type: 'line',
          smooth: true,
          data: sensorData.map((d) => d.value),
          lineStyle: {
            width: 3,
            color: selectedSensor === 'temperature' ? '#F59E0B' : selectedSensor === 'humidity' ? '#3B82F6' : '#10B981',
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
                        : 'rgba(16, 185, 129, 0.3)',
                },
                {
                  offset: 1,
                  color:
                    selectedSensor === 'temperature'
                      ? 'rgba(245, 158, 11, 0.05)'
                      : selectedSensor === 'humidity'
                        ? 'rgba(59, 130, 246, 0.05)'
                        : 'rgba(16, 185, 129, 0.05)',
                },
              ],
            },
          },
          itemStyle: {
            color: selectedSensor === 'temperature' ? '#F59E0B' : selectedSensor === 'humidity' ? '#3B82F6' : '#10B981',
          },
        },
      ],
    }),
    [sensorData, selectedSensor]
  );

  // Sleep duration chart options - MEMOIZED
  const sleepDurationOptions = useMemo(
    () => ({
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const point = params[0];
          const data = sleepDurationData[point.dataIndex];
          return `${point.name}<br/>Total Sleep: ${point.value}h<br/>Sessions: ${data.sessions}`;
        },
      },
      grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
      xAxis: { type: 'category', data: sleepDurationData.map((d) => d.date), axisTick: { alignWithLabel: true } },
      yAxis: { type: 'value', name: 'Hours', min: 0, max: 15 },
      series: [
        {
          name: 'Sleep Duration',
          type: 'bar',
          barWidth: '60%',
          data: sleepDurationData.map((d) => ({
            value: d.hours,
            itemStyle: { color: d.hours >= 12 ? '#10B981' : d.hours >= 10 ? '#6366F1' : '#F59E0B' },
          })),
          label: { show: false },
        },
      ],
    }),
    [sleepDurationData]
  );

  // FIX #1: Process sleep patterns with CONSISTENT BAR WIDTH
  const processedSleepPatterns = useMemo(() => {
    return sleepPatterns.flatMap((p) => {
      const crossesMidnight = p.end < p.start || p.end > 24;

      if (crossesMidnight) {
        const endFirst = 24;
        const endSecond = p.end > 24 ? p.end - 24 : p.end;

        return [
          {
            ...p,
            start: p.start,
            end: endFirst,
            duration: endFirst - p.start,
            segmentId: `${p.label}-1`,
            parentLabel: p.label,
          },
          {
            ...p,
            start: 0,
            end: endSecond,
            duration: endSecond,
            segmentId: `${p.label}-2`,
            parentLabel: p.label,
          },
        ];
      }
      return {
        ...p,
        segmentId: p.label,
        parentLabel: p.label,
      };
    });
  }, [sleepPatterns]);

  // FIX #1: Sleep patterns chart with CONSISTENT BAR WIDTH - MEMOIZED
  const sleepPatternsOptions = useMemo(
    () => ({
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const pattern = params.data.customData;
          if (!pattern) return '';

          const formatTime = (hour: number) => {
            const h = Math.floor(hour) % 24;
            const m = Math.round((hour % 1) * 60);
            return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
          };

          const originalPattern = sleepPatterns.find((p) => p.label === pattern.parentLabel);
          if (!originalPattern) return '';

          return `
          <b>${originalPattern.label}</b><br/>
          ${formatTime(originalPattern.start)} - ${formatTime(originalPattern.end > 24 ? originalPattern.end - 24 : originalPattern.end)}<br/>
          Duration: ${originalPattern.duration.toFixed(1)}h
        `;
        },
      },
      radiusAxis: {
        type: 'category',
        data: ['Sleep'],
        show: false,
      },
      angleAxis: {
        type: 'value',
        min: 0,
        max: 24,
        startAngle: 90,
        clockwise: true,
        splitLine: { show: true, lineStyle: { color: '#E5E7EB', type: 'dashed' } },
        axisLabel: {
          formatter: (value: number) => ([0, 6, 12, 18].includes(value) ? `${value.toString().padStart(2, '0')}:00` : ''),
        },
      },
      polar: { radius: '75%' },
      series: processedSleepPatterns.flatMap((pattern) => {
        const stackId = `stack-${pattern.parentLabel}`;

        let color = '#818CF8';
        if (pattern.label.toLowerCase().includes('morning')) color = '#FCD34D';
        if (pattern.label.toLowerCase().includes('afternoon')) color = '#60A5FA';

        return [
          {
            type: 'bar',
            coordinateSystem: 'polar',
            stack: stackId,
            barGap: '-100%',
            tooltip: { show: false },
            itemStyle: { color: 'transparent', borderColor: 'transparent' },
            data: [{ value: [0, pattern.start], customData: pattern }],
            z: 1,
          },
          {
            type: 'bar',
            coordinateSystem: 'polar',
            stack: stackId,
            barGap: '-100%',
            barCategoryGap: '0%',
            roundCap: false,
            barWidth: 30,
            data: [{ value: [0, pattern.duration], customData: pattern }],
            itemStyle: { color , shadowColor: 'rgba(0,0,0,0.12)', shadowOffsetY: 2,},
            z: 2,
          },
        ];
      }),
    }),
    [processedSleepPatterns, sleepPatterns]
  );

  return (
    <>
      {/* Header Section */}
      <section className="pt-6 px-5 pb-6 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="cursor-pointer rounded-full hover:bg-gray-50 transition-colors" onClick={() => setMenuOpen(true)}>
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

          {/* Sensor Data Over Time */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-5 shadow-lg">
            <div className="flex flex-row justify-between items-start sm:items-center gap-3 mb-4">
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
                onChange={(e) => setSensorDateRange((prev) => ({ ...prev, start: e.target.value }))}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4ECDC4]"
              />
              <input
                type="date"
                value={sensorDateRange.end}
                onChange={(e) => setSensorDateRange((prev) => ({ ...prev, end: e.target.value }))}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4ECDC4]"
              />
            </div>

            <ReactECharts option={sensorChartOptions} style={{ height: '250px' }} notMerge={true} lazyUpdate={true} />
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
                onChange={(e) => setSleepDateRange((prev) => ({ ...prev, start: e.target.value }))}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4ECDC4]"
              />
              <span className="flex items-center text-gray-500">to</span>
              <input
                type="date"
                value={sleepDateRange.end}
                onChange={(e) => setSleepDateRange((prev) => ({ ...prev, end: e.target.value }))}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4ECDC4]"
              />
            </div>

            <ReactECharts option={sleepDurationOptions} style={{ height: '250px' }} notMerge={true} lazyUpdate={true} />

            <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-gray-100">
              <LegendItem color="#10B981" label="Excellent (12+ hrs)" />
              <LegendItem color="#6366F1" label="Good (10-12 hrs)" />
              <LegendItem color="#F59E0B" label="Fair (<10 hrs)" />
            </div>
          </div>

          {/* Sleep Patterns - 24 Hour Clock */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-5 shadow-lg">
            <h3 className="text-lg font-semibold text-[#000] mb-4 font-['Segoe_UI']">Typical Sleep Patterns (24-Hour Clock)</h3>

            <ReactECharts option={sleepPatternsOptions} style={{ height: '300px' }} notMerge={true} lazyUpdate={true} />

            <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-gray-100">
              <LegendItem color="#FCD34D" label="Morning Nap (8:45-10:50)" />
              <LegendItem color="#60A5FA" label="Afternoon Nap (2:15-4:15)" />
              <LegendItem color="#818CF8" label="Night Sleep (8:15 PM-6:15 AM)" />
            </div>
          </div>

          {/* Insights Card */}
          <div className="bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] rounded-3xl p-5 shadow-lg">
            <h3 className="text-lg font-semibold text-[#92400E] mb-3 font-['Segoe_UI'] flex items-center gap-2">
              Weekly Insights
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
        </div>
      </section>
    </>
  );
};

const LegendItem: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <div className="w-3 h-3 rounded" style={{ backgroundColor: color }} />
    <span className="text-xs text-gray-600">{label}</span>
  </div>
);

export default Statistics;
