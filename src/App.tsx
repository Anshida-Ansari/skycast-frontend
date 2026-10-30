import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { UnitProvider } from './context/UnitContext';
import { WeatherProvider } from './context/WeatherContext';
import { Navbar } from './components/layout/Navbar';
import { DashboardPage } from './pages/DashboardPage';
import { Footer } from './components/layout/Footer';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <UnitProvider>
        <WeatherProvider>
          <div className="min-h-screen bg-[#080d1a] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
            <Navbar />
            <div className="flex-1">
              <DashboardPage />
            </div>
            <Footer />
          </div>
        </WeatherProvider>
      </UnitProvider>
    </AuthProvider>
  );
};

export default App;
