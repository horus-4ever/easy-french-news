"use client";

import React, { useEffect, useState } from 'react';
import { IVocabulary } from '@/features/articles/types/article';
import { FiChevronLeft, FiChevronRight, FiRotateCw } from 'react-icons/fi';
import { useTranslationContext } from '@/context/TranslationContext';

interface MinimalFlashcardProps {
  vocab: IVocabulary;
  currentCardIndex?: number;
}

/**
 * MinimalFlashcard displays an interactive flashcard with a stack effect.
 * The top card can be flipped by tapping and swiped to navigate.
 * When navigating, the new card always appears on its default (front) side.
 * The card counter (in the format "n / total") is shown directly on the card.
 * The overlay on the top card always appears upright regardless of the flip,
 * and the underlying (stack) card also shows its counter while swiping.
 *
 * The flashcard text is now bold and a bit larger.
 */
export default function MinimalFlashcard({
  vocab
}: MinimalFlashcardProps) {
  // State for current card index and flip status.
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // States for handling the drag gesture.
  const [dragX, setDragX] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  // Flag to temporarily disable transition when switching cards.
  const [disableTransition, setDisableTransition] = useState(false);
  const [translationsArr, setTranslationsArr] = useState<string[]>([]);
  const [back, setBack] = useState<string>();
  const [front, setFront] = useState<string>();
  const [totalCards, setTotalCards] = useState<number>(0);

  const { language } = useTranslationContext();

  useEffect(() => {
    setTranslationsArr(vocab.translations[language] || []);
  }, [language, vocab]);

  useEffect(() => {
    setCurrentIndex(0);
    setTotalCards(vocab.words.length);
    setIsFlipped(false);
  }, [vocab]);

  useEffect(() => {
    setFront(vocab.words[currentIndex]);
    setBack(translationsArr[currentIndex] || 'No translation available');
  }, [currentIndex, translationsArr]);

  // Compute the underlying (stack) card index.
  // If dragging left (delta negative), show the next card;
  // if dragging right (delta positive), show the previous card.
  const stackIndex =
    dragX < 0
      ? (currentIndex + 1) % totalCards
      : dragX > 0
      ? (currentIndex - 1 + totalCards) % totalCards
      : (currentIndex + 1) % totalCards;
  const stackCard = vocab.words[stackIndex];

  // Combined transform for the top (interactive) card.
  const topTransform = `translateX(${dragX}px) rotateY(${isFlipped ? 180 : 0}deg)`;
  const transitionStyle =
    isDragging || disableTransition ? 'none' : 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';

  // Navigation helper: update card index and always reset the flip state.
  const navigateCard = (direction: 'next' | 'prev') => {
    setDisableTransition(true);
    setCurrentIndex((prev) =>
      direction === 'next' ? (prev + 1) % totalCards : (prev - 1 + totalCards) % totalCards
    );
    // Always reset the flip state so that the new card appears on the front.
    setIsFlipped(false);
    setDragX(0);
    setTimeout(() => setDisableTransition(false), 50);
  };

  // Touch events for swipe gesture.
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const currentX = e.touches[0].clientX;
    const deltaX = currentX - touchStartX;
    setDragX(deltaX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null) return;
    const deltaX = dragX;
    const swipeThreshold = 80; // Minimum pixels for a swipe.
    if (deltaX > swipeThreshold) {
      // Swipe right: navigate to previous card.
      navigateCard('prev');
      setIsDragging(false);
    } else if (deltaX < -swipeThreshold) {
      // Swipe left: navigate to next card.
      navigateCard('next');
      setIsDragging(false);
    } else {
      // Not enough drag: spring back to center.
      setDragX(0);
      setIsDragging(false);
    }
    setTouchStartX(null);
  };

  // Fallback navigation buttons.
  const handleNext = () => navigateCard('next');
  const handlePrev = () => navigateCard('prev');
  const handleFlip = () => {
    if (!isDragging) setIsFlipped((prev) => !prev);
  };

  if (totalCards === 0) {
    return (
      <div className="text-center text-lg text-gray-800 dark:text-gray-100">
        No vocabulary available
      </div>
    );
  }

  return (
    // Outer wrapper with overflow-hidden prevents horizontal scroll.
    <div className="max-w-md mx-auto overflow-hidden">
      <div className="relative w-full h-64 mb-4" style={{ perspective: '1000px' }}>
        {/* Conditionally render the underlying (stack) card only while dragging */}
        {(isDragging || dragX !== 0) && (
          <div
            className="absolute w-full h-full rounded-md shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center select-none"
            style={{
              transform: 'scale(0.95) translateY(8px)',
            }}
          >
            <span className="font-bold text-3xl text-gray-900 dark:text-gray-100">{stackCard}</span>
            {/* Underlying card counter */}
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
              {stackIndex + 1} / {totalCards}
            </div>
          </div>
        )}

        {/* Top (interactive) card */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={handleFlip}
          className="relative w-full h-full rounded-md shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center cursor-pointer select-none"
          style={{
            transformStyle: 'preserve-3d',
            transition: transitionStyle,
            transform: topTransform,
            zIndex: 10,
          }}
        >
          {/* Front side */}
          <div
            className="absolute w-full h-full flex items-center justify-center"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <span className="font-bold text-3xl text-gray-900 dark:text-gray-100">{front}</span>
          </div>
          {/* Back side */}
          <div
            className="absolute w-full h-full flex items-center justify-center"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <span className="font-bold text-3xl text-gray-800 dark:text-gray-100">{back}</span>
          </div>
          {/* Top card counter overlay.
              Its inline style cancels out the parent's Y-rotation when flipped.
          */}
          <div
            className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded"
            style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
          >
            {currentIndex + 1} / {totalCards}
          </div>
        </div>
      </div>

      {/* Fallback navigation controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={handlePrev}
          className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition"
        >
          <FiChevronLeft size={24} className="text-gray-700 dark:text-gray-200" />
        </button>
        <button
          onClick={handleFlip}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center gap-2"
        >
          <FiRotateCw size={20} />
          Flip
        </button>
        <button
          onClick={handleNext}
          className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition"
        >
          <FiChevronRight size={24} className="text-gray-700 dark:text-gray-200" />
        </button>
      </div>
    </div>
  );
}
