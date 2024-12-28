// src/components/MiniPlayer.tsx
"use client";

import React from "react";
import { useAudioState } from "@/context/AudioStateContext";
import { useIsInViewport } from "@/hooks/useIsInViewport";
import { FiPause, FiPlay, FiX } from "react-icons/fi";
import { RiForward5Fill, RiReplay5Fill } from "react-icons/ri";

export default function MiniPlayer() {
  const {
    audioRef,
    playerContainerRef,
    isPlaying,
    setIsPlaying,
    currentTime,
    duration,
    miniPlayerClosed,
    setMiniPlayerClosed
  } = useAudioState();

  const isMainPlayerInView = useIsInViewport(playerContainerRef);

  // Only show if audio is playing, main player is NOT in view, 
  // and the user hasn’t closed the mini player
  let shouldShow = !isMainPlayerInView && !miniPlayerClosed;

  if (!shouldShow) return null;

  const formatTime = (time: number) => {
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSkip = (seconds: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime += seconds;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md flex items-center justify-between p-3 z-50">
      {/* Basic controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={togglePlay}
          className="bg-blue-500 text-white p-2 rounded-full"
        >
          {isPlaying ? <FiPause size={15} /> : <FiPlay size={15} />}
        </button>

        <button
          onClick={() => handleSkip(-5)}
          className="p-2 text-gray-600 hover:text-black"
        >
          <RiReplay5Fill size={20} />
        </button>
        <button
          onClick={() => handleSkip(5)}
          className="p-2 text-gray-600 hover:text-black"
        >
          <RiForward5Fill size={20} />
        </button>

        <div className="text-sm text-gray-600">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={() => setMiniPlayerClosed(true)}
        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600"
      >
        <FiX size={18} />
      </button>
    </div>
  );
}
