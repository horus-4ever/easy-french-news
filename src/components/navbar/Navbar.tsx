"use client";

import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import NavLinks from './NavLinks';
import DarkModeToggle from './DarkModeToggle';
import useNavHeight from '@/hooks/useNavHeight';

// 1) import the translation context:
import { useTranslationContext } from '@/context/TranslationContext';
import TranslationLanguageSelector from '../TranslationLanguageSelector';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navRef = useRef(null);
  const [navHeight] = useNavHeight(navRef);

  // 2) Grab language + setter from context
  const { language, setLanguage } = useTranslationContext();

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

  const toggleMenu = () => {
    setOpen(!open);
  };

  // 3) Handler for <select> changes
  function handleLanguageChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setLanguage(e.target.value);
  }

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
            <NavLinks />

            {/* Dark Mode Toggle Switch */}
            <div className="flex items-center">
              <DarkModeToggle />
            </div>

            {/* 4) Language Selector */}
            <TranslationLanguageSelector />
          </div>

          <button
            className={`md:hidden text-white text-3xl transform transition duration-500 ${
              open ? 'rotate-180' : 'rotate-0'
            }`}
            onClick={toggleMenu}
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
          <NavLinks />

          <div className="flex items-center">
            <DarkModeToggle />
          </div>

          {/* Also show language selector in the mobile menu if you want */}
          <TranslationLanguageSelector />
        </div>
      </div>
    </>
  );
}
