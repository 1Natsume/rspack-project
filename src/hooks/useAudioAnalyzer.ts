// hooks/useAudioAnalyzer.ts
import { useState, useEffect, useRef } from 'react';

export const useAudioAnalyzer = () => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioInfo, setAudioInfo] = useState('');
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const initAudioContext = () => {
    if (!audioContext) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const anal = ctx.createAnalyser();
      anal.fftSize = 256;
      
      setAudioContext(ctx);
      
      setAnalyser(anal);
    }
  };

  const setupAudioSource = (audioElement: HTMLAudioElement) => {
    if (!audioContext || !analyser) return;

    if (sourceRef.current) {
      sourceRef.current.disconnect();
    }

    const source = audioContext.createMediaElementSource(audioElement);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    sourceRef.current = source;
  };

  const playAudio = (audioElement: HTMLAudioElement, fileName?: string) => {
    initAudioContext();
    if (audioContext?.state === 'suspended') {
      audioContext.resume();
    }

    setupAudioSource(audioElement);
    
    audioElement.play();
    setIsPlaying(true);

    if (fileName) {
      setAudioInfo(`正在播放: ${fileName}`);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setAudioInfo('');
  };

  const getFrequencyData = (): Uint8Array | null => {
    if (!analyser) return null;
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);
    
    return dataArray;
  };

  const getAverageFrequency = (): number => {
    const dataArray = getFrequencyData();
    if (!dataArray) return 0;
    
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    return sum / dataArray.length;
  };

  return {
    audioRef,
    isPlaying,
    audioInfo,
    playAudio,
    stopAudio,
    getFrequencyData,
    getAverageFrequency
  };
};