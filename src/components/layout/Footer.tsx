import React from 'react';
import { CloudSun, ExternalLink, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-800/80 bg-slate-950/40 text-slate-400 text-xs py-8 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <CloudSun className="w-4 h-4 text-blue-400" />
          <span className="font-semibold text-slate-300">SkyCast Weather Platform</span>
          <span>•</span>
          <span>Phase 4 Dashboard</span>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Guest Access Enabled
          </span>
          <span>•</span>
          <a
            href="https://open-meteo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-blue-400 transition-colors"
          >
            Powered by Open-Meteo
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </footer>
  );
};

