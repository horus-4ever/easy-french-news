'use client';

import Link from 'next/link';
import React, { useState } from 'react';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-black shadow-md px-6 py-4">
      <div className="mx-auto flex items-center justify-left">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-3xl font-bold text-pink-400">
          フランス語ニュース
          </Link>
          <button
            className="md:hidden p-2 border rounded text-white"
            onClick={() => setOpen(!open)}
          >
            ☰
          </button>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" className="hover:underline text-white">
              Home
            </Link>
            {/* Filter / search would go here if needed */}
          </div>
        </div>
      </div>
      {open && (
        <div className="md:hidden mt-2">
          <Link href="/" className="block py-2">
            Home
          </Link>
          {/* Additional nav items */}
        </div>
      )}
    </nav>
  );
}
