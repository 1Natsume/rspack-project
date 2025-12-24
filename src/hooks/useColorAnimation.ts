// hooks/useColorAnimation.ts
import { useState, useEffect, useRef } from 'react';

const COLORS = [
  '#FF5252', '#FF4081', '#E040FB', '#7C4DFF',
  '#536DFE', '#448AFF', '#40C4FF', '#18FFFF',
  '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41'
];

export const useColorAnimation = (elementCount: number, isPlaying: boolean, averageFrequency: number) => {
  const [activeElements, setActiveElements] = useState<number[]>([]);
  const animationRef = useRef<number>(0);
  const currentIndexRef = useRef(0);

  useEffect(() => {
    if (!isPlaying) {
      setActiveElements([]);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const animateColors = () => {
      // 根据音频强度调整动画速度
      const speed = Math.max(100, 500 - averageFrequency * 3);
      
      setTimeout(() => {
        if (!isPlaying) return;
        
        // 移动到下一个元素
        currentIndexRef.current = (currentIndexRef.current + 1) % elementCount;
        
        // 设置当前激活的元素（可以同时激活多个元素，形成波浪效果）
        const newActiveElements = [
          currentIndexRef.current,
          (currentIndexRef.current + 1) % elementCount,
          (currentIndexRef.current + 2) % elementCount
        ];
        
        setActiveElements(newActiveElements);
        
        animationRef.current = requestAnimationFrame(animateColors);
      }, speed);
    };

    animationRef.current = requestAnimationFrame(animateColors);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, averageFrequency, elementCount]);

  const getColorForElement = (elementId: number): string => {
    if (!activeElements.includes(elementId)) return '#333';
    
    // 根据元素在激活序列中的位置决定颜色
    const position = activeElements.indexOf(elementId);
    const colorIndex = (elementId + position) % COLORS.length;
    return COLORS[colorIndex];
  };

  return { getColorForElement, activeElements };
};