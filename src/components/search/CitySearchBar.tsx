import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, X, Compass } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import { useGeolocation } from '../../hooks/useGeolocation';
import { weatherApi } from '../../api/weatherApi';
import type { GeocodingLocation } from '../../types/weather.types';
import { useWeather } from '../../hooks/useWeather';
import type { LocationInfo } from '../../context/WeatherContext';

export const CitySearchBar: React.FC = () => {
  const { selectLocation } = useWeather();
  const { loading: geoLoading, requestLocation, error: geoError } = useGeolocation();

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeocodingLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const debouncedQuery = useDebounce(query, 350);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedQuery.trim().length < 2) {
        setSuggestions([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const results = await weatherApi.searchCities(debouncedQuery);
        setSuggestions(results);
        setIsOpen(true);
      } catch {
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item: GeocodingLocation) => {
    const loc: LocationInfo = {
      name: item.name,
      country: item.country,
      region: item.admin1,
      latitude: item.latitude,
      longitude: item.longitude,
    };
    selectLocation(loc);
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
  };

  const handleUseCurrentLocation = async () => {
    setFeedbackMsg(null);
    const coords = await requestLocation();
    if (coords) {
      selectLocation({
        name: 'Current Location',
        country: '',
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
      setFeedbackMsg('Coordinates resolved from device GPS');
      setTimeout(() => setFeedbackMsg(null), 3000);
    }
  };

  return (
    <div className="relative w-full max-w-xl" ref={containerRef}>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => {
              if (suggestions.length > 0) setIsOpen(true);
            }}
            placeholder="Search city, state or country..."
            className="w-full pl-10 pr-9 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-400 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setSuggestions([]);
                setIsOpen(false);
              }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          onClick={handleUseCurrentLocation}
          disabled={geoLoading}
          className="flex items-center gap-1.5 px-3 py-2.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 hover:text-blue-300 rounded-xl text-xs font-medium transition-colors shadow-sm disabled:opacity-50"
          title="Detect weather using your current device GPS"
        >
          {geoLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Compass className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">Detect GPS</span>
        </button>
      </div>

      {geoError && (
        <div className="absolute top-full mt-1.5 left-0 right-0 text-xs text-amber-400 bg-amber-950/80 border border-amber-800/60 rounded-lg p-2 z-50">
          {geoError}
        </div>
      )}

      {feedbackMsg && (
        <div className="absolute top-full mt-1.5 left-0 right-0 text-xs text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 rounded-lg p-2 z-50">
          {feedbackMsg}
        </div>
      )}

      {isOpen && query.trim().length >= 2 && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-800">
          {suggestions.length > 0 ? (
            <div className="max-h-64 overflow-y-auto scrollbar-thin">
              {suggestions.map((item) => (
                <button
                  key={`${item.id}-${item.latitude}-${item.longitude}`}
                  onClick={() => handleSelect(item)}
                  className="w-full px-4 py-3 text-left hover:bg-slate-800/60 transition-colors flex items-center gap-3 group"
                >
                  <MapPin className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate group-hover:text-white">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {[item.admin1, item.country].filter(Boolean).join(', ')}
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 shrink-0">
                    {item.latitude.toFixed(1)}°, {item.longitude.toFixed(1)}°
                  </span>
                </button>
              ))}
            </div>
          ) : !isSearching ? (
            <div className="px-4 py-6 text-center text-sm text-slate-400">
              No matching locations found for "{query}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
