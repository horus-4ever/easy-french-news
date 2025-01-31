"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface ReadArticlesContextValue {
  readArticles: string[];
  markAsRead: (id: string) => void;
  markAsUnread: (id: string) => void;
  toggleRead: (id: string) => void;
}

const ReadArticlesContext = createContext<ReadArticlesContextValue | undefined>(undefined);

export const ReadArticlesProvider = ({ children }: { children: React.ReactNode }) => {
  const [readArticles, setReadArticles] = useState<string[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("readArticles");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setReadArticles(parsed);
      } catch (err) {
        console.error("Failed to parse readArticles from localStorage", err);
      }
    }
  }, []);

  // Update localStorage whenever readArticles changes
  useEffect(() => {
    localStorage.setItem("readArticles", JSON.stringify(readArticles));
  }, [readArticles]);

  const markAsRead = (id: string) => {
    setReadArticles((prev) => {
      if (!prev.includes(id)) {
        return [...prev, id];
      }
      return prev;
    });
  };

  const markAsUnread = (id: string) => {
    setReadArticles((prev) => prev.filter((articleId) => articleId !== id));
  };

  const toggleRead = (id: string) => {
    setReadArticles((prev) =>
      prev.includes(id) ? prev.filter((articleId) => articleId !== id) : [...prev, id]
    );
  };

  return (
    <ReadArticlesContext.Provider value={{ readArticles, markAsRead, markAsUnread, toggleRead }}>
      {children}
    </ReadArticlesContext.Provider>
  );
};

export const useReadArticles = () => {
  const context = useContext(ReadArticlesContext);
  if (context === undefined) {
    throw new Error("useReadArticles must be used within a ReadArticlesProvider");
  }
  return context;
};
