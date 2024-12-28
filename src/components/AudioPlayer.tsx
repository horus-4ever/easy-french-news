"use client";

import React, { useRef, useState, useEffect } from 'react';
import { FiSettings, FiPlay, FiPause, FiX } from 'react-icons/fi';
import { RiForward5Fill, RiReplay5Fill } from "react-icons/ri";
import { useAudioState } from '@/context/AudioStateContext';

interface Props {
  src: string;
}

export default function AudioPlayer({ src }: Props) {
  const progressBarDesktopRef = useRef<HTMLDivElement>(null);
  const progressBarMobileRef = useRef<HTMLDivElement>(null);
  const {
    audioRef,
    playerContainerRef,
    isPlaying,
    setIsPlaying,
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    setMiniPlayerClosed
  } = useAudioState();

  // optional local states
  const [speed, setSpeed] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playerElement, setPlayerElement] = useState<HTMLDivElement | null>(null);

  // We keep your existing useEffect, but we set audioRef.current = new Audio().
  // If there's already an <audio> in audioRef, we won't re-create it.
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;
    // set the src
    audio.src = src;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    // remove listeners on cleanup
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [src, audioRef, setCurrentTime, setDuration, setIsPlaying]);


  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;

      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
      });

      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
      });

      audio.volume = volume;
    }
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setMiniPlayerClosed(false);
      setIsPlaying(!isPlaying);
    }
  };

  const skip = (amount: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime += amount;
    }
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>, ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current && audioRef.current) {
      const rect = ref.current.getBoundingClientRect();
      const clickPosition = e.clientX - rect.left;
      const percentage = clickPosition / rect.width;
      audioRef.current.currentTime = percentage * duration;
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div ref={playerContainerRef} className="audio-player w-full flex flex-col items-center p-6 bg-white rounded-lg shadow-lg border border-gray-200">
      <h3 className="font-semibold mb-3 text-lg flex items-center">
        🎧 Article Audio
      </h3>

      <audio ref={audioRef} src={src} />

      <div className="w-full">
        {/* Desktop: Inline Row */}
        <div className="hidden md:flex items-center w-full space-x-4">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            className="p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition"
          >
            {isPlaying ? <FiPause size={20} /> : <FiPlay size={20} />}
          </button>

          {/* Seekable Progress Bar */}
          <div
            ref={progressBarDesktopRef}
            className="flex-1 h-2 bg-gray-300 rounded w-full overflow-hidden cursor-pointer"
            onClick={(e) => handleSeek(e, progressBarDesktopRef)}
          >
            <div
              className="h-2 bg-blue-500 rounded"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>

          {/* Time Stamps */}
          <div className="w-20 text-gray-500 text-sm flex justify-between">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Skip Back 5s */}
          <button
            onClick={() => skip(-5)}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
          >
            <RiReplay5Fill size={24} />
          </button>

          {/* Skip Forward 5s */}
          <button
            onClick={() => skip(5)}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
          >
            <RiForward5Fill size={24} />
          </button>

          {/* Settings Button */}
          <button
            className="p-2 bg-gray-100 border rounded-full hover:bg-gray-200"
            onClick={() => setShowSettings(true)}
          >
            <FiSettings size={24} />
          </button>
        </div>

        {/* Mobile Layout - Play/Pause Row */}
        <div className="flex items-center w-full md:hidden space-x-4">
          <button
            onClick={togglePlay}
            className="p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition"
          >
            {isPlaying ? <FiPause size={20} /> : <FiPlay size={20} />}
          </button>

          <div
            ref={progressBarMobileRef}
            className="flex-1 h-2 bg-gray-300 rounded overflow-hidden cursor-pointer w-full"
            onClick={(e) => handleSeek(e, progressBarMobileRef)}
          >
            <div
              className="h-2 bg-blue-500 rounded"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
        </div>

        {/* Mobile Layout - Skip and Settings Row */}
        <div className="flex justify-center space-x-6 mt-4 md:hidden">
          <button
            onClick={() => skip(-5)}
            className="p-3 bg-gray-100 rounded-full hover:bg-gray-200"
          >
            <RiReplay5Fill size={24} />
          </button>

          <button
            onClick={() => skip(5)}
            className="p-3 bg-gray-100 rounded-full hover:bg-gray-200"
          >
            <RiForward5Fill size={24} />
          </button>

          <button
            className="p-3 bg-gray-100 border rounded-full hover:bg-gray-200"
            onClick={() => setShowSettings(true)}
          >
            <FiSettings size={24} />
          </button>
        </div>
      </div>

      {/* Settings Popup Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button
              onClick={() => setShowSettings(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
            >
              <FiX size={24} />
            </button>
            <h4 className="text-lg font-semibold mb-4">Playback Settings</h4>
            <div className="flex items-center justify-between mb-4">
              <span>Speed:</span>
              <select
                value={speed}
                onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                className="p-2 border rounded-md"
              >
                <option value="0.5">0.5x</option>
                <option value="0.75">0.75x</option>
                <option value="1">1x</option>
                <option value="1.25">1.25x</option>
                <option value="1.5">1.5x</option>
                <option value="2">2x</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <span>Volume:</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="cursor-pointer w-32"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
