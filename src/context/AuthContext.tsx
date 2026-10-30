import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { UserProfile, UserPreference, FavoriteLocationItem } from '../types/weather.types';
import { authApi } from '../api/authApi';

export interface AuthContextType {
  user: UserProfile | null;
  preferences: UserPreference | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  syncGuestData: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('skycast_token'));
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('skycast_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [preferences, setPreferences] = useState<UserPreference | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Synchronize guest favorites and search history with MongoDB account
  const syncGuestData = useCallback(async () => {
    try {
      // 1. Sync guest favorites
      const guestFavsRaw = localStorage.getItem('skycast_guest_favorites');
      if (guestFavsRaw) {
        const guestFavs: FavoriteLocationItem[] = JSON.parse(guestFavsRaw);
        if (guestFavs.length > 0) {
          await authApi.syncFavorites(
            guestFavs.map((f) => ({
              cityName: f.cityName,
              country: f.country,
              region: f.region,
              coordinates: f.coordinates,
              customLabel: f.customLabel,
            }))
          );
          // Safe removal after confirmed server sync
          localStorage.removeItem('skycast_guest_favorites');
        }
      }

      // 2. Sync guest search history
      const guestHistoryRaw = localStorage.getItem('skycast_recent_searches');
      if (guestHistoryRaw) {
        const guestHistory: any[] = JSON.parse(guestHistoryRaw);
        if (guestHistory.length > 0) {
          await authApi.syncHistory(
            guestHistory.map((h) => ({
              query: h.name || h.query || 'Search',
              resolvedCity: h.name || h.resolvedCity || 'City',
              country: h.country || '',
              coordinates: {
                latitude: h.latitude,
                longitude: h.longitude,
              },
            }))
          );
        }
      }
    } catch {
      // If sync encounters network latency or error, keep local data safe
    }
  }, []);

  // Validate session on mount
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('skycast_token');
      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {
        const data = await authApi.getMe();
        setUser(data.user);
        setPreferences(data.preferences);
        localStorage.setItem('skycast_user', JSON.stringify(data.user));
      } catch {
        // Token invalid or expired - gracefully fall back to guest mode
        localStorage.removeItem('skycast_token');
        localStorage.removeItem('skycast_user');
        setToken(null);
        setUser(null);
        setPreferences(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const result = await authApi.login({ email, password });
    localStorage.setItem('skycast_token', result.token);
    localStorage.setItem('skycast_user', JSON.stringify(result.user));
    setToken(result.token);
    setUser(result.user);
    setPreferences(result.preferences);

    // Sync guest favorites & history
    await syncGuestData();
  };

  const register = async (fullName: string, email: string, password: string) => {
    const result = await authApi.register({ fullName, email, password });
    localStorage.setItem('skycast_token', result.token);
    localStorage.setItem('skycast_user', JSON.stringify(result.user));
    setToken(result.token);
    setUser(result.user);
    setPreferences(result.preferences);

    // Sync guest favorites & history
    await syncGuestData();
  };

  const logout = () => {
    localStorage.removeItem('skycast_token');
    localStorage.removeItem('skycast_user');
    setToken(null);
    setUser(null);
    setPreferences(null);
  };

  const value: AuthContextType = {
    user,
    preferences,
    token,
    isAuthenticated: !!user && !!token,
    loading,
    login,
    register,
    logout,
    syncGuestData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
