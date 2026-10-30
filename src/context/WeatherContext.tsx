import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { FullWeatherResponse } from '../types/weather.types';
import { weatherApi } from '../api/weatherApi';
import { useUnit } from '../hooks/useUnit';

export interface LocationInfo {
  name: string;
  country: string;
  region?: string;
  latitude: number;
  longitude: number;
}

const DEFAULT_LOCATION: LocationInfo = {
  name: 'London',
  country: 'United Kingdom',
  region: 'England',
  latitude: 51.5074,
  longitude: -0.1278,
};

export interface WeatherContextType {
  location: LocationInfo;
  weatherData: FullWeatherResponse | null;
  loading: boolean;
  error: string | null;
  selectLocation: (loc: LocationInfo) => void;
  refreshWeather: () => void;
}

export const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { unitSystem } = useUnit();

  const [location, setLocation] = useState<LocationInfo>(() => {
    const saved = localStorage.getItem('skycast_last_location');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_LOCATION;
      }
    }
    return DEFAULT_LOCATION;
  });

  const [weatherData, setWeatherData] = useState<FullWeatherResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async (loc: LocationInfo) => {
    setLoading(true);
    setError(null);
    try {
      const data = await weatherApi.getFullForecast(
        loc.latitude,
        loc.longitude,
        unitSystem,
        loc.name,
        loc.country
      );
      setWeatherData(data);
      localStorage.setItem('skycast_last_location', JSON.stringify(loc));
    } catch (err: any) {
      setError(err.message || 'Failed to fetch weather data for the selected location.');
    } finally {
      setLoading(false);
    }
  }, [unitSystem]);

  useEffect(() => {
    let isCancelled = false;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await weatherApi.getFullForecast(
          location.latitude,
          location.longitude,
          unitSystem,
          location.name,
          location.country
        );
        if (!isCancelled) {
          setWeatherData(data);
          localStorage.setItem('skycast_last_location', JSON.stringify(location));
        }
      } catch (err: any) {
        if (!isCancelled) {
          setError(err.message || 'Failed to fetch weather data for the selected location.');
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    run();
    return () => {
      isCancelled = true;
    };
  }, [location, unitSystem]);

  const selectLocation = (newLoc: LocationInfo) => {
    setLocation(newLoc);

    // Save to guest recent searches
    try {
      const existingStr = localStorage.getItem('skycast_recent_searches');
      const list: LocationInfo[] = existingStr ? JSON.parse(existingStr) : [];
      const filtered = list.filter(
        (item) =>
          Math.abs(item.latitude - newLoc.latitude) > 0.05 ||
          Math.abs(item.longitude - newLoc.longitude) > 0.05
      );
      filtered.unshift(newLoc);
      localStorage.setItem('skycast_recent_searches', JSON.stringify(filtered.slice(0, 8)));
    } catch {
      // Silently ignore storage errors
    }
  };

  const refreshWeather = () => {
    fetchWeather(location);
  };

  const value: WeatherContextType = {
    location,
    weatherData,
    loading,
    error,
    selectLocation,
    refreshWeather,
  };

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>;
};
