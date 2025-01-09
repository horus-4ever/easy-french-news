"use client";

import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { parseContentHtml } from '@/lib/parseContent';
import { sanitizeHtml } from '@/lib/sanitizeHtml';
import { findInTrie, getTrieRoot, VerbMatch } from '@/features/conjugation/services/reversedConjugationService';
import { fetchDictionaryForm } from '@/features/conjugation/api/api';
import { useErrorContext } from '@/context/ErrorContext';

interface IVocabulary {
  word: string;
  category: string;
  translation: string;
}

interface ArticleDetailProps {
  content: string;             // HTML from either easyVersion.content or mediumVersion.content
  vocabulary: IVocabulary[];  // The corresponding vocabulary array
}

export default function ArticleDetail({ content, vocabulary }: ArticleDetailProps) {
  const sanitizedContent = sanitizeHtml(content);
  const parsedContent = parseContentHtml(sanitizedContent, vocabulary);

  const contentRef = useRef<HTMLDivElement>(null);

  const [selectedText, setSelectedText] = useState<string>('');
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [isTooltipVisible, setIsTooltipVisible] = useState<boolean>(false);
  const [isTooltipAbove, setIsTooltipAbove] = useState<boolean>(true); // New state for arrow direction

  const { setError } = useErrorContext();

  useEffect(() => {
    const handleSelection = async () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim().length > 0) {
        const selected = selection.toString();
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        // Calculate tooltip position relative to the viewport
        let tooltipX = rect.left + rect.width / 2;
        let tooltipY = rect.top - 10; // 10px above the selection

        const tooltipHeight = 40; // Estimated height of the tooltip
        const buffer = 10; // Buffer space from the viewport edges

        // Determine if tooltip should be above or below the selection
        if (rect.top < tooltipHeight + buffer) {
          tooltipY = rect.bottom + 10; // 10px below the selection
          setIsTooltipAbove(false);    // Tooltip is below
        } else {
          tooltipY = rect.top - 10;     // 10px above the selection
          setIsTooltipAbove(true);     // Tooltip is above
        }

        // Ensure tooltip doesn't overflow the viewport horizontally
        const tooltipWidth = 200; // Maximum width of the tooltip
        if (tooltipX < tooltipWidth / 2 + buffer) {
          tooltipX = tooltipWidth / 2 + buffer;
        } else if (tooltipX > window.innerWidth - tooltipWidth / 2 - buffer) {
          tooltipX = window.innerWidth - tooltipWidth / 2 - buffer;
        }

        const matched: {success: boolean, matched: VerbMatch[]} = await fetchDictionaryForm(selected);
        if(matched.success && matched.matched.length !== 0) {
          const {verb, tense, personIndex} = matched.matched[0];
          setSelectedText(verb + " " + tense + " " + personIndex);
        } else {
          setIsTooltipVisible(false);
          return;
        }
        
        setTooltipPosition({ top: tooltipY, left: tooltipX });
        setIsTooltipVisible(true);
      } else {
        setIsTooltipVisible(false);
      }
    };

    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('mouseup', handleSelection);
      contentElement.addEventListener('touchend', handleSelection);
    }

    // Cleanup event listeners on unmount
    return () => {
      if (contentElement) {
        contentElement.removeEventListener('mouseup', handleSelection);
        contentElement.removeEventListener('touchend', handleSelection);
      }
    };
  }, []);

  // Hide tooltip when clicking outside or pressing Esc
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        setIsTooltipVisible(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsTooltipVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Tooltip styles using fixed positioning
  const tooltipStyles: React.CSSProperties = {
    position: 'fixed',
    top: tooltipPosition.top,
    left: tooltipPosition.left,
    transform: 'translate(-50%, -100%)', // Center horizontally and position above
    whiteSpace: 'nowrap',
    maxWidth: '200px',
    wordWrap: 'break-word',
    zIndex: 50, // Ensure it appears above other elements
  };

  return (
    <>
      {isTooltipVisible && ReactDOM.createPortal(
        <div
          className="bg-gray-800 text-white text-sm px-2 py-1 rounded shadow-lg animate-fade-in relative"
          style={tooltipStyles}
        >
          {selectedText}
          {/* Tooltip Arrow */}
          <div
            className={`absolute w-0 h-0 border-l-4 border-r-4 border-transparent left-1/2 transform -translate-x-1/2 ${
              isTooltipAbove
                ? 'border-t-4 border-t-gray-800 top-full'
                : 'border-b-4 border-b-gray-800 bottom-full'
            }`}
          ></div>
        </div>,
        document.body
      )}
      <div
        ref={contentRef}
        className="prose max-w-none text-xl text-justify"
      >
        {parsedContent}
      </div>
    </>
  );
}
