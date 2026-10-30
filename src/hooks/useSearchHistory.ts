import { useState, useEffect, useCallback } from 'react';
import type { SearchHistoryItem } from '../types/weather.types';
import { useAuth } from './useAuth';
import { authApi } from '../api/authApi';

const MAX_HISTORY = 20;

export function useSearchHistory() {
  const { isAuthenticated } = useAuth();
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    if (isAuthenticated) {
      try {
        const cloudHistory = await authApi.getHistory();
        setHistory(cloudHistory);
      } catch {
        const local = localStorage.getItem('skycast_recent_searches');
        setHistory(local ? JSON.parse(local) : []);
      }
    } else {
      const local = localStorage.getItem('skycast_recent_searches');
      setHistory(local ? JSON.parse(local) : []);
    }
    setLoading(false);
  }, [isAuthenticated]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const addHistory = async (
    item: Omit<SearchHistoryItem, 'id' | '_id' | 'searchedAt'>
  ): Promise<void> => {
    if (isAuthenticated) {
      try {
        const record = await authApi.addHistory(item);
        setHistory((prev) => {
          const filtered = prev.filter(
            (h) => h.query.toLowerCase() !== item.query.toLowerCase()
          );
          return [record, ...filtered].slice(0, MAX_HISTORY);
        });
      } catch {
        // Fallback
      }
    } else {
      const newItem: SearchHistoryItem = {
        ...item,
        id: `local_${Date.now()}`,
        searchedAt: new Date().toISOString(),
      };
      setHistory((prev) => {
        const filtered = prev.filter(
          (h) => h.query.toLowerCase() !== item.query.toLowerCase()
        );
        const updated = [newItem, ...filtered].slice(0, MAX_HISTORY);
        localStorage.setItem('skycast_recent_searches', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const clearHistory = async (): Promise<void> => {
    if (isAuthenticated) {
      try {
        await authApi.clearHistory();
      } catch {
        // Ignore
      }
    }
    localStorage.removeItem('skycast_recent_searches');
    setHistory([]);
  };

  return {
    history,
    loading,
    addHistory,
    clearHistory,
    refreshHistory: loadHistory,
  };
}

