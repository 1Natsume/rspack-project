import React, { useEffect, useRef, useState } from 'react';

interface VideoProps {
  bg?: string[];
  movies?: string[];
}

interface VideoState {
  isPlaying: boolean;
  isLoading: boolean;
  currentVideo: string;
  currentImage: string;
}

const VideoBackground: React.FC<VideoProps> = ({ bg = [], movies = [] }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<VideoState>({
    isPlaying: false,
    isLoading: false,
    currentVideo: '',
    currentImage: '',
  });

  // 获取图片尺寸
  const getImageSize = (url: string): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => {
        resolve({
          width: image.width,
          height: image.height,
        });
      };
      image.onerror = () => {
        resolve({
          width: 0,
          height: 0,
        });
      };
      image.src = url;
    });
  };

  // 调整容器高度基于图片尺寸
  const adjustContainerHeight = async (imageUrl: string) => {
    try {
      const size = await getImageSize(imageUrl);
      if (containerRef.current) {
        if (size.width > size.height) {
          containerRef.current.style.height = `${size.height / 2}px`;
        } else if (size.width < size.height) {
          containerRef.current.style.height = `${size.height / 1.4}px`;
        }
      }
    } catch (error) {
      console.error('Error adjusting container height:', error);
    }
  };

  // 随机选择视频
  const getRandomVideo = (): string => {
    if (movies.length === 0) return '';
    const randomIndex = Math.floor(Math.random() * movies.length);
    return movies[randomIndex];
  };

  // 随机选择图片
  const getRandomImage = (): string => {
    if (bg.length === 0) return '';
    const randomIndex = Math.floor(Math.random() * bg.length);
    return bg[randomIndex];
  };

  // 播放视频
  const playVideo = () => {
    if (videoRef.current) {
      // if (videoRef.current) {
      //   videoRef.current.style.height = `${window.innerHeight}px`;
      // }
      videoRef.current.play().then(() => {
        setState(prev => ({
          ...prev,
          isPlaying: true,
          isLoading: false,
        }));
      }).catch(error => {
        console.error('Error playing video:', error);
      });
    }
  };

  // 暂停视频
  const pauseVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setState(prev => ({
        ...prev,
        isPlaying: false,
      }));
    }
  };

  // 加载新视频
  const loadNewVideo = () => {
    if (movies.length === 0) return;

    setState(prev => ({
      ...prev,
      isLoading: true,
    }));

    const newVideo = getRandomVideo();
    setState(prev => ({
      ...prev,
      currentVideo: newVideo,
    }));

    if (videoRef.current) {
      videoRef.current.load();

    }
  };

  // 处理视频按钮点击
  const handleVideoButtonClick = () => {
    if (!state.currentVideo) {
      // 首次加载视频
      loadNewVideo();
    } else if (state.isPlaying) {
      pauseVideo();
    } else {
      playVideo();
    }
  };

  // 处理视频结束
  const handleVideoEnd = () => {
    setState(prev => ({
      ...prev,
      currentVideo: '',
      isPlaying: false,
      isLoading: false,
    }));
  };

  // 处理视频可以播放
  const handleVideoCanPlay = () => {
    playVideo();
  };

  // 初始化
  useEffect(() => {
    // 设置窗口高度
    const adjustHeight = () => {
      const windowHeight = window.innerHeight;
      if (containerRef.current) {
        containerRef.current.style.height = `${windowHeight}px`;

      }
      
    };

    adjustHeight();
    window.addEventListener('resize', adjustHeight);

    // 设置背景图片
    // if (bg.length > 0 && movies.length === 0) {
    //   const randomImage = getRandomImage();
    //   setState(prev => ({
    //     ...prev,
    //     currentImage: randomImage,
    //   }));
    //   adjustContainerHeight(randomImage);
    // }

    // 如果有视频，预加载一个
    if (movies.length > 0) {
      loadNewVideo();
      
    }

    return () => {
      window.removeEventListener('resize', adjustHeight);
    };
  }, []);

  // 获取按钮类名
  const getButtonClassName = (): string => {
    if (!state.currentVideo) return 'video-btn loadvideo';
    return state.isPlaying ? 'video-btn video-pause' : 'video-btn video-play';
  };

  return (
    <div className="video-container" ref={containerRef}>
      {/* <div className="centerbg" 
           style={{ backgroundImage: state.currentImage ? `url(${state.currentImage})` : 'none' }} 
      /> */}
      {state.currentVideo && (
        <video
          ref={videoRef}
          id="bgvideo"
          className="video"
          src={state.currentVideo}
          onCanPlay={handleVideoCanPlay}
          onEnded={handleVideoEnd}
          muted
          loop={false}
          playsInline
          preload="auto"
        //style={{ display: state.isPlaying ? 'block' : 'none' }}
        />
      )}

      {/* <div 
        id="bgimg" 
        style={{ 
          display: state.currentImage && !state.isPlaying ? 'block' : 'none',
          backgroundImage: state.currentImage ? `url(${state.currentImage})` : 'none'
        }} 
      /> */}

      <div
        className={getButtonClassName()}
        onClick={handleVideoButtonClick}
        style={{ display: movies.length > 0 ? 'block' : 'none' }}
      />

      <div
        className="video-add"
        style={{ display: state.isPlaying ? 'block' : 'none' }}
        onClick={loadNewVideo}
      />

      <div
        className="video-stu"
        style={{ bottom: state.isPlaying ? '-100px' : '0px' }}
      >
        {!state.isPlaying && state.currentVideo && '已暂停 ...'}
        {state.isLoading && '正在载入视频 ...'}
      </div>
    </div>
  );
};

export default VideoBackground;