import React from 'react';
import { Wind, Info, Sparkles } from 'lucide-react';
import { useWeather } from '../../hooks/useWeather';

export const AirQualitySection: React.FC = () => {
  const { weatherData } = useWeather();

  if (!weatherData || !weatherData.airQuality) return null;

  const aqi = weatherData.airQuality;

  // Category visual mapping based strictly on US EPA Air Quality Index (US AQI)
  const getCategoryConfig = (cat: string, val: number) => {
    if (val <= 50 || cat === 'Good') {
      return {
        label: 'Good',
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-500/15',
        borderColor: 'border-emerald-500/30',
        barColor: 'bg-emerald-400',
        advice: 'Air quality is satisfactory and poses little or no risk to public health.',
      };
    }
    if (val <= 100 || cat === 'Moderate') {
      return {
        label: 'Moderate',
        color: 'text-amber-400',
        bgColor: 'bg-amber-500/15',
        borderColor: 'border-amber-500/30',
        barColor: 'bg-amber-400',
        advice: 'Air quality is acceptable; sensitive individuals may experience minor symptoms.',
      };
    }
    if (val <= 150 || cat === 'Unhealthy for Sensitive Groups') {
      return {
        label: 'Unhealthy for Sensitive Groups',
        color: 'text-orange-400',
        bgColor: 'bg-orange-500/15',
        borderColor: 'border-orange-500/30',
        barColor: 'bg-orange-400',
        advice: 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.',
      };
    }
    if (val <= 200 || cat === 'Unhealthy') {
      return {
        label: 'Unhealthy',
        color: 'text-rose-400',
        bgColor: 'bg-rose-500/15',
        borderColor: 'border-rose-500/30',
        barColor: 'bg-rose-500',
        advice: 'Some members of the general public may experience health effects; members of sensitive groups may experience more serious effects.',
      };
    }
    if (val <= 300 || cat === 'Very Unhealthy') {
      return {
        label: 'Very Unhealthy',
        color: 'text-purple-400',
        bgColor: 'bg-purple-500/15',
        borderColor: 'border-purple-500/30',
        barColor: 'bg-purple-500',
        advice: 'Health alert: The risk of health effects is increased for everyone. Limit outdoor physical exertion.',
      };
    }
    return {
      label: 'Hazardous',
      color: 'text-red-500',
      bgColor: 'bg-red-500/15',
      borderColor: 'border-red-500/30',
      barColor: 'bg-red-600',
      advice: 'Health warning of emergency conditions: Everyone is more likely to be affected with serious respiratory discomfort.',
    };
  };

  const config = getCategoryConfig(aqi.aqiCategory, aqi.aqi);

  // Pollutant specifications with EPA guideline reference values
  const pollutants = [
    {
      code: 'PM2.5',
      name: 'Fine Particles',
      value: aqi.pm2_5,
      unit: 'µg/m³',
      status: aqi.pm2_5 <= 12 ? 'Healthy' : aqi.pm2_5 <= 35.4 ? 'Moderate' : 'High',
      desc: 'Particles ≤ 2.5 µm that penetrate deep into lungs',
    },
    {
      code: 'PM10',
      name: 'Inhalable Particles',
      value: aqi.pm10,
      unit: 'µg/m³',
      status: aqi.pm10 <= 54 ? 'Healthy' : aqi.pm10 <= 154 ? 'Moderate' : 'High',
      desc: 'Dust, pollen and mold particles ≤ 10 µm',
    },
    {
      code: 'NO₂',
      name: 'Nitrogen Dioxide',
      value: aqi.nitrogenDioxide,
      unit: 'µg/m³',
      status: aqi.nitrogenDioxide <= 53 ? 'Healthy' : 'Elevated',
      desc: 'Emitted from vehicle combustion and industrial sources',
    },
    {
      code: 'O₃',
      name: 'Ozone',
      value: aqi.ozone,
      unit: 'µg/m³',
      status: aqi.ozone <= 70 ? 'Healthy' : 'Elevated',
      desc: 'Ground-level photochemical smog component',
    },
    {
      code: 'SO₂',
      name: 'Sulphur Dioxide',
      value: aqi.sulphurDioxide,
      unit: 'µg/m³',
      status: aqi.sulphurDioxide <= 35 ? 'Healthy' : 'Elevated',
      desc: 'Fossil fuel combustion by-product',
    },
    {
      code: 'CO',
      name: 'Carbon Monoxide',
      value: aqi.carbonMonoxide,
      unit: 'µg/m³',
      status: aqi.carbonMonoxide <= 4400 ? 'Healthy' : 'Elevated',
      desc: 'Colorless, odorless gas from incomplete combustion',
    },
  ];

  return (
    <div className="rounded-3xl bg-slate-900/80 border border-slate-800/80 p-5 md:p-6 backdrop-blur-md shadow-xl flex flex-col gap-6">
      {/* Header with Standard Notification */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <Wind className="w-5 h-5 text-teal-400" />
          <h2 className="text-lg font-bold text-white tracking-tight">Air Quality & Atmosphere</h2>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 bg-slate-800/60 border border-slate-700/60 px-3 py-1 rounded-full self-start sm:self-auto">
          <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span>Standard: US EPA Air Quality Index (US AQI)</span>
        </div>
      </div>

      {/* Main AQI Score & Health Advice Banner */}
      <div className={`p-5 rounded-2xl border ${config.bgColor} ${config.borderColor} flex flex-col md:flex-row items-center justify-between gap-6`}>
        <div className="flex items-center gap-5">
          <div className="flex flex-col items-center justify-center w-24 h-24 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-inner">
            <span className="text-3xl font-black text-white">{aqi.aqi}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">US AQI</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className={`text-lg font-bold ${config.color}`}>
                {config.label}
              </span>
              <Sparkles className={`w-4 h-4 ${config.color}`} />
            </div>
            <p className="text-xs text-slate-300 max-w-lg mt-1 leading-relaxed">
              {config.advice}
            </p>
          </div>
        </div>

        {/* Visual Progress Gauge */}
        <div className="w-full md:w-56 shrink-0 flex flex-col gap-1.5">
          <div className="flex justify-between text-[11px] font-semibold text-slate-400">
            <span>0</span>
            <span>Index Spectrum</span>
            <span>300+</span>
          </div>
          <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className={`h-full rounded-full ${config.barColor} transition-all duration-700`}
              style={{ width: `${Math.min(100, Math.max(5, (aqi.aqi / 300) * 100))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Granular Pollutant Breakdown Grid */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Key Atmospheric Pollutants
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {pollutants.map((p) => (
            <div
              key={p.code}
              className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:border-slate-600/70 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">{p.code}</span>
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                      p.status === 'Healthy'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">{p.name}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-700/40">
                <p className="text-sm font-bold text-white">
                  {p.value !== undefined && p.value !== null ? p.value.toFixed(1) : '--'}
                  <span className="text-[10px] font-normal text-slate-400 ml-1">{p.unit}</span>
                </p>
                <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5" title={p.desc}>
                  {p.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-slate-500 mt-3 italic">
          * Note: Individual pollutant concentrations are measured in physical mass (µg/m³), whereas the composite AQI is a unitless index calculated according to United States EPA standard breakpoints.
        </p>
      </div>
    </div>
  );
};
