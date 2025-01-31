"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTranslationContext } from "@/context/TranslationContext";

const TranslationLanguageSelector: React.FC = () => {
  const { language, setLanguage } = useTranslationContext();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleOpen = () => {
    setOpen((prev) => !prev);
  };

  const handleSelect = (lang: "japanese" | "english") => {
    setLanguage(lang);
    setOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative inline-block text-left ml-4">
      <button
        onClick={toggleOpen}
        className="inline-flex justify-center w-full rounded-md border border-blue-600 dark:border-blue-400 shadow-sm px-4 py-2 bg-blue-600 dark:bg-blue-800 text-white font-medium hover:bg-blue-700 dark:hover:bg-blue-700 focus:outline-none"
      >
        {language === "japanese" ? "日本語" : "English"}
        <svg
          className="-mr-1 ml-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.23 8.29a.75.75 0 01.02-1.08z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {open && (
        <div className="origin-top-right absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="py-1">
            <button
              onClick={() => handleSelect("japanese")}
              className="block w-full text-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              日本語
            </button>
            <button
              onClick={() => handleSelect("english")}
              className="block w-full text-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              English
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TranslationLanguageSelector;
