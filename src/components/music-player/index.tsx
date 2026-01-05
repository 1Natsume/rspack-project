import React, { useState, useEffect, useRef } from 'react';

const MusicPlayer = () => {
  //   const [currentMusicIndex, setCurrentMusicIndex] = useState(0);
  //   const [isPlaying, setIsPlaying] = useState(false);
  //   const [volume, setVolume] = useState(0.7);
  //   const [progress, setProgress] = useState(0);
  //   const [currentTime, setCurrentTime] = useState('0:00');
  //   const [duration, setDuration] = useState('0:00');
  //   const [showPlaylist, setShowPlaylist] = useState(true);

  //   const audioRef = useRef(null);

  //   // 初始化音频
  //   useEffect(() => {
  //     if (audioRef.current) {
  //       audioRef.current.volume = volume;

  //       const updateProgress = () => {
  //         if (audioRef.current) {
  //           const current = audioRef.current.currentTime;
  //           const total = audioRef.current.duration || 1;
  //           setProgress((current / total) * 100);

  //           // 更新时间显示
  //           const formatTime = (time) => {
  //             const minutes = Math.floor(time / 60);
  //             const seconds = Math.floor(time % 60);
  //             return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  //           };

  //           setCurrentTime(formatTime(current));
  //           if (total && !isNaN(total)) {
  //             setDuration(formatTime(total));
  //           }
  //         }
  //       };

  //       audioRef.current.addEventListener('timeupdate', updateProgress);

  //       return () => {
  //         if (audioRef.current) {
  //           audioRef.current.removeEventListener('timeupdate', updateProgress);
  //         }
  //       };
  //     }
  //   }, [volume]);

  //   // 播放/暂停
  //   const togglePlay = () => {
  //     if (audioRef.current) {
  //       if (isPlaying) {
  //         audioRef.current.pause();
  //       } else {
  //         audioRef.current.play();
  //       }
  //       setIsPlaying(!isPlaying);
  //     }
  //   };

  //   // 下一首
  //   const playNext = () => {
  //     const nextIndex = (currentMusicIndex + 1) % initialMusicList.length;
  //     setCurrentMusicIndex(nextIndex);
  //     setCurrentCharacter(nextIndex);
  //     setCurrentDialogue(dialogues[nextIndex % dialogues.length]);

  //     if (isPlaying && audioRef.current) {
  //       audioRef.current.pause();
  //       setTimeout(() => {
  //         audioRef.current.src = initialMusicList[nextIndex].file;
  //         audioRef.current.play();
  //       }, 100);
  //     } else {
  //       audioRef.current.src = initialMusicList[nextIndex].file;
  //     }

  //     setProgress(0);
  //   };

  //   // 上一首
  //   const playPrevious = () => {
  //     const prevIndex = (currentMusicIndex - 1 + initialMusicList.length) % initialMusicList.length;
  //     setCurrentMusicIndex(prevIndex);
  //     setCurrentCharacter(prevIndex);
  //     setCurrentDialogue(dialogues[prevIndex % dialogues.length]);

  //     if (isPlaying && audioRef.current) {
  //       audioRef.current.pause();
  //       setTimeout(() => {
  //         audioRef.current.src = initialMusicList[prevIndex].file;
  //         audioRef.current.play();
  //       }, 100);
  //     } else {
  //       audioRef.current.src = initialMusicList[prevIndex].file;
  //     }

  //     setProgress(0);
  //   };

  //   // 选择特定歌曲
  //   const selectMusic = (index) => {
  //     setCurrentMusicIndex(index);
  //     setCurrentCharacter(index);
  //     setCurrentDialogue(dialogues[index % dialogues.length]);

  //     if (isPlaying && audioRef.current) {
  //       audioRef.current.pause();
  //       setTimeout(() => {
  //         audioRef.current.src = initialMusicList[index].file;
  //         audioRef.current.play();
  //       }, 100);
  //     } else {
  //       audioRef.current.src = initialMusicList[index].file;
  //     }

  //     setProgress(0);
  //   };

  //   // 音量控制
  //   const handleVolumeChange = (e) => {
  //     const newVolume = parseFloat(e.target.value);
  //     setVolume(newVolume);
  //     if (audioRef.current) {
  //       audioRef.current.volume = newVolume;
  //     }
  //   };

  //   // 进度条控制
  //   const handleProgressChange = (e) => {
  //     const newProgress = parseFloat(e.target.value);
  //     setProgress(newProgress);

  //     if (audioRef.current) {
  //       const time = (newProgress / 100) * audioRef.current.duration;
  //       audioRef.current.currentTime = time;
  //     }
  //   };

  //   // 切换播放列表显示
  //   const togglePlaylist = () => {
  //     setShowPlaylist(!showPlaylist);
  //   };

  //   // 音频加载完成时设置总时长
  //   const handleLoadedMetadata = () => {
  //     if (audioRef.current) {
  //       const total = audioRef.current.duration;
  //       const minutes = Math.floor(total / 60);
  //       const seconds = Math.floor(total % 60);
  //       setDuration(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
  //     }
  //   };

  return (
    <div className="galgame-player-container">

    </div>
  );
};

export default MusicPlayer;