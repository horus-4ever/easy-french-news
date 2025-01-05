"use client";

import React, { createContext, useContext, useState } from "react";

/**
 * You can store a single error message,
 * or extend this type to store multiple messages, error codes, etc.
 */
type ErrorType = string | null;

interface ErrorContextProps {
  error: ErrorType;
  setError: React.Dispatch<React.SetStateAction<ErrorType>>;
  clearError: () => void;
}

const ErrorContext = createContext<ErrorContextProps | undefined>(undefined);

export function ErrorProvider({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<ErrorType>(null);

  const clearError = () => {
    setError(null);
  };

  return (
    <ErrorContext.Provider value={{ error, setError, clearError }}>
      {children}
    </ErrorContext.Provider>
  );
}

export function useErrorContext() {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useErrorContext must be used within an ErrorProvider");
  }
  return context;
}
