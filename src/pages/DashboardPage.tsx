import React from 'react';
import { useWeather } from '../hooks/useWeather';
import { CurrentWeatherHero } from '../components/weather/CurrentWeatherHero';
import { HourlyForecastSection } from '../components/weather/HourlyForecastSection';
import { DailyForecastSection } from '../components/weather/DailyForecastSection';
import { WeatherChartsSection } from '../components/weather/WeatherChartsSection';
import { AirQualitySection } from '../components/weather/AirQualitySection';
import { WeatherMapSection } from '../components/weather/WeatherMapSection';
import { FavoritesBar } from '../components/favorites/FavoritesBar';
import { SearchHistorySection } from '../components/history/SearchHistorySection';
import { DashboardSkeleton } from '../components/common/DashboardSkeleton';
import { ErrorBanner } from '../components/common/ErrorBanner';

export const DashboardPage: React.FC = () => {
  const { weatherData, loading, error, refreshWeather } = useWeather();

  return (
    <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      {/* 1. Saved Favorites Quick Switcher */}
      <FavoritesBar />

      {/* Loading State */}
      {loading && !weatherData && <DashboardSkeleton />}

      {/* Error State */}
      {error && !weatherData && <ErrorBanner message={error} onRetry={refreshWeather} />}

      {/* Hydrated Dashboard Layout */}
      {weatherData && (
        <>
          {/* 2. Hero Weather Card */}
          <CurrentWeatherHero />

          {/* 3. 24-Hour Forecast Carousel */}
          <HourlyForecastSection />

          {/* 4. 2-Column Desktop Grid for 7-Day & Interactive Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-5 h-full">
              <DailyForecastSection />
            </div>
            <div className="lg:col-span-7 h-full">
              <WeatherChartsSection />
            </div>
          </div>

          {/* 5. Air Quality & Atmosphere Section */}
          <AirQualitySection />

          {/* 6. Interactive Weather Map with Real Live Radar Overlay */}
          <WeatherMapSection />

          {/* 7. Search History Section */}
          <SearchHistorySection />
        </>
      )}
    </main>
  );
};
