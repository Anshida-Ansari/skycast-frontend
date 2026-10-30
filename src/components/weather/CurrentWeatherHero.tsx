import React from 'react';
import {
  Wind,
  Droplets,
  Gauge,
  Eye,
  Sunrise,
  Sunset,
  SunMedium,
  Cloudy,
  MapPin,
  Calendar,
} from 'lucide-react';
import { useWeather } from '../../hooks/useWeather';
import { useUnit } from '../../hooks/useUnit';
import { WeatherIcon } from '../../utils/weatherIcons';
import {
  formatTemperature,
  formatWindSpeed,
  formatWindDirection,
  formatPressure,
  formatFullDate,
  formatHourTime,
} from '../../utils/formatters';

export const CurrentWeatherHero: React.FC = () => {
  const { weatherData, location } = useWeather();
  const { unitSystem } = useUnit();

  if (!weatherData) return null;

  const { current, daily } = weatherData;
  const todayDaily = daily?.[0];

  const cityName = weatherData.location.city || location.name;
  const countryName = weatherData.location.country || location.country;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-blue-950/40 border border-slate-800/80 p-6 md:p-8 shadow-2xl backdrop-blur-xl">
      {/* Background atmospheric glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

      {/* Top Header: Location and Date */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-6 pb-5 border-b border-slate-800/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              {cityName}
              {countryName && (
                <span className="text-base md:text-lg font-normal text-slate-400">
                  , {countryName}
                </span>
              )}
            </h1>
            <p className="text-xs text-slate-400 font-mono flex items-center gap-2 mt-0.5">
              <span>
                {weatherData.location.latitude.toFixed(2)}°N,{' '}
                {weatherData.location.longitude.toFixed(2)}°E
              </span>
              <span>•</span>
              <span className="text-slate-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatFullDate(current.timestamp)}
              </span>
            </p>
          </div>
        </div>

        {/* Condition Badge */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-slate-200 text-xs font-semibold shadow-inner">
          <WeatherIcon
            iconName={current.condition.icon}
            isDay={current.condition.isDay}
            className="w-4 h-4"
          />
          <span>{current.condition.description}</span>
        </div>
      </div>

      {/* Middle Core: Temperature & Hero Visuals */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Giant Temperature */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="flex items-start gap-4">
            <div className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white">
              {formatTemperature(current.temperature, unitSystem)}
            </div>
            <div className="pt-2">
              <WeatherIcon
                iconName={current.condition.icon}
                isDay={current.condition.isDay}
                className="w-16 h-16 md:w-20 md:h-20 drop-shadow-lg"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-300">
            <p>
              Feels like{' '}
              <span className="font-semibold text-white">
                {formatTemperature(current.feelsLike, unitSystem)}
              </span>
            </p>
            {todayDaily && (
              <>
                <span className="text-slate-600">•</span>
                <p>
                  High:{' '}
                  <span className="font-semibold text-emerald-400">
                    {formatTemperature(todayDaily.maxTemperature, unitSystem)}
                  </span>
                </p>
                <span className="text-slate-600">•</span>
                <p>
                  Low:{' '}
                  <span className="font-semibold text-sky-400">
                    {formatTemperature(todayDaily.minTemperature, unitSystem)}
                  </span>
                </p>
              </>
            )}
          </div>
        </div>

        {/* Right: Essential Weather Metrics Grid */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
          {/* Wind */}
          <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:border-slate-600/70 transition-colors">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
              <Wind className="w-4 h-4 text-sky-400" />
              <span>Wind</span>
            </div>
            <p className="text-base font-bold text-slate-100">
              {formatWindSpeed(current.windSpeed, unitSystem)}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Direction: {formatWindDirection(current.windDirection)} ({current.windDirection}°)
            </p>
          </div>

          {/* Humidity */}
          <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:border-slate-600/70 transition-colors">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
              <Droplets className="w-4 h-4 text-blue-400" />
              <span>Humidity</span>
            </div>
            <p className="text-base font-bold text-slate-100">{current.humidity}%</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {current.humidity > 65 ? 'High Moisture' : 'Comfortable'}
            </p>
          </div>

          {/* Pressure */}
          <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:border-slate-600/70 transition-colors">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
              <Gauge className="w-4 h-4 text-purple-400" />
              <span>Pressure</span>
            </div>
            <p className="text-base font-bold text-slate-100">
              {formatPressure(current.pressure, unitSystem)}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Atmospheric MSL</p>
          </div>

          {/* UV Index */}
          <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:border-slate-600/70 transition-colors">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
              <SunMedium className="w-4 h-4 text-amber-400" />
              <span>UV Index</span>
            </div>
            <p className="text-base font-bold text-slate-100">{current.uvIndex}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {current.uvIndex >= 6 ? 'High Protection Needed' : 'Low to Moderate'}
            </p>
          </div>

          {/* Visibility / Cloud Cover */}
          <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:border-slate-600/70 transition-colors">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
              <Eye className="w-4 h-4 text-teal-400" />
              <span>Visibility</span>
            </div>
            <p className="text-base font-bold text-slate-100">{current.visibility} km</p>
            <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
              <Cloudy className="w-3 h-3" />
              {current.cloudCover}% Clouds
            </p>
          </div>

          {/* Sun Cycle */}
          <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:border-slate-600/70 transition-colors">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
              <Sunrise className="w-4 h-4 text-amber-300" />
              <span>Sun Cycle</span>
            </div>
            <div className="text-xs font-semibold text-slate-200 flex flex-col gap-0.5">
              <span className="flex items-center gap-1">
                <Sunrise className="w-3 h-3 text-amber-400" />
                {current.sunrise ? formatHourTime(current.sunrise) : '--'}
              </span>
              <span className="flex items-center gap-1 text-slate-300">
                <Sunset className="w-3 h-3 text-indigo-400" />
                {current.sunset ? formatHourTime(current.sunset) : '--'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
