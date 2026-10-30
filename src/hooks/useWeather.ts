import { useContext } from 'react';
import { WeatherContext, type WeatherContextType } from '../context/WeatherContext';

export const useWeather = (): WeatherContextType => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};

