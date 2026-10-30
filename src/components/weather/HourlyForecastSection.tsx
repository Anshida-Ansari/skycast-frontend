import React from 'react';
import { Clock, Droplets } from 'lucide-react';
import { useWeather } from '../../hooks/useWeather';
import { useUnit } from '../../hooks/useUnit';
import { WeatherIcon } from '../../utils/weatherIcons';
import { formatTemperature, formatHourTime } from '../../utils/formatters';

export const HourlyForecastSection: React.FC = () => {
  const { weatherData } = useWeather();
  const { unitSystem } = useUnit();

  if (!weatherData || !weatherData.hourly || weatherData.hourly.length === 0) {
    return null;
  }

  // Display the next 24 hourly steps
  const items = weatherData.hourly.slice(0, 24);

  return (
    <div className="rounded-3xl bg-slate-900/80 border border-slate-800/80 p-5 md:p-6 backdrop-blur-md shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-bold text-white tracking-tight">Hourly Forecast</h2>
        </div>
        <span className="text-xs text-slate-400 font-medium">Next 24 Hours</span>
      </div>

      {/* Horizontally scrollable row with custom smooth scrollbar */}
      <div className="flex gap-3 overflow-x-auto pb-3 pt-1 scrollbar-thin">
        {items.map((item, index) => {
          const isFirst = index === 0;
          return (
            <div
              key={item.time}
              className={`flex flex-col items-center justify-between min-w-[5.25rem] px-3 py-4 rounded-2xl border transition-all ${
                isFirst
                  ? 'bg-blue-600/20 border-blue-500/40 shadow-lg shadow-blue-500/10'
                  : 'bg-slate-800/40 border-slate-700/40 hover:bg-slate-800/80 hover:border-slate-600/60'
              }`}
            >
              <span
                className={`text-xs font-semibold ${
                  isFirst ? 'text-blue-400' : 'text-slate-400'
                }`}
              >
                {isFirst ? 'Now' : formatHourTime(item.time)}
              </span>

              <div className="my-2.5">
                <WeatherIcon
                  iconName={item.condition.icon}
                  isDay={item.condition.isDay}
                  className="w-8 h-8 drop-shadow"
                />
              </div>

              <span className="text-sm font-bold text-slate-100">
                {formatTemperature(item.temperature, unitSystem)}
              </span>

              {/* Precipitation probability pill */}
              <div className="flex items-center gap-1 mt-2 text-[11px] font-medium text-sky-400">
                <Droplets className="w-3 h-3" />
                <span>{item.precipitationProbability}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
