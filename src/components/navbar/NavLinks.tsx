"use client";

import Link from 'next/link';

const NavLinks = () => (
  <>
    <Link
      href="/"
      className="text-3xl md:text-lg text-white hover:text-blue-300 transition duration-300"
    >
      Home
    </Link>
    <Link
      href="/about"
      className="text-3xl md:text-lg text-white hover:text-blue-300 transition duration-300"
    >
      About
    </Link>
  </>
);

export default NavLinks;
