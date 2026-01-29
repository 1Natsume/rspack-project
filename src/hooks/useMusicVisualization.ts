import { useEffect, useRef, useState, useCallback } from 'react';

interface VisualizationConfig {
    elements: HTMLElement[];
    mode: 'sequential' | 'frequency' | 'beat';
    intensity: number;
    colorPalette: string[];
    baseColor: string;
    transitionSpeed: number;
    smoothness: number;
}

interface FrequencyBands {
    bass: number;
    mid: number;
    treble: number;
}

export const useMusicVisualization = (
    audioElement: HTMLAudioElement | null,
    config: VisualizationConfig
) => {
    const [currentElementIndex, setCurrentElementIndex] = useState(0);
    const [activeElements, setActiveElements] = useState<Set<number>>(new Set());
    const [frequencyHistory, setFrequencyHistory] = useState<number[]>([]);
    const [beatDetected, setBeatDetected] = useState(false);

    const analyserRef = useRef<AnalyserNode | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const lastBeatTimeRef = useRef<number>(0);
    const energyHistoryRef = useRef<number[]>([]);
    const currentElementIndexRef = useRef(0);
    const activeElementsRef = useRef<Set<number>>(new Set());

    // 初始化音频分析器
    const initializeAudioAnalyzer = useCallback(async () => {
        if (!audioElement) return;

        try {

            // 如果初始化失败，清理资源
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close();
                audioContextRef.current = null;
            }
            analyserRef.current = null;

            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            const audioContext = new AudioContext();
            audioContextRef.current = audioContext;

            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 1024;
            analyser.smoothingTimeConstant = config.smoothness;

            const source = audioContext.createMediaElementSource(audioElement);
            source.connect(analyser);
            analyser.connect(audioContext.destination);

            analyserRef.current = analyser;
        } catch (error) {
            console.error('初始化音频分析器失败:', error);
        }
    }, [audioElement, config.smoothness]);

    // 获取频率数据并返回各个频段
    const getFrequencyData = useCallback(() => {
        if (!analyserRef.current) return null;

        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);

        // 分割频段
        const totalBins = dataArray.length;
        const bassEnd = Math.floor(totalBins * 0.1); // 0-10% 低音
        const midStart = bassEnd;
        const midEnd = Math.floor(totalBins * 0.5); // 10-50% 中音
        const trebleStart = midEnd; // 50-100% 高音

        const bassBins = Array.from(dataArray.slice(0, bassEnd));
        const midBins = Array.from(dataArray.slice(midStart, midEnd));
        const trebleBins = Array.from(dataArray.slice(trebleStart));

        return {
            data: dataArray,
            bands: {
                bass: bassBins.reduce((a, b) => a + b, 0) / bassBins.length,
                mid: midBins.reduce((a, b) => a + b, 0) / midBins.length,
                treble: trebleBins.reduce((a, b) => a + b, 0) / trebleBins.length
            }
        };
    }, []);

    // 节拍检测算法
    const detectBeat = useCallback((energy: number): boolean => {
        const now = Date.now();
        const timeSinceLastBeat = now - lastBeatTimeRef.current;

        // 保持能量历史记录
        energyHistoryRef.current.push(energy);
        if (energyHistoryRef.current.length > 60) { // 保存最近1秒的数据（假设60fps）
            energyHistoryRef.current.shift();
        }

        // 计算平均能量
        const averageEnergy = energyHistoryRef.current.reduce((a, b) => a + b, 0) / energyHistoryRef.current.length;

        // 动态阈值
        const threshold = averageEnergy * 1.3;
        const isBeat = energy > threshold && timeSinceLastBeat > 200; // 最小间隔200ms

        if (isBeat) {
            lastBeatTimeRef.current = now;
            return true;
        }

        return false;
    }, []);

    // 根据频率选择下一个元素
    const getNextElementByFrequency = useCallback((bands: FrequencyBands) => {
        const { elements } = config;
        if (elements.length === 0) return 0;

        // 根据各个频段的强度决定切换策略
        const maxValue = Math.max(bands.bass, bands.mid, bands.treble);

        if (maxValue === bands.bass) {
            // 低音强 - 跳转到特定位置（比如第一个）
            return 0;
        } else if (maxValue === bands.mid) {
            // 中音强 - 顺序移动
            return (currentElementIndex + 1) % elements.length;
        } else {
            // 高音强 - 随机或跳跃
            return (currentElementIndex + Math.floor(elements.length / 2)) % elements.length;
        }
    }, [config.elements.length, currentElementIndex]);

    // 应用颜色效果到特定元素
    const applyColorToElement = useCallback((
        element: HTMLElement,
        color: string,
        intensity: number,
        isActive: boolean
    ) => {
        if (!element) return;

        const transition = `all ${config.transitionSpeed}ms cubic-bezier(0.4, 0, 0.2, 1)`;

        if (isActive) {
            // 激活状态 - 高亮显示
            element.style.backgroundColor = color;
            //         element.style.transform = `scale(${1 + intensity * 0.2}) translateY(-5px)`;
            //         element.style.boxShadow = `
            //     0 10px 30px rgba(0, 0, 0, 0.3),
            //     0 0 ${30 * intensity}px ${color},
            //     0 0 ${60 * intensity}px ${color}40
            //   `;
            //         element.style.zIndex = '10';
            //         element.style.transition = transition;

            //         // 添加发光文本效果
            //         element.style.color = getContrastColor(color);
            //         element.style.textShadow = `0 0 10px ${color}`;
        } else {
            // 非激活状态 - 暗淡显示
            // element.style.backgroundColor = config.baseColor;
            // element.style.transform = 'scale(1)';
            // element.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
            // element.style.zIndex = '1';
            // element.style.transition = transition;
            // element.style.color = '';
            element.style = '';

        }
    }, [config.baseColor, config.transitionSpeed]);

    // 开始可视化循环
    const startVisualization = useCallback(() => {
        if (!analyserRef.current || config.elements.length === 0) return;

        const animate = () => {
            const freqData = getFrequencyData();
            if (!freqData) {
                animationFrameRef.current = requestAnimationFrame(animate);
                return;
            }

            const { bands, data } = freqData;
            const totalEnergy = (bands.bass + bands.mid + bands.treble) / 3;

            // 检测节拍
            const isBeat = detectBeat(totalEnergy);
            setBeatDetected(isBeat);

            // 更新频率历史
            setFrequencyHistory(prev => {
                const newHistory = [...prev, totalEnergy];
                return newHistory.slice(-50); // 保留最近50帧
            });

            // 根据模式选择下一个激活元素
            // 使用 ref 获取当前索引，而不是状态
            const currentIndex = currentElementIndexRef.current;
            let nextIndex = currentIndex;

            switch (config.mode) {
                case 'sequential':
                    // 顺序轮换
                    nextIndex = (currentIndex + 1) % config.elements.length;
                    break;

                case 'frequency':
                    // 频率触发切换
                    if (isBeat || totalEnergy > 100) {
                        nextIndex = (nextIndex + 1) % config.elements.length;
                    }
                    break;

                case 'beat':
                    // 节拍触发切换
                    if (isBeat) {
                        nextIndex = (currentIndex + 1) % config.elements.length;
                    }
                    break;
            }



            // 更新激活元素
            if (nextIndex !== currentIndex) {
                // 更新 ref
                currentElementIndexRef.current = nextIndex;

                // 更新状态，触发组件重新渲染（如果需要）
                setCurrentElementIndex(nextIndex);

                // 设置激活元素集合（可以同时激活多个）
                const newActive = new Set<number>();
                newActive.add(nextIndex);

                // 如果需要同时激活相邻元素
                if (totalEnergy > 150) {
                    const prevIndex = (nextIndex - 1 + config.elements.length) % config.elements.length;
                    const nextIndex2 = (nextIndex + 1) % config.elements.length;
                    newActive.add(prevIndex);
                    newActive.add(nextIndex2);
                }

                // 更新 ref 和状态
                activeElementsRef.current = newActive;
                setActiveElements(newActive);
            }

            // 使用 ref 获取激活元素，而不是状态
            const currentActiveElements = activeElementsRef.current;

            // 应用颜色到所有元素
            config.elements.forEach((element, index) => {
                const isActive = currentActiveElements.has(index);

                // 根据频段选择颜色
                let colorIndex = 0;
                if (bands.bass > bands.mid && bands.bass > bands.treble) {
                    colorIndex = 0; // 低音颜色
                } else if (bands.mid > bands.bass && bands.mid > bands.treble) {
                    colorIndex = 1; // 中音颜色
                } else {
                    colorIndex = 2; // 高音颜色
                }

                const color = config.colorPalette[colorIndex % config.colorPalette.length];

                applyColorToElement(element, color, totalEnergy / 255, isActive);
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animationFrameRef.current = requestAnimationFrame(animate);
    }, [
        config.elements,
        config.mode,
        config.colorPalette,
        currentElementIndex,
        activeElements,
        getFrequencyData,
        detectBeat,
        getNextElementByFrequency,
        applyColorToElement
    ]);

    // 清理函数
    const cleanup = useCallback(() => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }

        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
        }

        // 重置 ref
        currentElementIndexRef.current = 0;
        activeElementsRef.current = new Set();

        // 重置状态
        setCurrentElementIndex(0);
        setActiveElements(new Set());

        // 重置所有元素样式
        config.elements.forEach(element => {
            element.style.cssText = '';
        });
    }, [config.elements]);

    // 添加重置 effect
    useEffect(() => {
        // 当 elements 变化时重置
        currentElementIndexRef.current = 0;
        setCurrentElementIndex(0);
        activeElementsRef.current = new Set();
        setActiveElements(new Set());
    }, [config.elements]);


    // 初始化效果
    useEffect(() => {
        // if (!analyserRef&&audioElement && config.elements.length > 0) {
        //   initializeAudioAnalyzer();

        // }

        if (audioElement?.src) {
            initializeAudioAnalyzer();
            // 开始动画循环
            startVisualization();
        }

        return cleanup;
    }, [audioElement, audioElement?.src, config.elements.length, initializeAudioAnalyzer, cleanup]);

    return {
        currentElementIndex,
        activeElements,
        beatDetected,
        frequencyHistory,
        cleanup
    };
};

// 辅助函数：获取对比色
const getContrastColor = (hexColor: string): string => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
};