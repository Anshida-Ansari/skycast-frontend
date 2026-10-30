import type { UnitSystem } from '../types/weather.types';

export const formatTemperature = (
  temp: number | undefined | null,
  units: UnitSystem = 'metric'
): string => {
  if (temp === undefined || temp === null || isNaN(temp)) return '--';
  return `${Math.round(temp)}°${units === 'metric' ? 'C' : 'F'}`;
};

export const formatWindSpeed = (
  speed: number | undefined | null,
  units: UnitSystem = 'metric'
): string => {
  if (speed === undefined || speed === null || isNaN(speed)) return '--';
  return `${Math.round(speed * 10) / 10} ${units === 'metric' ? 'km/h' : 'mph'}`;
};

export const formatPressure = (
  pressure: number | undefined | null,
  units: UnitSystem = 'metric'
): string => {
  if (pressure === undefined || pressure === null || isNaN(pressure)) return '--';
  if (units === 'imperial') {
    // hPa to inHg: 1 hPa = 0.02953 inHg
    return `${(pressure * 0.02953).toFixed(2)} inHg`;
  }
  return `${pressure} hPa`;
};

export const formatWindDirection = (degrees: number | undefined | null): string => {
  if (degrees === undefined || degrees === null || isNaN(degrees)) return '--';
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((degrees % 360) / 22.5) % 16;
  return directions[index];
};

export const formatHourTime = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  } catch {
    return isoString;
  }
};

export const formatDayName = (dateString: string, index?: number): string => {
  if (index === 0) return 'Today';
  if (index === 1) return 'Tomorrow';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString([], { weekday: 'short' });
  } catch {
    return dateString;
  }
};

export const formatFullDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
};
