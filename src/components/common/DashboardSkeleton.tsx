import React from 'react';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Hero Skeleton */}
      <div className="rounded-3xl bg-slate-900/60 border border-slate-800/80 p-8 h-80 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-slate-800 rounded-xl" />
          <div className="h-6 w-28 bg-slate-800 rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="h-20 w-44 bg-slate-800 rounded-2xl" />
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-20 bg-slate-800/70 rounded-xl" />
            ))}
          </div>
        </div>
      </div>

      {/* Hourly Forecast Skeleton */}
      <div className="rounded-3xl bg-slate-900/60 border border-slate-800/80 p-6">
        <div className="h-6 w-36 bg-slate-800 rounded-lg mb-4" />
        <div className="flex gap-3 overflow-hidden">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="min-w-[5.25rem] h-32 bg-slate-800/60 rounded-2xl shrink-0" />
          ))}
        </div>
      </div>

      {/* 2-column Grid: 7-Day & Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 p-6 h-96">
          <div className="h-6 w-32 bg-slate-800 rounded-lg mb-4" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="h-10 bg-slate-800/40 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="lg:col-span-7 rounded-3xl bg-slate-900/60 border border-slate-800/80 p-6 h-96">
          <div className="h-6 w-48 bg-slate-800 rounded-lg mb-4" />
          <div className="h-72 bg-slate-800/30 rounded-2xl" />
        </div>
      </div>
    </div>
  );
};

