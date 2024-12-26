import './globals.css';
import React from 'react';
import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import AppContextProvider from '@/context/AppContext';

export const metadata: Metadata = {
  title: 'French Learning App',
  description: 'A website providing simplified French news articles.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <AppContextProvider>
          <Navbar />
          <main className="min-h-screen bg-gray-50 p-4">{children}</main>
        </AppContextProvider>
      </body>
    </html>
  );
}
