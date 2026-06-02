import React, { createContext, useContext } from 'react';
import { useAppState as useAppStateOriginal } from '../hooks/useAppState';

type AppStateContextType = ReturnType<typeof useAppStateOriginal>;

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const state = useAppStateOriginal();
  return (
    <AppStateContext.Provider value={state}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
