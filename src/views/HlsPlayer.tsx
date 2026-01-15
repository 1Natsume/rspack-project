import React, { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';
import '@assets/HLSPlayer.css';

interface HLSPlayerProps {
  src: string;
  width?: string | number;
  height?: string | number;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  poster?: string;
  onError?: (error: Error) => void;
  onReady?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}

const HlsPlayer: React.FC<HLSPlayerProps> = ({
  src,
  width = '100%',
  height = 'auto',
  autoPlay = false,
  controls = true,
  muted = false,
  poster,
  onError,
  onReady,
  onPlay,
  onPause,
  onEnded,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(muted);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qualityLevels, setQualityLevels] = useState<Hls.Level[]>([]);
  const [currentQuality, setCurrentQuality] = useState<number>(-1);

  // 初始化 HLS
  const initHLS = useCallback(() => {
    if (!videoRef.current) return;

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
        maxBufferLength: 30,
        maxMaxBufferLength: 600,
        maxBufferSize: 60 * 1000 * 1000,
        maxBufferHole: 0.5,
        // maxSeekHole: 2,
        // seekHoleNudgeDuration: 0.01,
        maxFragLookUpTolerance: 0.2,
        liveSyncDurationCount: 3,
        liveMaxLatencyDurationCount: 10,
        enableSoftwareAES: true,
        manifestLoadingTimeOut: 10000,
        manifestLoadingMaxRetry: 6,
        manifestLoadingRetryDelay: 500,
        manifestLoadingMaxRetryTimeout: 64000,
        levelLoadingTimeOut: 10000,
        levelLoadingMaxRetry: 6,
        levelLoadingRetryDelay: 500,
        levelLoadingMaxRetryTimeout: 64000,
        fragLoadingTimeOut: 20000,
        fragLoadingMaxRetry: 6,
        fragLoadingRetryDelay: 500,
        fragLoadingMaxRetryTimeout: 64000,
        startFragPrefetch: true,
        testBandwidth: true,
      });

      hlsRef.current = hls;

      hls.loadSource(src);
      console.log(hls)
      hls.attachMedia(videoRef.current);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (autoPlay && videoRef.current) {
          videoRef.current.play().catch(e => {
            console.warn('Autoplay failed:', e);
          });
        }
        // setQualityLevels(hls.levels);
        onReady?.();
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
        setCurrentQuality(data.level);
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
              destroyHLS();
              setError('播放器发生致命错误，请刷新页面重试');
              onError?.(new Error('HLS fatal error'));
              break;
          }
        }
        console.error('HLS error:', data);
      });

      return () => {
        destroyHLS();
      };
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari 原生支持 HLS
      videoRef.current.src = src;
      onReady?.();
    } else {
      setError('您的浏览器不支持 HLS 播放');
      onError?.(new Error('Browser does not support HLS'));
    }
  }, [src, autoPlay, onReady, onError]);

  const destroyHLS = () => {
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
  };

  useEffect(() => {
    initHLS();
    return destroyHLS;
  }, [initHLS]);

  // 播放/暂停控制
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  // 音量控制
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  // 静音切换
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // 播放进度控制
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  // 全屏切换
  const toggleFullscreen = () => {
    if (!videoRef.current) return;

    if (!isFullscreen) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // 质量切换
  const changeQuality = (level: number) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = level;
      setCurrentQuality(level);
    }
  };

  // 格式化时间显示
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // 视频事件处理
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setDuration(video.duration || 0);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      onPlay?.();
    };

    const handlePause = () => {
      setIsPlaying(false);
      onPause?.();
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onEnded?.();
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [onPlay, onPause, onEnded]);

  return (
    <div className="hls-player-container" style={{ width, height }}>
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>刷新页面</button>
        </div>
      )}

      <video
        ref={videoRef}
        className="hls-video"
        poster={poster}
        controls={false}
        playsInline
        preload="auto"
        crossOrigin="anonymous"
      />

      <div className="controls-overlay">
        {/* 播放/暂停按钮 */}
        <button className="control-btn play-pause" onClick={togglePlay}>
          {isPlaying ? '❚❚' : '▶'}
        </button>

        {/* 进度条 */}
        <div className="progress-container">
          <input
            type="range"
            className="progress-bar"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            style={{ width: '100%' }}
          />
          <div className="time-display">
            <span>{formatTime(currentTime)}</span>
            <span> / {formatTime(duration)}</span>
          </div>
        </div>

        {/* 音量控制 */}
        <div className="volume-control">
          <button className="control-btn mute-btn" onClick={toggleMute}>
            {isMuted ? '🔇' : volume > 0.5 ? '🔊' : '🔉'}
          </button>
          <input
            type="range"
            className="volume-slider"
            min="0"
            max="1"
            step="0.1"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
          />
        </div>

        {/* 质量选择 */}
        {qualityLevels.length > 0 && (
          <div className="quality-selector">
            <select
              value={currentQuality}
              onChange={(e) => changeQuality(parseInt(e.target.value))}
              className="quality-dropdown"
            >
              <option value={-1}>自动</option>
              {qualityLevels.map((level, index) => (
                <option key={index} value={index}>
                  {level.height}p
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 全屏按钮 */}
        <button className="control-btn fullscreen-btn" onClick={toggleFullscreen}>
          {isFullscreen ? '⤢' : '⤡'}
        </button>
      </div>
    </div>
  );
};

export default HlsPlayer;