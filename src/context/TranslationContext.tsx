"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * The shape of our translation context state.
 * `language` is the currently selected translation language.
 */
type TranslationContextProps = {
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
};

const TranslationContext = createContext<TranslationContextProps | undefined>(undefined);

/**
 * `TranslationProvider` reads the user's chosen language from localStorage on mount,
 * then provides `[language, setLanguage]` to all children via context.
 */
export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState('japanese'); // default

  // On mount, read local storage (if any)
  useEffect(() => {
    const storedLanguage = localStorage.getItem('preferredLanguage');
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);

  // Whenever `language` changes, persist it to localStorage
  useEffect(() => {
    localStorage.setItem('preferredLanguage', language);
  }, [language]);

  return (
    <TranslationContext.Provider value={{ language, setLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
}

/**
 * `useTranslationContext` is a helper hook for consuming our context.
 */
export function useTranslationContext() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslationContext must be used within a TranslationProvider');
  }
  return context;
}
