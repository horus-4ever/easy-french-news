"use client";

import useDarkMode from '@/hooks/useDarkMode';
import { FiSun, FiMoon } from 'react-icons/fi';

const DarkModeToggle = () => {
    const [darkMode, toggleDarkMode] = useDarkMode();

  return (
    <div
      onClick={toggleDarkMode}
      className={`relative w-14 h-8 flex items-center bg-blue-600 rounded-full p-1 cursor-pointer transition-all duration-300`}
      aria-label="Toggle Dark Mode"
      role="button"
      tabIndex={0}
    >
      <div
        className={`absolute left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-all ${
          darkMode ? 'translate-x-6' : 'translate-x-0 bg-blue-800'
        }`}
      />
      <FiSun
        className={`absolute left-2 text-black ${
          darkMode ? 'opacity-0' : 'opacity-100'
        } transition-opacity`}
      />
      <FiMoon
        className={`absolute right-2 text-black ${
          darkMode ? 'opacity-100' : 'opacity-0'
        } transition-opacity`}
      />
    </div>
  );
};

export default DarkModeToggle;
