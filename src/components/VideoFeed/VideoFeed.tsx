import React, { useState, useEffect, useCallback } from 'react';
import TikTokPlayer from '../TikTokPlayer/TikTokPlayer';
import './VideoFeed.css';

export interface Video {
  id: string;
  title: string;
  description: string;
//   author: {
//     name: string;
//     avatar: string;
//     verified?: boolean;
//   };
//   music: {
//     name: string;
//     author: string;
//   };
//   likes: number;
//   comments: number;
//   shares: number;
//   saves: number;
//   timestamp: string;
  tags?: string[];
  url: string;
}

interface VideoFeedProps {
  videos: Video[];
  initialIndex?: number;
  onEndReached?: () => void;
  onVideoChange?: (videoId: string) => void;
}

const VideoFeed: React.FC<VideoFeedProps> = ({
  videos,
  initialIndex = 0,
  onEndReached,
  onVideoChange,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [touchStartY, setTouchStartY] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'up' | 'down' | null>(null);
  const [preloadVideo, setPreloadVideo] = useState<number | null>(null);

  // 预加载视频
  useEffect(() => {
    const preloadIndexes = [currentIndex];
    
    // 预加载下一个视频
    if (currentIndex + 1 < videos.length) {
      preloadIndexes.push(currentIndex + 1);
    }
    
    // 预加载上一个视频
    if (currentIndex - 1 >= 0) {
      preloadIndexes.push(currentIndex - 1);
    }
    
    setPreloadVideo(currentIndex + 1 < videos.length ? currentIndex + 1 : null);
    
    // 通知视频切换
    onVideoChange?.(videos[currentIndex].id);
  }, [currentIndex, videos, onVideoChange]);

  // 触摸事件处理
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
    setIsSwiping(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isSwiping) return;
    
    const touchY = e.touches[0].clientY;
    const diff = touchStartY - touchY;
    
    if (Math.abs(diff) > 50) {
      setSwipeDirection(diff > 0 ? 'up' : 'down');
    }
  }, [isSwiping, touchStartY]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!isSwiping) return;
    
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;
    const threshold = 100;

    if (Math.abs(diff) > threshold) {
      if (diff > 0 && currentIndex + 1 < videos.length) {
        // 向上滑动，下一个视频
        setCurrentIndex(prev => prev + 1);
      } else if (diff < 0 && currentIndex > 0) {
        // 向下滑动，上一个视频
        setCurrentIndex(prev => prev - 1);
      }
      
      // 检查是否到达底部
      if (currentIndex === videos.length - 2 && diff > threshold) {
        onEndReached?.();
      }
    }

    setIsSwiping(false);
    setSwipeDirection(null);
  }, [isSwiping, touchStartY, currentIndex, videos.length, onEndReached]);

  // 键盘控制
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (currentIndex + 1 < videos.length) {
            setCurrentIndex(prev => prev + 1);
          }
          break;
        case ' ':
          e.preventDefault();
          // 空格键切换播放/暂停
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, videos.length]);

  // 滚轮控制
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      if (e.deltaY > 0 && currentIndex + 1 < videos.length) {
        // 向下滚动，下一个视频
        setCurrentIndex(prev => prev + 1);
      } else if (e.deltaY < 0 && currentIndex > 0) {
        // 向上滚动，上一个视频
        setCurrentIndex(prev => prev - 1);
      }
    };

    const container = document.querySelector('.video-feed-container');
    // if (container) {
    //   container.addEventListener('wheel', handleWheel, { passive: false });
    // }

    // return () => {
    //   if (container) {
    //     container.removeEventListener('wheel', handleWheel);
    //   }
    // };
  }, [currentIndex, videos.length]);

  // 处理互动事件
  const handleLike = useCallback((videoId: string) => {
    console.log('Liked video:', videoId);
    // 这里可以添加API调用
  }, []);

  const handleShare = useCallback((videoId: string) => {
    console.log('Share video:', videoId);
    // 这里可以添加分享逻辑
    if (navigator.share) {
      const video = videos.find(v => v.id === videoId);
      if (video) {
        navigator.share({
          title: video.title,
          text: video.description,
          url: window.location.href,
        });
      }
    }
  }, [videos]);

  const handleSave = useCallback((videoId: string) => {
    console.log('Saved video:', videoId);
    // 这里可以添加收藏逻辑
  }, []);

  const handleComment = useCallback((videoId: string) => {
    console.log('Comment on video:', videoId);
    // 这里可以打开评论弹窗
  }, []);

  const handleFollow = useCallback((authorName: string) => {
    console.log('Follow author:', authorName);
    // 这里可以添加关注逻辑
  }, []);

  const handleVideoEnd = useCallback(() => {
    // 视频播放结束时自动切换到下一个
    if (currentIndex + 1 < videos.length) {
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 1000);
    }
  }, [currentIndex, videos.length]);

  return (
    <div 
      className="video-feed-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 滑动指示器 */}
      {swipeDirection && (
        <div className={`swipe-indicator ${swipeDirection}`}>
          {swipeDirection === 'up' ? '↑ 下一个' : '↓ 上一个'}
        </div>
      )}

      {/* 视频列表 */}
      <div className="video-feed-list">
        {videos.map((video, index) => (
          <div
            key={video.id}
            className={`video-feed-item ${
              index === currentIndex ? 'active' :
              index === preloadVideo ? 'preload' : 'inactive'
            }`}
            style={{
              transform: `translateY(${(index - currentIndex) * 100}vh)`,
            }}
          >
            <TikTokPlayer
              video={video}
              src={video.url}
              isActive={index === currentIndex}
              autoPlay={index === currentIndex}
              muted={index !== currentIndex}
              onLike={handleLike}
              onShare={handleShare}
              onSave={handleSave}
              onComment={handleComment}
              onFollow={handleFollow}
              onVideoEnd={handleVideoEnd}
              onDoubleTap={() => {
                console.log('Double tapped on video:', video.id);
              }}
            />
          </div>
        ))}
      </div>

      {/* 当前视频指示器 */}
      <div className="video-indicator">
        {videos.map((_, index) => (
          <div
            key={index}
            className={`indicator-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default VideoFeed;