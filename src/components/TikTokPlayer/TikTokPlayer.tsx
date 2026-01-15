import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Hls from 'hls.js';
import './TikTokPlayer.css';

interface VideoInfo {
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
}

interface TikTokPlayerProps {
  video: VideoInfo;
  src: string;
  isActive: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  onLike: (videoId: string) => void;
  onShare: (videoId: string) => void;
  onSave: (videoId: string) => void;
  onComment: (videoId: string) => void;
  onFollow: (authorName: string) => void;
  onVideoEnd?: () => void;
  onDoubleTap?: () => void;
}

const TikTokPlayer: React.FC<TikTokPlayerProps> = ({
  video,
  src,
  isActive,
  autoPlay = true,
  muted = false,
  onLike,
  onShare,
  onSave,
  onComment,
  onFollow,
  onVideoEnd,
  onDoubleTap,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showVolumePopup, setShowVolumePopup] = useState(false);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [tapCount, setTapCount] = useState(0);

  // 初始化 HLS
  const initHLS = useCallback(() => {
    if (!videoRef.current || !isActive) return;

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        maxBufferLength: 15,
        maxMaxBufferLength: 30,
        startLevel: 0,
        autoStartLoad: true,
        startPosition: -1,
        capLevelToPlayerSize: true,
      });

      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(videoRef.current);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (autoPlay && isActive) {
          videoRef.current?.play().catch(() => {
            // 自动播放失败时静音播放
            if (videoRef.current) {
              videoRef.current.muted = true;
              videoRef.current.play();
            }
          });
        }
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              break;
          }
        }
      });

      return () => {
        if (hlsRef.current) {
          hlsRef.current.destroy();
          hlsRef.current = null;
        }
      };
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.current.src = src;
    }
  }, [src, autoPlay, isActive]);

  useEffect(() => {
    if (isActive) {
      initHLS();
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [initHLS, isActive]);

  // 双击点赞功能
  const handleDoubleTap = useCallback(() => {
    if (tapCount === 1) {
      setIsLiked(true);
      onLike(video.id);
      setShowLikeAnimation(true);
      setTimeout(() => setShowLikeAnimation(false), 1000);
      setTapCount(0);
      onDoubleTap?.();
    } else {
      setTapCount(1);
      setTimeout(() => setTapCount(0), 300);
    }
  }, [tapCount, video.id, onLike, onDoubleTap]);

  // 播放控制
  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  }, [isPlaying]);

  // 静音切换
  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  // 格式化数字
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // 格式化时间
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 进度条点击
  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    const time = percentage * duration;
    
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  }, [duration]);

  // 视频事件监听
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setDuration(video.duration || 0);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      onVideoEnd?.();
      
      // 循环播放
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      }
    };

    const handleVolumeChange = () => {
      setIsMuted(video.muted);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('volumechange', handleVolumeChange);

    // 显示临时进度条
    const showTempProgress = () => {
      setShowProgressBar(true);
      setTimeout(() => setShowProgressBar(false), 2000);
    };

    video.addEventListener('seeking', showTempProgress);
    video.addEventListener('seeked', showTempProgress);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('volumechange', handleVolumeChange);
      video.removeEventListener('seeking', showTempProgress);
      video.removeEventListener('seeked', showTempProgress);
    };
  }, [onVideoEnd]);

  // 控制面板自动隐藏
  useEffect(() => {
    if (!isActive) return;

    let timeout: NodeJS.Timeout;
    
    const resetControlsTimeout = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    const handleInteraction = () => {
      resetControlsTimeout();
    };

    resetControlsTimeout();

    window.addEventListener('touchstart', handleInteraction);
    window.addEventListener('mousemove', handleInteraction);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('mousemove', handleInteraction);
    };
  }, [isActive]);

  // 计算进度百分比
  const progressPercentage = useMemo(() => {
    return duration > 0 ? (currentTime / duration) * 100 : 0;
  }, [currentTime, duration]);

  return (
    <div 
      ref={containerRef}
      className="tiktok-player-container"
      onDoubleClick={handleDoubleTap}
      onClick={(e) => {
        if (e.target === containerRef.current) {
          togglePlay();
        }
      }}
    >
      {/* 视频元素 */}
      <video
        ref={videoRef}
        className="tiktok-video"
        playsInline
        preload="auto"
        loop
        muted={isMuted}
        // poster={video.author.avatar}
      />

      {/* 双击点赞动画 */}
      {showLikeAnimation && (
        <div className="like-animation">
          <div className="heart-animation">❤️</div>
        </div>
      )}

      {/* 顶部控制栏 */}
      <div className={`top-controls ${showControls ? 'visible' : 'hidden'}`}>
        <div className="back-button">
          <button className="control-btn">
            <span className="icon">←</span>
          </button>
        </div>
        <div className="video-info">
          <span className="video-topic">推荐</span>
          <span className="live-badge">直播</span>
        </div>
        <div className="search-button">
          <button className="control-btn">
            <span className="icon">🔍</span>
          </button>
        </div>
      </div>

      {/* 视频信息（左侧） */}
      <div className={`video-info-left ${showControls ? 'visible' : 'hidden'}`}>
        {/* <div className="author-info">
          <div className="author-avatar">
            <img src={video.author.avatar} alt={video.author.name} />
            {video.author.verified && <span className="verified-badge">✓</span>}
          </div>
          <div className="author-details">
            <h3 className="author-name">@{video.author.name}</h3>
            <button 
              className={`follow-btn ${isFollowing ? 'following' : ''}`}
              onClick={() => {
                setIsFollowing(!isFollowing);
                onFollow(video.author.name);
              }}
            >
              {isFollowing ? '已关注' : '+ 关注'}
            </button>
          </div>
        </div>

        <div className="video-description">
          <p>{video.description}</p>
        </div>

        <div className="music-info">
          <span className="music-icon">♪</span>
          <span className="music-text">
            {video.music.name} · {video.music.author}
          </span>
        </div> */}

        {video.tags && (
          <div className="video-tags">
            {video.tags.map((tag, index) => (
              <span key={index} className="tag">#{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* 交互按钮（右侧） */}
      {/* <div className={`interaction-buttons ${showControls ? 'visible' : 'hidden'}`}>
        <div className="interaction-button-group">
          <button 
            className={`interaction-btn like-btn ${isLiked ? 'active' : ''}`}
            onClick={() => {
              setIsLiked(!isLiked);
              onLike(video.id);
            }}
          >
            <span className="btn-icon">❤️</span>
            <span className="btn-count">{formatNumber(video.likes + (isLiked ? 1 : 0))}</span>
          </button>

          <button 
            className="interaction-btn comment-btn"
            onClick={() => onComment(video.id)}
          >
            <span className="btn-icon">💬</span>
            <span className="btn-count">{formatNumber(video.comments)}</span>
          </button>

          <button 
            className="interaction-btn share-btn"
            onClick={() => onShare(video.id)}
          >
            <span className="btn-icon">↪️</span>
            <span className="btn-count">{formatNumber(video.shares)}</span>
          </button>

          <button 
            className={`interaction-btn save-btn ${isSaved ? 'active' : ''}`}
            onClick={() => {
              setIsSaved(!isSaved);
              onSave(video.id);
            }}
          >
            <span className="btn-icon">⭐</span>
            <span className="btn-count">{formatNumber(video.saves + (isSaved ? 1 : 0))}</span>
          </button>
        </div>

        <div className="music-cover">
          <img src={video.author.avatar} alt="Music cover" />
        </div>
      </div> */}

      {/* 底部控制栏 */}
      <div className={`bottom-controls ${showControls ? 'visible' : 'hidden'}`}>
        <div className="progress-container" onClick={handleProgressClick}>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="time-display">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        <div className="control-buttons">
          <button className="control-btn" onClick={togglePlay}>
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          <button className="control-btn" onClick={toggleMute}>
            {isMuted ? '🔇' : '🔊'}
          </button>
        </div>
      </div>

      {/* 临时进度条（播放时显示） */}
      {showProgressBar && (
        <div className="temp-progress-bar">
          <div 
            className="temp-progress-fill" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      )}

      {/* 音量弹出框 */}
      {showVolumePopup && (
        <div className="volume-popup">
          <div className="volume-slider-container">
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : 100}
              onChange={(e) => {
                if (videoRef.current) {
                  videoRef.current.volume = parseInt(e.target.value) / 100;
                }
              }}
              className="volume-slider"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TikTokPlayer;