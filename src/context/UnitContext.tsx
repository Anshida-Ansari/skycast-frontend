import React, { createContext, useState, useEffect } from 'react';
import type { UnitSystem } from '../types/weather.types';
import { apiClient } from '../api/apiClient';

export interface UnitContextType {
  unitSystem: UnitSystem;
  toggleUnit: () => void;
  setUnit: (unit: UnitSystem) => void;
  tempSymbol: string;
  speedSymbol: string;
  pressureSymbol: string;
}

export const UnitContext = createContext<UnitContextType | undefined>(undefined);

export const UnitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>(() => {
    const saved = localStorage.getItem('skycast_units');
    return saved === 'imperial' ? 'imperial' : 'metric';
  });

  useEffect(() => {
    localStorage.setItem('skycast_units', unitSystem);

    const token = localStorage.getItem('skycast_token');
    if (token) {
      apiClient.put('/preferences', { unitSystem }).catch(() => {
        // Silently ignore background sync failures
      });
    }
  }, [unitSystem]);

  const toggleUnit = () => {
    setUnitSystem((prev) => (prev === 'metric' ? 'imperial' : 'metric'));
  };

  const setUnit = (unit: UnitSystem) => {
    setUnitSystem(unit);
  };

  const value: UnitContextType = {
    unitSystem,
    toggleUnit,
    setUnit,
    tempSymbol: unitSystem === 'metric' ? '°C' : '°F',
    speedSymbol: unitSystem === 'metric' ? 'km/h' : 'mph',
    pressureSymbol: unitSystem === 'metric' ? 'hPa' : 'inHg',
  };

  return <UnitContext.Provider value={value}>{children}</UnitContext.Provider>;
};
