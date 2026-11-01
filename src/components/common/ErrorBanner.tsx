import React, { useState } from 'react';
import { AlertCircle, RotateCw } from 'lucide-react';

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onRetry }) => {
  const [retrying, setRetrying] = useState<boolean>(false);

  const handleRetry = () => {
    if (retrying || !onRetry) return;
    setRetrying(true);
    onRetry();
    setTimeout(() => setRetrying(false), 2000);
  };

  const isTimeoutOrNetwork =
    message.toLowerCase().includes('timeout') ||
    message.toLowerCase().includes('network') ||
    message.toLowerCase().includes('failed to fetch');

  return (
    <div className="rounded-3xl bg-rose-950/40 border border-rose-800/60 p-6 sm:p-8 text-center flex flex-col items-center justify-center gap-3 backdrop-blur-md shadow-2xl">
      <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
        <AlertCircle className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-base font-bold text-white">Weather Data Unavailable</h3>
        <p className="text-sm text-slate-300 max-w-md mt-1">{message}</p>
        {isTimeoutOrNetwork && (
          <p className="text-xs text-amber-300/80 max-w-md mt-2">
            💡 The free hosting server may be waking up from sleep. Please wait a moment and try again.
          </p>
        )}
      </div>
      {onRetry && (
        <button
          onClick={handleRetry}
          disabled={retrying}
          className="mt-2 flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-500 disabled:bg-rose-800 disabled:opacity-75 text-white rounded-xl text-xs font-semibold shadow-md transition-all cursor-pointer"
        >
          <RotateCw className={`w-3.5 h-3.5 ${retrying ? 'animate-spin' : ''}`} />
          <span>{retrying ? 'Reconnecting...' : 'Try Again'}</span>
        </button>
      )}
    </div>
  );
};

