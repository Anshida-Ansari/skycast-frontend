export type UnitSystem = 'metric' | 'imperial';

export interface WeatherCondition {
  code: number;
  description: string;
  icon: string;
  isDay: boolean;
}

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  windGusts?: number;
  pressure: number;
  uvIndex: number;
  visibility: number;
  cloudCover: number;
  precipitation: number;
  condition: WeatherCondition;
  sunrise: string;
  sunset: string;
  timestamp: string;
}

export interface HourlyForecastItem {
  time: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  precipitationProbability: number;
  precipitation: number;
  windSpeed: number;
  condition: WeatherCondition;
  uvIndex: number;
}

export interface DailyForecastItem {
  date: string;
  maxTemperature: number;
  minTemperature: number;
  apparentMaxTemp: number;
  apparentMinTemp: number;
  precipitationSum: number;
  precipitationProbabilityMax: number;
  windSpeedMax: number;
  condition: WeatherCondition;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
}

export interface AirQualityData {
  aqi: number;
  aqiCategory:
    | 'Good'
    | 'Moderate'
    | 'Unhealthy for Sensitive Groups'
    | 'Unhealthy'
    | 'Very Unhealthy'
    | 'Hazardous';
  pm2_5: number;
  pm10: number;
  nitrogenDioxide: number;
  ozone: number;
  sulphurDioxide: number;
  carbonMonoxide: number;
  updatedAt: string;
}

export interface WeatherAlert {
  id: string;
  event: string;
  headline: string;
  description: string;
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  effective: string;
  expires: string;
}

export interface GeocodingLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  countryCode: string;
  admin1?: string;
  admin2?: string;
  timezone?: string;
  elevation?: number;
}

export interface FullWeatherResponse {
  location: {
    latitude: number;
    longitude: number;
    timezone: string;
    city?: string;
    country?: string;
  };
  units: UnitSystem;
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  airQuality?: AirQualityData;
  alerts: WeatherAlert[];
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserPreference {
  id?: string;
  userId?: string;
  unitSystem: UnitSystem;
  defaultCity?: string;
  defaultCoordinates?: {
    latitude: number;
    longitude: number;
  };
  enableAlerts: boolean;
}

export interface FavoriteLocationItem {
  id?: string;
  _id?: string;
  cityName: string;
  country: string;
  region?: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  customLabel?: string;
  createdAt?: string;
}

export interface SearchHistoryItem {
  id?: string;
  _id?: string;
  query: string;
  resolvedCity: string;
  country: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  searchedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    timestamp: string;
    cached?: boolean;
    count?: number;
    [key: string]: unknown;
  };
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

