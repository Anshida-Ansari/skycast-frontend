import React from 'react';
import { Star, MapPin, Trash2, Plus } from 'lucide-react';
import { useFavorites } from '../../hooks/useFavorites';
import { useWeather } from '../../hooks/useWeather';
import { useAuth } from '../../hooks/useAuth';

export const FavoritesBar: React.FC = () => {
  const { favorites, isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { location, selectLocation, weatherData } = useWeather();
  const { isAuthenticated } = useAuth();

  const isCurrentFav = isFavorite(location.latitude, location.longitude);

  const handleToggleCurrent = () => {
    if (isCurrentFav) {
      removeFavorite(location.latitude, location.longitude);
    } else {
      addFavorite({
        cityName: weatherData?.location.city || location.name,
        country: weatherData?.location.country || location.country,
        region: location.region,
        coordinates: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
      });
    }
  };

  return (
    <div className="rounded-3xl bg-slate-900/80 border border-slate-800/80 p-5 md:p-6 backdrop-blur-md shadow-xl flex flex-col gap-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          <h2 className="text-lg font-bold text-white tracking-tight">Saved Favorites</h2>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {favorites.length}
          </span>
        </div>

        {/* Quick Add/Remove Active Location Button */}
        <button
          onClick={handleToggleCurrent}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
            isCurrentFav
              ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
              : 'bg-blue-600/20 border-blue-500/40 text-blue-300 hover:bg-blue-600/30'
          }`}
        >
          {isCurrentFav ? (
            <>
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>Saved in Favorites</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>Add Current City</span>
            </>
          )}
        </button>
      </div>

      {/* Favorites List / Horizontal Cards */}
      {favorites.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {favorites.map((fav) => {
            const isSelected =
              Math.abs(fav.coordinates.latitude - location.latitude) < 0.02 &&
              Math.abs(fav.coordinates.longitude - location.longitude) < 0.02;

            return (
              <div
                key={fav.id || fav._id || `${fav.cityName}-${fav.coordinates.latitude}`}
                className={`relative group p-3 rounded-2xl border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-600/20 border-blue-500/50 shadow-md'
                    : 'bg-slate-800/40 border-slate-700/40 hover:bg-slate-800/70 hover:border-slate-600/60'
                }`}
              >
                <div
                  onClick={() =>
                    selectLocation({
                      name: fav.cityName,
                      country: fav.country,
                      region: fav.region,
                      latitude: fav.coordinates.latitude,
                      longitude: fav.coordinates.longitude,
                    })
                  }
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
                    <MapPin className="w-3 h-3 text-blue-400 shrink-0" />
                    <span className="truncate">{fav.country}</span>
                  </div>
                  <p className="text-sm font-bold text-white truncate">{fav.cityName}</p>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-700/40 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500">
                    {fav.coordinates.latitude.toFixed(1)}°, {fav.coordinates.longitude.toFixed(1)}°
                  </span>

                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFavorite(fav.coordinates.latitude, fav.coordinates.longitude, fav.id || fav._id);
                    }}
                    className="p-1 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="Remove from favorites"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-6 px-4 text-center rounded-2xl bg-slate-800/20 border border-dashed border-slate-800 text-xs text-slate-400">
          No saved locations yet. Click <span className="text-blue-400 font-semibold">"Add Current City"</span> or save any searched city to access it with one click.
          {!isAuthenticated && (
            <p className="text-[11px] text-slate-500 mt-1">
              Guest favorites are saved in your local browser profile. Sign in to synchronize them to the cloud.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

