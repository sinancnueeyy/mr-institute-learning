import React, { createContext, useContext, useState, useEffect } from 'react';
import { settingsRepository } from '../repositories';
import type { Settings } from '../types';

interface SettingsContextType {
  settings: Settings | null;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: null,
  loading: true,
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real scenario, this might listen in real-time or just fetch once
    const fetchSettings = async () => {
      const { data } = await settingsRepository.query([{ field: 'active', operator: '==', value: true }]);
      if (data && data.length > 0) {
        setSettings(data[0]);
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};
