import { useState, useEffect, useCallback } from 'react';
import type { FavoriteLocationItem } from '../types/weather.types';
import { useAuth } from './useAuth';
import { authApi } from '../api/authApi';

export function useFavorites() {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteLocationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadFavorites = useCallback(async () => {
    setLoading(true);
    if (isAuthenticated) {
      try {
        const cloudFavs = await authApi.getFavorites();
        setFavorites(cloudFavs);
      } catch {
        // Fallback to local
        const local = localStorage.getItem('skycast_guest_favorites');
        setFavorites(local ? JSON.parse(local) : []);
      }
    } else {
      const local = localStorage.getItem('skycast_guest_favorites');
      setFavorites(local ? JSON.parse(local) : []);
    }
    setLoading(false);
  }, [isAuthenticated]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const isFavorite = useCallback(
    (lat: number, lon: number): boolean => {
      return favorites.some(
        (f) =>
          Math.abs(f.coordinates.latitude - lat) < 0.02 &&
          Math.abs(f.coordinates.longitude - lon) < 0.02
      );
    },
    [favorites]
  );

  const addFavorite = async (
    item: Omit<FavoriteLocationItem, 'id' | '_id'>
  ): Promise<boolean> => {
    if (isFavorite(item.coordinates.latitude, item.coordinates.longitude)) {
      return false; // Already a favorite
    }

    if (isAuthenticated) {
      try {
        const saved = await authApi.addFavorite(item);
        setFavorites((prev) => [saved, ...prev]);
        return true;
      } catch {
        return false;
      }
    } else {
      const newItem: FavoriteLocationItem = {
        ...item,
        id: `guest_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      const updated = [newItem, ...favorites];
      setFavorites(updated);
      localStorage.setItem('skycast_guest_favorites', JSON.stringify(updated));
      return true;
    }
  };

  const removeFavorite = async (lat: number, lon: number, id?: string): Promise<void> => {
    const target = favorites.find(
      (f) =>
        (id && (f.id === id || f._id === id)) ||
        (Math.abs(f.coordinates.latitude - lat) < 0.02 &&
          Math.abs(f.coordinates.longitude - lon) < 0.02)
    );

    if (!target) return;

    if (isAuthenticated && (target.id || target._id)) {
      try {
        await authApi.deleteFavorite((target.id || target._id)!);
        setFavorites((prev) =>
          prev.filter((f) => f.id !== target.id && f._id !== target._id)
        );
      } catch {
        // Ignore deletion failure
      }
    } else {
      const updated = favorites.filter(
        (f) =>
          Math.abs(f.coordinates.latitude - lat) >= 0.02 ||
          Math.abs(f.coordinates.longitude - lon) >= 0.02
      );
      setFavorites(updated);
      localStorage.setItem('skycast_guest_favorites', JSON.stringify(updated));
    }
  };

  return {
    favorites,
    loading,
    isFavorite,
    addFavorite,
    removeFavorite,
    refreshFavorites: loadFavorites,
  };
}

