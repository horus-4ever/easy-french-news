'use client';

import Link from 'next/link';
import React, { useState } from 'react';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md px-4 py-2">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600">
        フランス語ニュース
        </Link>
        <button
          className="md:hidden p-2 border rounded"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          {/* Filter / search would go here if needed */}
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
