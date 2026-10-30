import React from 'react';
import { CalendarDays, Droplets } from 'lucide-react';
import { useWeather } from '../../hooks/useWeather';
import { useUnit } from '../../hooks/useUnit';
import { WeatherIcon } from '../../utils/weatherIcons';
import {
  formatTemperature,
  formatDayName,
  formatFullDate,
} from '../../utils/formatters';

export const DailyForecastSection: React.FC = () => {
  const { weatherData } = useWeather();
  const { unitSystem } = useUnit();

  if (!weatherData || !weatherData.daily || weatherData.daily.length === 0) {
    return null;
  }

  // Calculate lowest and highest across entire 7-day week for normalized bar ratios
  const allMins = weatherData.daily.map((d) => d.minTemperature);
  const allMaxs = weatherData.daily.map((d) => d.maxTemperature);
  const globalMin = Math.min(...allMins);
  const globalMax = Math.max(...allMaxs);
  const range = Math.max(globalMax - globalMin, 1);

  return (
    <div className="h-full flex flex-col justify-between rounded-3xl bg-slate-900/80 border border-slate-800/80 p-5 md:p-6 backdrop-blur-md shadow-xl">
      <div>
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800/60">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">7-Day Forecast</h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">Daily Outlook</span>
        </div>

        <div className="space-y-2.5">
          {weatherData.daily.map((day, idx) => {
            // Calculate bar offsets
            const leftPercent = Math.max(0, ((day.minTemperature - globalMin) / range) * 100);
            const widthPercent = Math.max(
              10,
              ((day.maxTemperature - day.minTemperature) / range) * 100
            );

            return (
              <div
                key={day.date}
                className="flex items-center justify-between gap-2 sm:gap-3 p-3 rounded-2xl bg-slate-800/30 hover:bg-slate-800/60 border border-slate-700/30 transition-all"
              >
                {/* 1. Day & Date */}
                <div className="w-20 sm:w-24 shrink-0">
                  <p className="text-sm font-semibold text-slate-100">
                    {formatDayName(day.date, idx)}
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {formatFullDate(day.date)}
                  </p>
                </div>

                {/* 2. Icon & Condition Description */}
                <div className="flex items-center gap-2 flex-1 min-w-[90px] sm:min-w-[120px] overflow-hidden">
                  <WeatherIcon
                    iconName={day.condition.icon}
                    isDay={true}
                    className="w-5 h-5 sm:w-6 sm:h-6 shrink-0"
                  />
                  <span className="text-xs text-slate-300 truncate">
                    {day.condition.description}
                  </span>
                </div>

                {/* 3. Precipitation chance */}
                <div className="flex items-center justify-center gap-1 w-11 sm:w-12 shrink-0 text-xs font-medium text-sky-400">
                  {day.precipitationProbabilityMax > 0 ? (
                    <>
                      <Droplets className="w-3.5 h-3.5 shrink-0" />
                      <span>{day.precipitationProbabilityMax}%</span>
                    </>
                  ) : (
                    <span className="text-slate-600">--</span>
                  )}
                </div>

                {/* 4. Temperature Section with Visual Bar */}
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 justify-end">
                  <span className="text-xs font-semibold text-sky-400 w-8 text-right shrink-0">
                    {formatTemperature(day.minTemperature, unitSystem)}
                  </span>

                  {/* Guaranteed Visual Bar */}
                  <div className="w-14 sm:w-18 md:w-20 h-2 bg-slate-950/80 rounded-full overflow-hidden relative shrink-0">
                    <div
                      className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-300 to-rose-400"
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                      }}
                    />
                  </div>

                  <span className="text-xs font-semibold text-emerald-400 w-8 text-left shrink-0">
                    {formatTemperature(day.maxTemperature, unitSystem)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
