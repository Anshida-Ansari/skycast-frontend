import { useContext } from 'react';
import { UnitContext, type UnitContextType } from '../context/UnitContext';

export const useUnit = (): UnitContextType => {
  const context = useContext(UnitContext);
  if (!context) {
    throw new Error('useUnit must be used within a UnitProvider');
  }
  return context;
};

