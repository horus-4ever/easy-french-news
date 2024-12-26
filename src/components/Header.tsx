"use client";

import Link from "next/link";
import { useState } from "react";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="text-lg font-bold">
          French News
        </Link>
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {/* hamburger icon */}
          <span className="block w-6 h-0.5 bg-black mb-1"></span>
          <span className="block w-6 h-0.5 bg-black mb-1"></span>
          <span className="block w-6 h-0.5 bg-black"></span>
        </button>
        <nav
          className={`${
            isOpen ? "block" : "hidden"
          } absolute md:static top-full left-0 w-full md:w-auto bg-white md:flex`}
        >
          <ul className="md:flex md:space-x-4">
            <li>
              <Link href="/articles" className="block px-4 py-2 hover:bg-gray-100">
                Articles
              </Link>
            </li>
            {/* Add more nav items like "Labels", "Search", etc. */}
          </ul>
        </nav>
      </div>
    </header>
  );
}
