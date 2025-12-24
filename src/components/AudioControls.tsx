// components/AudioControls.tsx
import React, { useRef } from 'react';

interface AudioControlsProps {
  onPlay: (audioElement: HTMLAudioElement, fileName?: string) => void;
  onStop: () => void;
  audioInfo: string;
}

const AudioControls: React.FC<AudioControlsProps> = ({ onPlay, onStop }) => {

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const audioElement = new Audio(url);
    
    onPlay(audioElement, file.name);
  };

  return (
    <div></div>
  );
};

export default AudioControls;