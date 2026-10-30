import axios from 'axios';

// Safely normalize API Base URL to avoid duplicate or missing '/api/v1'
const normalizeApiBaseUrl = (rawUrl?: string): string => {
  if (!rawUrl || !rawUrl.trim()) {
    return '/api/v1';
  }
  const cleanUrl = rawUrl.trim().replace(/\/+$/, '');
  if (cleanUrl.endsWith('/api/v1')) {
    return cleanUrl;
  }
  return `${cleanUrl}/api/v1`;
};

const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_URL);

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject optional auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('skycast_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor for standardized response error unpacking
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const customMessage =
      error.response?.data?.error?.message ||
      error.message ||
      'An unexpected network error occurred';
    return Promise.reject(new Error(customMessage));
  }
);

