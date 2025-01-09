"use client";

import React, { useEffect, useState } from 'react';
import { getCoordinatesForPlace } from '@/features/places/api/nominatimApi';
import { MapContainer, TileLayer, Marker, Popup as LeafletPopup } from 'react-leaflet';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css'; // so that markers/tiles display correctly
import { FiX } from 'react-icons/fi';

interface PlacePopupProps {
  placeName: string;
  latitude: string;
  longitude: string;
  onClose: () => void;
}

interface Coordinates {
  lat: number;
  lon: number;
}

export default function PlacePopup({ placeName, latitude, longitude, onClose }: PlacePopupProps) {
  // const [coords, setCoords] = useState<Coordinates | null>(null);
  const [error, setError] = useState('');

  const coords = { lat: parseFloat(latitude), lon: parseFloat(longitude) };

  // 1) Fetch coordinates via Nominatim on mount
  /*
  useEffect(() => {
    (async function fetchCoords() {
      try {
        const result = await getCoordinatesForPlace(placeName);
        if (!result) {
          setError(`Coordinates not found for place: ${placeName}`);
          return;
        }
        setCoords(result);
      } catch (err: any) {
        setError(`Failed to fetch coordinates for ${placeName}: ${err.message}`);
      }
    })();
  }, [placeName]);
  */

  // 2) Fix Leaflet marker icons in Next
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }, []);

  return (
    /* 
      Background overlay: fixed, covers the screen, slightly transparent
      Clicking it closes the popup
    */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* 
        Popup container: 
        - On mobile: ~85vh tall to nearly fill screen
        - On desktop: up to 90vw wide, up to 90vh tall
      */}
      <div
        className="
          relative 
          bg-white dark:bg-gray-800
          w-full max-w-4xl  /* limit the max width on large screens */
          md:w-[90vw]
          h-[85vh] 
          md:h-[90vh]
          rounded-md shadow-md p-4
          overflow-hidden
        "
        onClick={(e) => e.stopPropagation()} // Prevent closing on map clicks
      >
        {/* Close button in top-right corner */}
        <button
          onClick={onClose}
          className="
            absolute top-3 right-3
            text-gray-600 dark:text-gray-400
            hover:text-gray-800 dark:hover:text-white
          "
        >
          <FiX size={24} />
        </button>

        {/* Place name heading */}
        <h2 className="block text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          {placeName}
        </h2>

        {/* If there's an error, display it in red */}
        {error && (
          <p className="text-red-500 text-sm mb-2">{error}</p>
        )}

        {/* If coordinates fetched successfully, show the map */}
        {coords && (
          <div className="w-full h-full">
            <MapContainer
              center={[coords.lat, coords.lon]}
              zoom={5}
              style={{ width: '100%', height: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">
                  OpenStreetMap
                </a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[coords.lat, coords.lon]}>
                <LeafletPopup>{placeName}</LeafletPopup>
              </Marker>
            </MapContainer>
          </div>
        )}
      </div>
    </div>
  );
}
