import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Layers, MapPin, Radio, Crosshair } from 'lucide-react';
import { useWeather } from '../../hooks/useWeather';
import { useUnit } from '../../hooks/useUnit';
import { formatTemperature } from '../../utils/formatters';

// Custom Lucide/Leaflet HTML Marker Icon to avoid broken image asset paths in Vite
const createCustomMarker = (tempStr: string) => {
  return L.divIcon({
    className: 'custom-weather-pin',
    html: `
      <div style="
        display: flex;
        align-items: center;
        gap: 5px;
        background: #0f172a;
        color: #ffffff;
        padding: 5px 12px;
        border-radius: 9999px;
        border: 2px solid #3b82f6;
        box-shadow: 0 10px 20px -3px rgba(0, 0, 0, 0.6);
        font-weight: 700;
        font-size: 11px;
        white-space: nowrap;
        transform: translate(-50%, -100%);
      ">
        <span style="color: #60a5fa; font-size: 12px;">📍</span>
        <span>${tempStr}</span>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    popupAnchor: [0, -28],
  });
};

// Component to dynamically re-center Leaflet map when location coordinates change
const MapRecenter: React.FC<{ lat: number; lon: number }> = ({ lat, lon }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lon], 6, {
      duration: 1.5,
    });
  }, [lat, lon, map]);
  return null;
};

export const WeatherMapSection: React.FC = () => {
  const { weatherData, location } = useWeather();
  const { unitSystem } = useUnit();

  const [showRadar, setShowRadar] = useState<boolean>(true);
  const [radarTileUrl, setRadarTileUrl] = useState<string | null>(null);
  const [radarError, setRadarError] = useState<boolean>(false);
  const mapRef = useRef<L.Map | null>(null);

  // Fetch latest genuine live radar path from RainViewer API
  useEffect(() => {
    const fetchRadarTime = async () => {
      try {
        const response = await fetch('https://api.rainviewer.com/public/weather-maps.json');
        if (response.ok) {
          const data = await response.json();
          const host = data.host || 'https://tilecache.rainviewer.com';
          if (data.radar?.past && data.radar.past.length > 0) {
            const latest = data.radar.past[data.radar.past.length - 1];
            // Format: {host}{path}/256/{z}/{x}/{y}/2/1_1.png
            const urlTemplate = `${host}${latest.path}/256/{z}/{x}/{y}/2/1_1.png`;
            setRadarTileUrl(urlTemplate);
          }
        }
      } catch {
        setRadarError(true);
      }
    };

    fetchRadarTime();
  }, []);

  if (!weatherData) return null;

  const lat = weatherData.location.latitude;
  const lon = weatherData.location.longitude;
  const tempStr = formatTemperature(weatherData.current.temperature, unitSystem);
  const cityName = weatherData.location.city || location.name;
  const countryName = weatherData.location.country || location.country;

  const handleRecenter = () => {
    if (mapRef.current) {
      mapRef.current.flyTo([lat, lon], 6, { duration: 1.2 });
    }
  };

  return (
    <div className="rounded-3xl bg-slate-900/80 border border-slate-800/80 p-5 md:p-6 backdrop-blur-md shadow-xl flex flex-col gap-4">
      {/* Header and Map Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-bold text-white tracking-tight">Interactive Weather Map</h2>
        </div>

        {/* Map Control Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleRecenter}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Re-center map on selected city"
          >
            <Crosshair className="w-3.5 h-3.5 text-blue-400" />
            <span>Center City</span>
          </button>

          <button
            onClick={() => setShowRadar(!showRadar)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
              showRadar
                ? 'bg-blue-600/30 border-blue-500/50 text-blue-300 shadow-sm'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Live RainViewer Precipitation Radar Overlay"
          >
            <Radio className={`w-3.5 h-3.5 ${showRadar ? 'text-blue-400 animate-pulse' : ''}`} />
            <span>Live Radar</span>
          </button>
        </div>
      </div>

      {/* Map Container - Full Interactive Zooming enabled */}
      <div className="relative w-full h-80 md:h-96 rounded-2xl overflow-hidden border border-slate-800 shadow-inner z-0">
        <MapContainer
          center={[lat, lon]}
          zoom={6}
          minZoom={2}
          maxZoom={18}
          scrollWheelZoom={true}
          ref={mapRef}
          className="w-full h-full"
        >
          {/* Base OpenStreetMap Tiles */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />

          {/* RainViewer Live Radar Tile Overlay with maxNativeZoom: 7 to prevent 'Zoom Level Not Supported' */}
          {showRadar && radarTileUrl && !radarError && (
            <TileLayer
              attribution='Radar &copy; <a href="https://www.rainviewer.com">RainViewer</a>'
              url={radarTileUrl}
              opacity={0.65}
              zIndex={500}
              maxNativeZoom={7}
              maxZoom={18}
              minZoom={2}
            />
          )}

          {/* Auto center observer */}
          <MapRecenter lat={lat} lon={lon} />

          {/* Location Marker */}
          <Marker position={[lat, lon]} icon={createCustomMarker(tempStr)}>
            <Popup className="skycast-popup">
              <div className="p-1 text-slate-900 font-sans">
                <p className="font-bold text-sm leading-tight text-slate-900">{cityName}</p>
                {countryName && (
                  <p className="text-xs text-slate-600 mt-0.5">{countryName}</p>
                )}
                <div className="mt-1.5 pt-1.5 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="font-semibold text-blue-700">{tempStr}</span>
                  <span className="text-slate-600">{weatherData.current.condition.description}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        </MapContainer>

        {/* Legend pill in bottom left */}
        <div className="absolute bottom-3 left-3 z-[1000] bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] text-slate-300 flex items-center gap-2 pointer-events-none shadow-lg">
          <Layers className="w-3.5 h-3.5 text-blue-400" />
          <span>
            {showRadar && radarTileUrl
              ? 'RainViewer Live Radar (Zoom Scaled)'
              : 'OpenStreetMap Base Layer'}
          </span>
        </div>
      </div>
    </div>
  );
};
