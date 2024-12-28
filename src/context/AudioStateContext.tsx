// src/context/AudioStateContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  MutableRefObject,
} from "react";

interface AudioStateContextValue {
  audioRef: MutableRefObject<HTMLAudioElement | null>; 
  playerContainerRef: MutableRefObject<HTMLDivElement | null>;

  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;

  currentTime: number;
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>;

  duration: number;
  setDuration: React.Dispatch<React.SetStateAction<number>>;

  // Whether the user manually closed the mini player
  miniPlayerClosed: boolean;
  setMiniPlayerClosed: React.Dispatch<React.SetStateAction<boolean>>;
}

const AudioStateContext = createContext<AudioStateContextValue | undefined>(
  undefined
);

export function AudioStateProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // If user presses close on mini-player, we store it here
  const [miniPlayerClosed, setMiniPlayerClosed] = useState(false);

  const value: AudioStateContextValue = {
    audioRef,
    playerContainerRef,
    isPlaying,
    setIsPlaying,
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    miniPlayerClosed,
    setMiniPlayerClosed,
  };

  return (
    <AudioStateContext.Provider value={value}>
      {children}
    </AudioStateContext.Provider>
  );
}

export function useAudioState() {
  const context = useContext(AudioStateContext);
  if (!context) {
    throw new Error(
      "useAudioState must be used inside an AudioStateProvider"
    );
  }
  return context;
}
