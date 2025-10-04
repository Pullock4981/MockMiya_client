'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface ActiveTabContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ActiveTabContext = createContext<ActiveTabContextType | undefined>(undefined);

export const ActiveTabProvider = ({ children }: { children: ReactNode }) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <ActiveTabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </ActiveTabContext.Provider>
  );
};

export const useActiveTab = () => {
  const context = useContext(ActiveTabContext);
  if (!context) throw new Error('useActiveTab must be used within ActiveTabProvider');
  return context;
};
