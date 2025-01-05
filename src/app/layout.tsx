// src/app/layout.tsx
import './globals.css';
import React from 'react';
import { Metadata } from 'next';
import Navbar from '@/components/navbar/Navbar';
import AppContextProvider from '@/context/AppContext';

// (new) import
import { AudioStateProvider } from '@/context/AudioStateContext';
// (new) import
import MiniPlayer from '@/components/audio/MiniPlayer';

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
          {/* Provide global audio state */}
          <AudioStateProvider>
            <Navbar />
            <main className="min-h-screen bg-gray-50 p-4 dark:bg-gray-900">{children}</main>

            {/* Render the mini-player at the bottom so it’s always present */}
            <MiniPlayer />
          </AudioStateProvider>
        </AppContextProvider>
      </body>
    </html>
  );
}

