import React from 'react';
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  Snowflake,
  CloudLightning,
  CloudHail,
} from 'lucide-react';

interface WeatherIconProps {
  iconName?: string;
  isDay?: boolean;
  className?: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  iconName = 'cloud',
  isDay = true,
  className = 'w-6 h-6',
  size,
}) => {
  const iconProps = { className, size };

  switch (iconName) {
    case 'sun':
      return <Sun {...iconProps} className={`${className} text-amber-400`} />;
    case 'moon':
      return <Moon {...iconProps} className={`${className} text-indigo-200`} />;
    case 'cloud-sun':
    case 'sun-cloud':
      return isDay ? (
        <CloudSun {...iconProps} className={`${className} text-amber-300`} />
      ) : (
        <CloudMoon {...iconProps} className={`${className} text-indigo-300`} />
      );
    case 'cloud-moon':
    case 'moon-cloud':
      return <CloudMoon {...iconProps} className={`${className} text-indigo-300`} />;
    case 'cloud':
      return <Cloud {...iconProps} className={`${className} text-slate-300`} />;
    case 'cloud-fog':
      return <CloudFog {...iconProps} className={`${className} text-slate-400`} />;
    case 'cloud-drizzle':
      return <CloudDrizzle {...iconProps} className={`${className} text-sky-300`} />;
    case 'cloud-rain':
    case 'cloud-sun-rain':
    case 'cloud-moon-rain':
      return <CloudRain {...iconProps} className={`${className} text-blue-400`} />;
    case 'cloud-rain-wind':
      return <CloudRainWind {...iconProps} className={`${className} text-blue-500`} />;
    case 'cloud-snow':
      return <CloudSnow {...iconProps} className={`${className} text-sky-100`} />;
    case 'snowflake':
      return <Snowflake {...iconProps} className={`${className} text-cyan-200`} />;
    case 'cloud-lightning':
      return <CloudLightning {...iconProps} className={`${className} text-amber-400`} />;
    case 'cloud-hail':
      return <CloudHail {...iconProps} className={`${className} text-cyan-300`} />;
    default:
      return <Cloud {...iconProps} className={`${className} text-slate-300`} />;
  }
};

