"use client";

import React, { ReactNode, useRef, useEffect, useState } from 'react';

interface VocabWordProps {
  word: string;
  translation: string;
  category: string;
  children: ReactNode;
}

export default function VocabWord({
  word,
  translation,
  category,
  children
}: VocabWordProps) {
  const [position, setPosition] = useState<'left' | 'right' | 'center'>('center');
  const [visible, setVisible] = useState(false);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const parentRef = useRef<HTMLSpanElement>(null);

  const adjustTooltip = () => {
    if (tooltipRef.current) {
      const rect = tooltipRef.current.getBoundingClientRect();
      const windowWidth = window.outerWidth;
      if (rect.left < 0) {
        setPosition('right');
      } else if (rect.right > windowWidth) {
        setPosition('left');
      }
    }
  };

  const handleMouseEnter = () => {
    setVisible(true);
  };

  const handleMouseLeave = () => {
    setVisible(false);
  };

  useEffect(() => {
    window.addEventListener('resize', adjustTooltip);
    return () => window.removeEventListener('resize', adjustTooltip);
  }, []);

  useEffect(() => {
    if(visible) adjustTooltip();
  }, [visible]);

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
            rounded border border-gray-200 
            bg-white text-lg text-gray-800 shadow 
            transition-opacity 
            ${position === 'left' ? 'right-0' : ''}
            ${position === 'right' ? 'left-0' : ''}
            ${position === 'center' ? '-translate-x-1/2 left-1/2' : ''}
            opacity-100
          `}
        >
          <strong>{word}</strong>
          <br />
          {translation}
        </span>
      )}
    </span>
  );
}
