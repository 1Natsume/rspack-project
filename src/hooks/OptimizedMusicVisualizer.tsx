import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useMusicVisualization } from './useMusicVisualization';

interface OptimizedMusicVisualizerProps {
  audioSrc: string;
  elementSelectors: string[];
  mode?: 'sequential' | 'frequency' | 'beat';
  intensity?: number;
  colorPalette?: string[];
  baseColor?: string;
  transitionSpeed?: number;
  smoothness?: number;
}

const OptimizedMusicVisualizer: React.FC<OptimizedMusicVisualizerProps> = ({
  audioSrc,
  elementSelectors,
  mode = 'frequency',
  intensity = 1.5,
  colorPalette = ['#FF0080', '#00FF80', '#0080FF', '#FF8000'],
  baseColor = '#2D3748',
  transitionSpeed = 300,
  smoothness = 0.8
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [elements, setElements] = useState<HTMLElement[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedMode, setSelectedMode] = useState(mode);
  const [activeColorIndex, setActiveColorIndex] = useState(0);

  // 获取目标元素
  useEffect(() => {
    const targetElements: HTMLElement[] = [];
    
    // 通过选择器获取元素
    elementSelectors.forEach(selector => {
      const found = document.querySelectorAll<HTMLElement>(selector);
      found.forEach(el => targetElements.push(el));
    });
    
    // 为元素添加基础样式
    targetElements.forEach((element, index) => {
      element.dataset.visualIndex = index.toString();
      
      // 如果元素没有基础样式，添加一些默认样式
      if (!element.style.backgroundColor) {
        element.style.backgroundColor = baseColor;
        element.style.borderRadius = '8px';
        element.style.padding = '20px';
        element.style.margin = '10px';
        element.style.display = 'flex';
        element.style.alignItems = 'center';
        element.style.justifyContent = 'center';
        element.style.fontWeight = 'bold';
        element.style.transition = `all ${transitionSpeed}ms ease`;
      }
    });
    
    setElements(targetElements);
  }, [elementSelectors, baseColor, transitionSpeed]);

  // 使用音乐可视化钩子
  const {
    currentElementIndex,
    activeElements,
    beatDetected,
    frequencyHistory
  } = useMusicVisualization(audioRef.current, {
    elements,
    mode: selectedMode,
    intensity,
    colorPalette,
    baseColor,
    transitionSpeed,
    smoothness
  });

  // 播放音乐
  const handlePlay = useCallback(async () => {
    if (!audioRef.current) return;
    
    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('播放失败:', error);
    }
  }, []);

  // 暂停音乐
  const handlePause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  // 停止音乐
  const handleStop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, []);

  // 切换颜色方案
  const rotateColorPalette = useCallback(() => {
    setActiveColorIndex((prev) => (prev + 1) % colorPalette.length);
    
    // 将当前颜色移到首位
    const newPalette = [...colorPalette];
    const [first, ...rest] = newPalette;
    const rotated = [...rest, first];
    
    // 这里需要更新颜色方案，但受限于组件设计，暂时只更新索引
  }, [colorPalette]);

  // 手动切换到下一个元素
  const nextElement = useCallback(() => {
    const nextIndex = (currentElementIndex + 1) % elements.length;
    // 这里可以添加手动触发的视觉效果
  }, [currentElementIndex, elements.length]);

  return (
    <div className="optimized-visualizer">
      {/* 音频元素 */}
      <audio ref={audioRef} src={audioSrc} loop />
    </div>
  );
};

// 获取模式标签
const getModeLabel = (mode: string): string => {
  switch (mode) {
    case 'sequential': return '顺序切换';
    case 'frequency': return '频率触发';
    case 'beat': return '节拍触发';
    default: return mode;
  }
};

// 样式定义
const controlPanelStyle: React.CSSProperties = {
  backgroundColor: 'rgba(30, 41, 59, 0.9)',
  borderRadius: '12px',
  padding: '20px',
  marginBottom: '20px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
};

const containerStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
  gap: '15px',
  padding: '20px',
  backgroundColor: 'rgba(15, 23, 42, 0.7)',
  borderRadius: '12px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
};

const placeholderStyle: React.CSSProperties = {
  gridColumn: '1 / -1',
  textAlign: 'center',
  padding: '40px',
  color: '#94A3B8',
  fontSize: '18px',
};

export default OptimizedMusicVisualizer;