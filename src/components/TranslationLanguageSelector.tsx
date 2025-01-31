"use client";

import React from "react";
import { useTranslationContext } from "@/context/TranslationContext";

const TranslationLanguageSelector: React.FC = () => {
  const { language, setLanguage } = useTranslationContext();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as "japanese" | "english");
  };

  return (
    <div className="ml-4">
      <select
        value={language}
        onChange={handleChange}
        className="p-1 border rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
      >
        <option value="japanese">日本語</option>
        <option value="english">English</option>
        {/* Add more options here if needed */}
      </select>
    </div>
  );
};

export default TranslationLanguageSelector;
