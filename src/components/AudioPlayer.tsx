import React, { useRef, useState } from 'react';

interface Props {
  src: string;
}

export default function AudioPlayer({ src }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (audio) {
      if (playing) {
        audio.pause();
      } else {
        audio.play();
      }
      setPlaying(!playing);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button onClick={togglePlay} className="px-4 py-2 bg-blue-600 text-white rounded">
        {playing ? 'Pause' : 'Play'}
      </button>
      <audio ref={audioRef} src={src} />
      {/* More advanced controls (seek, speed) could be added here */}
    </div>
  );
}
