// src/app/layout.tsx

import './globals.css';
import 'leaflet/dist/leaflet.css';
import React from 'react';
import { Metadata } from 'next';
import Navbar from '@/components/navbar/Navbar';
import AppContextProvider from '@/context/AppContext';
import { AudioStateProvider } from '@/context/AudioStateContext';
import MiniPlayer from '@/components/audio/MiniPlayer';

// 1) import the ErrorProvider
import { ErrorProvider } from '@/context/ErrorContext';
import ErrorBanner from '@/components/ErrorBanner';

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
          <ErrorProvider>
            <AudioStateProvider>
              <Navbar />
              <ErrorBanner />
              <main className="min-h-screen bg-gray-50 p-4 dark:bg-gray-900">
                {children}
              </main>
              <MiniPlayer />
            </AudioStateProvider>
          </ErrorProvider>
        </AppContextProvider>
      </body>
    </html>
  );
}
