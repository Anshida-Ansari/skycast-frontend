import { apiClient } from './apiClient';
import type {
  ApiResponse,
  UserProfile,
  UserPreference,
  FavoriteLocationItem,
  SearchHistoryItem,
} from '../types/weather.types';

export interface AuthResponseData {
  user: UserProfile;
  token: string;
  preferences: UserPreference;
}

export const authApi = {
  async register(data: { fullName: string; email: string; password: string }): Promise<AuthResponseData> {
    const response = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/register', data);
    return response.data.data;
  },

  async login(data: { email: string; password: string }): Promise<AuthResponseData> {
    const response = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/login', data);
    return response.data.data;
  },

  async getMe(): Promise<{ user: UserProfile; preferences: UserPreference }> {
    const response = await apiClient.get<ApiResponse<{ user: UserProfile; preferences: UserPreference }>>('/auth/me');
    return response.data.data;
  },

  async getPreferences(): Promise<UserPreference> {
    const response = await apiClient.get<ApiResponse<UserPreference>>('/preferences');
    return response.data.data;
  },

  async updatePreferences(data: Partial<UserPreference>): Promise<UserPreference> {
    const response = await apiClient.put<ApiResponse<UserPreference>>('/preferences', data);
    return response.data.data;
  },

  async getFavorites(): Promise<FavoriteLocationItem[]> {
    const response = await apiClient.get<ApiResponse<FavoriteLocationItem[]>>('/favorites');
    return response.data.data;
  },

  async addFavorite(item: Omit<FavoriteLocationItem, 'id' | '_id'>): Promise<FavoriteLocationItem> {
    const response = await apiClient.post<ApiResponse<FavoriteLocationItem>>('/favorites', item);
    return response.data.data;
  },

  async deleteFavorite(id: string): Promise<void> {
    await apiClient.delete(`/favorites/${id}`);
  },

  async syncFavorites(items: Omit<FavoriteLocationItem, 'id' | '_id'>[]): Promise<{ addedCount: number; favorites: FavoriteLocationItem[] }> {
    const response = await apiClient.post<ApiResponse<FavoriteLocationItem[]>>('/favorites/sync', { items });
    return {
      addedCount: (response.data.meta?.addedCount as number) || 0,
      favorites: response.data.data,
    };
  },

  async getHistory(): Promise<SearchHistoryItem[]> {
    const response = await apiClient.get<ApiResponse<SearchHistoryItem[]>>('/history');
    return response.data.data;
  },

  async addHistory(item: Omit<SearchHistoryItem, 'id' | '_id'>): Promise<SearchHistoryItem> {
    const response = await apiClient.post<ApiResponse<SearchHistoryItem>>('/history', item);
    return response.data.data;
  },

  async syncHistory(items: Omit<SearchHistoryItem, 'id' | '_id'>[]): Promise<{ syncedCount: number; history: SearchHistoryItem[] }> {
    const response = await apiClient.post<ApiResponse<SearchHistoryItem[]>>('/history/sync', { items });
    return {
      syncedCount: (response.data.meta?.syncedCount as number) || 0,
      history: response.data.data,
    };
  },

  async clearHistory(): Promise<void> {
    await apiClient.delete('/history');
  },
};

