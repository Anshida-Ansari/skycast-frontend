import { apiClient } from './apiClient';
import type {
  ApiResponse,
  FullWeatherResponse,
  GeocodingLocation,
  CurrentWeather,
  HourlyForecastItem,
  DailyForecastItem,
  AirQualityData,
  UnitSystem,
} from '../types/weather.types';

export const weatherApi = {
  /**
   * Search cities by name with autocomplete
   */
  async searchCities(query: string): Promise<GeocodingLocation[]> {
    if (!query || query.trim().length < 2) return [];
    const response = await apiClient.get<ApiResponse<GeocodingLocation[]>>('/weather/search', {
      params: { q: query.trim() },
    });
    return response.data.data;
  },

  /**
   * Fetch complete consolidated weather package (Current, 24h Hourly, 7d Daily, AQI, Alerts)
   */
  async getFullForecast(
    lat: number,
    lon: number,
    units: UnitSystem = 'metric',
    city?: string,
    country?: string
  ): Promise<FullWeatherResponse> {
    const response = await apiClient.get<ApiResponse<FullWeatherResponse>>('/weather/full', {
      params: { lat, lon, units, city, country },
    });
    return response.data.data;
  },

  /**
   * Fetch current weather conditions only
   */
  async getCurrentWeather(
    lat: number,
    lon: number,
    units: UnitSystem = 'metric'
  ): Promise<CurrentWeather> {
    const response = await apiClient.get<ApiResponse<CurrentWeather>>('/weather/current', {
      params: { lat, lon, units },
    });
    return response.data.data;
  },

  /**
   * Fetch hourly forecast
   */
  async getHourlyForecast(
    lat: number,
    lon: number,
    units: UnitSystem = 'metric'
  ): Promise<HourlyForecastItem[]> {
    const response = await apiClient.get<ApiResponse<HourlyForecastItem[]>>('/weather/hourly', {
      params: { lat, lon, units },
    });
    return response.data.data;
  },

  /**
   * Fetch 7-day daily forecast
   */
  async getDailyForecast(
    lat: number,
    lon: number,
    units: UnitSystem = 'metric'
  ): Promise<DailyForecastItem[]> {
    const response = await apiClient.get<ApiResponse<DailyForecastItem[]>>('/weather/daily', {
      params: { lat, lon, units },
    });
    return response.data.data;
  },

  /**
   * Fetch air quality data
   */
  async getAirQuality(lat: number, lon: number): Promise<AirQualityData> {
    const response = await apiClient.get<ApiResponse<AirQualityData>>('/weather/air-quality', {
      params: { lat, lon },
    });
    return response.data.data;
  },
};
