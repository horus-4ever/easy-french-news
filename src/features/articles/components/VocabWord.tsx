"use client";

import React, { ReactNode, useRef, useEffect, useState } from 'react';
import { useTranslationContext } from '@/context/TranslationContext';

interface VocabWordProps {
  word: string;
  translations: { [lang: string]: string }; // e.g. { japanese: "...", english: "..." }
  category: string;
  children: ReactNode;
}

export default function VocabWord({
  word,
  translations,
  category,
  children
}: VocabWordProps) {
  const { language } = useTranslationContext(); // 1) Get the chosen language

  const [position, setPosition] = useState<'left' | 'right' | 'center'>('center');
  const [visible, setVisible] = useState(false);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const parentRef = useRef<HTMLSpanElement>(null);

  const adjustTooltip = () => {
    if (tooltipRef.current) {
      const rect = tooltipRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      if (rect.left < 0) {
        setPosition('right');
      } else if (rect.right > windowWidth) {
        setPosition('left');
      }
    }
  };

  const handleMouseEnter = () => setVisible(true);
  const handleMouseLeave = () => setVisible(false);

  useEffect(() => {
    window.addEventListener('resize', adjustTooltip);
    return () => window.removeEventListener('resize', adjustTooltip);
  }, []);

  useEffect(() => {
    if (visible) adjustTooltip();
  }, [visible]);

  // 2) Safely pick the translation from translations[language]. Fallback to "japanese" if missing
  const displayedTranslation = translations[language] ?? translations["japanese"] ?? "No translation";

  return (
    <span
      ref={parentRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="
        relative group 
        cursor-pointer 
        text-orange-400 
        underline 
        underline-offset-2 
        decoration-dotted
      "
    >
      {children}
      {visible && (
        <span
          ref={tooltipRef}
          className={`
            overflow-hidden
            vocab-tooltip
            pointer-events-none 
            absolute bottom-full mb-2 w-max p-2 
            rounded border border-gray-200 dark:border-gray-600
            bg-white dark:bg-gray-800 
            text-lg text-gray-800 dark:text-gray-100 
            shadow 
            ${position === 'left' ? 'right-0' : ''}
            ${position === 'right' ? 'left-0' : ''}
            ${position === 'center' ? '-translate-x-1/2 left-1/2' : ''}
          `}
        >
          <strong>{word}</strong>
          <br />
          {displayedTranslation}
        </span>
      )}
    </span>
  );
}
