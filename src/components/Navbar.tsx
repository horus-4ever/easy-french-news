"use client";

import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';
import { FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [navHeight, setNavHeight] = useState(0);
  const navRef = useRef(null);

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    if (navRef.current) {
      setNavHeight(navRef.current["offsetHeight"]);
    }

    const handleResize = () => {
      if (navRef.current) {
        setNavHeight(navRef.current["offsetHeight"]);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <nav
        ref={navRef}
        className="bg-gradient-to-r from-blue-800 to-blue-900 shadow-md relative z-50"
      >
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <Link href="/" className="text-4xl font-extrabold text-white tracking-wide">
            フランス語ニュース
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-lg text-white hover:text-blue-300 transition duration-300">
              Home
            </Link>
            <Link href="/about" className="text-lg text-white hover:text-blue-300 transition duration-300">
              About
            </Link>

            {/* Dark Mode Toggle Switch */}
            <div className="flex items-center">
              <div
                onClick={toggleDarkMode}
                className={`relative w-14 h-8 flex items-center bg-blue-600 rounded-full p-1 cursor-pointer transition-all duration-300`}
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
            </div>
          </div>

          <button
            className={`md:hidden text-white text-3xl transform transition duration-500 ${
              open ? 'rotate-180' : 'rotate-0'
            }`}
            onClick={() => setOpen(!open)}
            aria-label="Toggle Menu"
          >
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </nav>

      <div
        className={`fixed top-0 bottom-0 right-0 bg-blue-950 bg-opacity-90 backdrop-blur-md transform transition-all duration-500 ${
          open ? 'translate-x-0' : 'translate-x-full'
        } z-40`}
        style={{ width: '100%', top: `${navHeight}px` }}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-10">
          <Link
            href="/"
            className="text-3xl text-white hover:text-blue-300 transition duration-300"
            onClick={() => setOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-3xl text-white hover:text-blue-300 transition duration-300"
            onClick={() => setOpen(false)}
          >
            About
          </Link>

          <div className="flex items-center">
            <div
              onClick={toggleDarkMode}
              className={`relative w-14 h-8 flex items-center ${
                'bg-blue-600'
              } rounded-full p-1 cursor-pointer transition-all duration-300`}
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
          </div>
        </div>
      </div>
    </>
  );
}
