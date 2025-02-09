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

  const [speed, setSpeed] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;
    audio.src = src;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [src, audioRef, setCurrentTime, setDuration, setIsPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

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

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, ref: React.RefObject<HTMLDivElement>) => {
    audioRef.current?.pause();
    setIsDragging(true);
    handleSeek(e, ref);
  };

  const handleMouseMove = (e: MouseEvent, ref: React.RefObject<HTMLDivElement>) => {
    if (isDragging && ref.current && audioRef.current) {
      const rect = ref.current.getBoundingClientRect();
      const clickPosition = e.clientX - rect.left;
      const percentage = Math.min(Math.max(clickPosition / rect.width, 0), 1);
      audioRef.current.currentTime = percentage * duration;
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      if(isPlaying) {
        audioRef.current?.play();
      }
      setIsDragging(false);
    }
  };

  useEffect(() => {
    const handleMouseUpGlobal = () => handleMouseUp();
    const handleMouseMoveGlobal = (e: MouseEvent) => handleMouseMove(e, progressBarDesktopRef);

    window.addEventListener('mousemove', handleMouseMoveGlobal);
    window.addEventListener('mouseup', handleMouseUpGlobal);

    return () => {
      window.removeEventListener('mousemove', handleMouseMoveGlobal);
      window.removeEventListener('mouseup', handleMouseUpGlobal);
    };
  }, [isDragging]);

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
    <div ref={playerContainerRef} className="audio-player w-full flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="font-semibold mb-3 text-lg flex items-center text-gray-800 dark:text-gray-100">
        🎧 Article Audio
      </h3>
  
      <audio ref={audioRef} src={src} />
  
      <div className="w-full">
        {/* Desktop: Inline Row */}
        <div className="hidden md:flex items-center w-full space-x-4">
          <button
            onClick={togglePlay}
            className="p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition"
          >
            {isPlaying ? <FiPause size={20} /> : <FiPlay size={20} />}
          </button>
  
          <div
            ref={progressBarDesktopRef}
            className="flex-1 h-2 bg-gray-300 dark:bg-gray-600 rounded w-full overflow-hidden cursor-pointer"
            onClick={(e) => handleSeek(e, progressBarDesktopRef)}
            onMouseDown={(e) => handleMouseDown(e, progressBarDesktopRef)}
          >
            <div
              className="h-2 bg-blue-500 rounded"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
  
          <div className="w-20 text-gray-500 dark:text-gray-400 text-sm flex justify-between">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
  
          <button
            onClick={() => skip(-5)}
            className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <RiReplay5Fill size={24} />
          </button>
  
          <button
            onClick={() => skip(5)}
            className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <RiForward5Fill size={24} />
          </button>
  
          <button
            className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
            onClick={() => setShowSettings(true)}
          >
            <FiSettings size={24} />
          </button>
        </div>
  
        {/* Mobile Layout */}
        <div className="flex items-center w-full md:hidden space-x-4">
          <button
            onClick={togglePlay}
            className="p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition"
          >
            {isPlaying ? <FiPause size={20} /> : <FiPlay size={20} />}
          </button>
  
          <div
            ref={progressBarMobileRef}
            className="flex-1 h-2 bg-gray-300 dark:bg-gray-600 rounded overflow-hidden cursor-pointer w-full"
            onClick={(e) => handleSeek(e, progressBarMobileRef)}
            onMouseDown={(e) => handleMouseDown(e, progressBarMobileRef)}
          >
            <div
              className="h-2 bg-blue-500 rounded"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
        </div>
  
        <div className="flex justify-center space-x-6 mt-4 md:hidden">
          <button
            onClick={() => skip(-5)}
            className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <RiReplay5Fill size={24} />
          </button>
  
          <button
            onClick={() => skip(5)}
            className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <RiForward5Fill size={24} />
          </button>
  
          <button
            className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
            onClick={() => setShowSettings(true)}
          >
            <FiSettings size={24} />
          </button>
        </div>
      </div>
  
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96 relative">
            <button
              onClick={() => setShowSettings(false)}
              className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-red-500"
            >
              <FiX size={24} />
            </button>
            <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Playback Settings</h4>
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-800 dark:text-gray-200">Speed:</span>
              <select
                value={speed}
                onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                className="p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
              >
                <option value="0.7">0.7x</option>
                <option value="0.85">0.85x</option>
                <option value="1">1x</option>
                <option value="1.15">1.15x</option>
                <option value="1.3">1.3x</option>
              </select>
            </div>
  
            <div className="flex items-center justify-between">
              <span className="text-gray-800 dark:text-gray-200">Volume:</span>
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