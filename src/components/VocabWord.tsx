import React, { ReactNode, useRef, useEffect, useState } from 'react';

interface VocabWordProps {
  word: string;
  translation: string;
  reading?: string;
  children: ReactNode;
}

export default function VocabWord({
  word,
  translation,
  reading,
  children
}: VocabWordProps) {
  const [position, setPosition] = useState<'left' | 'right' | 'center'>('center');
  const tooltipRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const adjustTooltip = () => {
      setPosition('center');
      if (tooltipRef.current) {
        const rect = tooltipRef.current.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        console.log(word);
        console.log(rect);

        if (rect.left < 0) {
          setPosition('right');
        } else if (rect.right > windowWidth) {
          setPosition('left');
        } else {
          setPosition('center');
        }
      }
    };
    // Adjust on mount and window resize
    adjustTooltip();
    window.addEventListener('resize', adjustTooltip);
    
    return () => window.removeEventListener('resize', adjustTooltip);
  }, []);

  return (
    <span
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
      <span
        ref={tooltipRef}
        className={`
          pointer-events-none 
          absolute bottom-full mb-2 w-max p-2 
          rounded border border-gray-200 
          bg-white text-lg text-gray-800 shadow 
          opacity-0 transition-opacity group-hover:opacity-100
          ${position === 'left' ? 'right-0' : ''}
          ${position === 'right' ? 'left-0' : ''}
          ${position === 'center' ? '-translate-x-1/2 left-1/2' : ''}
        `}
      >
        <strong>{word}</strong>
        <br />
        {translation}
      </span>
    </span>
  );
}
