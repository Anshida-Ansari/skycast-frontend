import React, { useState } from 'react';
import { CloudSun, RotateCw, User, LogOut, CheckCircle } from 'lucide-react';
import { CitySearchBar } from '../search/CitySearchBar';
import { useUnit } from '../../hooks/useUnit';
import { useWeather } from '../../hooks/useWeather';
import { useAuth } from '../../hooks/useAuth';
import { AuthModal } from '../auth/AuthModal';

export const Navbar: React.FC = () => {
  const { unitSystem, toggleUnit } = useUnit();
  const { refreshWeather, loading } = useWeather();
  const { user, isAuthenticated, logout } = useAuth();

  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center gap-2.5 cursor-pointer select-none">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <CloudSun className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                    SkyCast
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Live
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                  Atmospheric Intelligence
                </p>
              </div>
            </div>

            {/* Mobile Right Controls */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={toggleUnit}
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-slate-200 border border-slate-700/80 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                {unitSystem === 'metric' ? '°C' : '°F'}
              </button>

              {isAuthenticated ? (
                <button
                  onClick={logout}
                  className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600/30 text-blue-300 border border-blue-500/40 hover:bg-blue-600/50 transition-colors cursor-pointer"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>

          {/* Center Search Bar */}
          <div className="w-full md:max-w-md lg:max-w-lg">
            <CitySearchBar />
          </div>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* Unit Toggle Pill */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 shadow-inner">
              <button
                onClick={() => unitSystem !== 'metric' && toggleUnit()}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  unitSystem === 'metric'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                °C
              </button>
              <button
                onClick={() => unitSystem !== 'imperial' && toggleUnit()}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  unitSystem === 'imperial'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                °F
              </button>
            </div>

            {/* Refresh Action */}
            <button
              onClick={refreshWeather}
              disabled={loading}
              className="p-2 text-slate-400 hover:text-slate-100 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              title="Refresh weather data"
            >
              <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-400' : ''}`} />
            </button>

            {/* Account / Guest Button */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <div className="flex items-center gap-2 py-1 px-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                  <div className="w-6 h-6 rounded-lg bg-blue-600/30 text-blue-400 border border-blue-500/40 flex items-center justify-center font-bold text-[11px]">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold text-slate-200 max-w-[100px] truncate">
                    {user.fullName}
                  </span>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-rose-400 bg-slate-900 border border-slate-800 rounded-xl hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Sign out of account"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
};
