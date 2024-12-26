'use client';

import React, { createContext, useContext, useState } from 'react';

interface AppContextProps {
  // define any shared state or methods
  filters: string[];
  setFilters: React.Dispatch<React.SetStateAction<string[]>>;
}

const Context = createContext<AppContextProps | undefined>(undefined);

export default function AppContextProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [filters, setFilters] = useState<string[]>([]);

  return (
    <Context.Provider value={{ filters, setFilters }}>
      {children}
    </Context.Provider>
  );
}

export function useAppContext() {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
}
