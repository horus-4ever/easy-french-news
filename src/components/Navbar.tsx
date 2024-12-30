'use client';

import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [navHeight, setNavHeight] = useState(0);
  const navRef = useRef(null);

  // Calculate and update navbar height dynamically
  useEffect(() => {
    if (navRef.current) {
      setNavHeight(navRef.current["offsetHeight"]);
    }

    // Update height on window resize
    const handleResize = () => {
      if (navRef.current) {
        setNavHeight(navRef.current["offsetHeight"]);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <nav
        ref={navRef}
        className="bg-gradient-to-r from-blue-800 to-blue-900 shadow-md relative z-50"
      >
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          {/* Logo */}
          <Link href="/" className="text-4xl font-extrabold text-white tracking-wide">
            フランス語ニュース
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-lg text-white hover:text-blue-300 transition duration-300"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-lg text-white hover:text-blue-300 transition duration-300"
            >
              About
            </Link>
          </div>

          {/* Mobile Menu Button */}
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

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed top-0 bottom-0 right-0 bg-blue-950 bg-opacity-90 backdrop-blur-md transform transition-all duration-500 ${
          open ? 'translate-x-0' : 'translate-x-full'
        } z-40`}
        style={{ width: '100%', top: `${navHeight}px` }}  // Dynamic height + width for slide-in effect
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
        </div>
      </div>
    </>
  );
}
