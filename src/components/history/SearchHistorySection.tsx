import React from 'react';
import { History, Trash2, MapPin, Clock } from 'lucide-react';
import { useSearchHistory } from '../../hooks/useSearchHistory';
import { useWeather } from '../../hooks/useWeather';
import { formatHourTime } from '../../utils/formatters';

export const SearchHistorySection: React.FC = () => {
  const { history, clearHistory } = useSearchHistory();
  const { selectLocation } = useWeather();

  if (history.length === 0) return null;

  return (
    <div className="rounded-3xl bg-slate-900/80 border border-slate-800/80 p-5 md:p-6 backdrop-blur-md shadow-xl flex flex-col gap-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-bold text-white tracking-tight">Recent Search History</h2>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {history.length} / 20
          </span>
        </div>

        <button
          onClick={clearHistory}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-rose-400 bg-slate-800/50 hover:bg-rose-500/10 border border-slate-700/60 hover:border-rose-500/30 rounded-xl transition-all cursor-pointer"
          title="Clear search history"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear History</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {history.map((item, idx) => (
          <button
            key={item.id || item._id || `${item.query}-${idx}`}
            onClick={() =>
              selectLocation({
                name: item.resolvedCity || item.query,
                country: item.country,
                latitude: item.coordinates.latitude,
                longitude: item.coordinates.longitude,
              })
            }
            className="p-3 rounded-2xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/40 hover:border-blue-500/40 transition-all text-left flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="flex items-center gap-1 text-[11px] text-slate-400 group-hover:text-blue-400 transition-colors">
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate">{item.country || 'Location'}</span>
              </div>
              <p className="text-sm font-bold text-white truncate mt-0.5">
                {item.resolvedCity || item.query}
              </p>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-700/40 flex items-center justify-between text-[10px] text-slate-500">
              <span className="font-mono">
                {item.coordinates.latitude.toFixed(1)}°, {item.coordinates.longitude.toFixed(1)}°
              </span>
              {item.searchedAt && (
                <span className="flex items-center gap-1 text-slate-500">
                  <Clock className="w-2.5 h-2.5" />
                  {formatHourTime(item.searchedAt)}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

