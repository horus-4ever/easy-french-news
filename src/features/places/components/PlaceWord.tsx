"use client";

import dynamic from 'next/dynamic';
import React, { ReactNode, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Props for PlaceWord:
 *   - placeName: The text inside <place>...</place>, e.g. "Paris"
 *   - children: The actual text node to render
 */
interface PlaceWordProps {
  placeName: string;
  latitude: string;
  longitude: string;
  children: ReactNode;
}

export default function PlaceWord({ placeName, latitude, longitude, children }: PlaceWordProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const PlacePopup = useMemo(() => dynamic(
    () => import('@/features/places/components/PlacePopup'),
    {
        ssr: false
    }
), []);

  const handleClick = () => {
    setIsPopupOpen(true);
  };

  const handleClose = () => {
    setIsPopupOpen(false);
  };

  return (
    <span
      onClick={handleClick}
      className="
        relative group 
        cursor-pointer 
        text-purple-500 
        underline 
        underline-offset-2 
        decoration-dotted
      "
      title="Click to see map"
    >
      {children}
      {isPopupOpen && createPortal(
        <PlacePopup
          placeName={placeName}
          latitude={latitude}
          longitude={longitude}
          onClose={handleClose}
        />, document.body
      )}
    </span>
  );
}
