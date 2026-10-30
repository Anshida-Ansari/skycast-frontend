import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import { LineChart as ChartIcon, BarChart3, TrendingUp } from 'lucide-react';
import { useWeather } from '../../hooks/useWeather';
import { useUnit } from '../../hooks/useUnit';
import { formatHourTime, formatDayName } from '../../utils/formatters';

type ChartTab = 'hourlyTemp' | 'precipitation' | 'weeklyTrend';

export const WeatherChartsSection: React.FC = () => {
  const { weatherData } = useWeather();
  const { unitSystem, tempSymbol } = useUnit();
  const [activeTab, setActiveTab] = useState<ChartTab>('hourlyTemp');

  if (!weatherData) return null;

  // Prepare hourly data (next 24 hours)
  const hourlyData = (weatherData.hourly || []).slice(0, 24).map((item) => ({
    time: formatHourTime(item.time),
    temperature: item.temperature,
    feelsLike: item.feelsLike,
    precipitationProbability: item.precipitationProbability,
    precipitation: item.precipitation,
    humidity: item.humidity,
  }));

  // Prepare 7-day daily data
  const dailyData = (weatherData.daily || []).map((item, idx) => ({
    day: formatDayName(item.date, idx),
    maxTemp: item.maxTemperature,
    minTemp: item.minTemperature,
    precipitationProbability: item.precipitationProbabilityMax,
  }));

  return (
    <div className="h-full flex flex-col rounded-3xl bg-slate-900/80 border border-slate-800/80 p-5 md:p-6 backdrop-blur-md shadow-xl">
      {/* Header and Tab Controls with clean non-wrapping layout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/60 shrink-0">
        <div className="flex items-center gap-2 shrink-0">
          <ChartIcon className="w-5 h-5 text-blue-400 shrink-0" />
          <h2 className="text-lg font-bold text-white tracking-tight whitespace-nowrap">
            Forecast Trends
          </h2>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center bg-slate-950/70 border border-slate-800 rounded-xl p-1 self-start sm:self-auto shrink-0">
          <button
            onClick={() => setActiveTab('hourlyTemp')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'hourlyTemp'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>24h Temp</span>
          </button>
          <button
            onClick={() => setActiveTab('precipitation')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'precipitation'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Precipitation</span>
          </button>
          <button
            onClick={() => setActiveTab('weeklyTrend')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'weeklyTrend'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ChartIcon className="w-3.5 h-3.5" />
            <span>7-Day Range</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas - flex-1 stretches to dynamically match 7-Day Forecast height */}
      <div className="w-full flex-1 min-h-[350px] pt-2">
          {activeTab === 'hourlyTemp' && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="feelsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis
                  dataKey="time"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  unit={tempSymbol}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '0.75rem',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
                  }}
                  formatter={(val: any) => [`${val}${tempSymbol}`, '']}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ paddingBottom: '10px', fontSize: '0.75rem' }}
                />
                <Area
                  type="monotone"
                  name="Actual Temperature"
                  dataKey="temperature"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#tempGradient)"
                />
                <Area
                  type="monotone"
                  name="Feels Like"
                  dataKey="feelsLike"
                  stroke="#38bdf8"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#feelsGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {activeTab === 'precipitation' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis
                  dataKey="time"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  unit="%"
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '0.75rem',
                  }}
                  formatter={(val: any, name: any) => [
                    name === 'Chance of Rain' ? `${val}%` : `${val} ${unitSystem === 'metric' ? 'mm' : 'in'}`,
                    name,
                  ]}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ paddingBottom: '10px', fontSize: '0.75rem' }}
                />
                <Bar
                  name="Chance of Rain"
                  dataKey="precipitationProbability"
                  fill="#0ea5e9"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}

          {activeTab === 'weeklyTrend' && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="maxGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="minGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis
                  dataKey="day"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  unit={tempSymbol}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '0.75rem',
                  }}
                  formatter={(val: any) => [`${val}${tempSymbol}`, '']}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ paddingBottom: '10px', fontSize: '0.75rem' }}
                />
                <Area
                  type="monotone"
                  name="Max Temp"
                  dataKey="maxTemp"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#maxGradient)"
                />
                <Area
                  type="monotone"
                  name="Min Temp"
                  dataKey="minTemp"
                  stroke="#38bdf8"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#minGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
    </div>
  );
};
