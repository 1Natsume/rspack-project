import { configManager } from '@/utils/ConfigManager';
import { Music, musicPlayer } from '@/utils/musicplayer';
import React, { useState, useEffect, useRef } from 'react';
import Modal from '../modal';
import { useAudioAnalyzer } from '@/hooks/useAudioAnalyzer';
import { useColorAnimation } from '@/hooks/useColorAnimation';

const MusicPlayer = () => {
  const [currentMusicIndex, setCurrentMusicIndex] = useState(0);
  const [currentMusic, setCurrentMusic] = useState<Music | null>(null);
  const [Playlist, setPlaylist] = useState<Music[] | null>(null);

  //const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [showPlaylist, setShowPlaylist] = useState(false);

  //const audioRef = useRef<HTMLAudioElement>(null);

  const {
      audioRef,
      isPlaying,
      audioInfo,
      playAudio,
      stopAudio,
      getFrequencyData,
      getAverageFrequency
    } = useAudioAnalyzer();

  //const { getColorForElement } = useColorAnimation(10, !isPlaying, averageFrequency);

  const load = async () => {
    var res = await musicPlayer.load()
    setPlaylist(res);
    setCurrentMusic(res[currentMusicIndex]);
  }

  const ll = () =>{
    var ids = document.querySelectorAll('.cg-item')
    console.log(getAverageFrequency())
    // ids.forEach((val,i)=>(
      
    //   val.classList.add('bg-['+getColorForElement(i)+']')
    // ))
  }

  // 初始化音频
  useEffect(() => {
    load();
    if (audioRef.current) {
      audioRef.current.volume = volume;

      const updateProgress = () => {
        if (audioRef.current) {
          const current = audioRef.current.currentTime;
          const total = audioRef.current.duration || 1;
          setProgress((current / total) * 100);

          // 更新时间显示
          const formatTime = (time: number) => {
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60);
            return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
          };

          ll()

          setCurrentTime(formatTime(current));
          if (total && !isNaN(total)) {
            setDuration(formatTime(total));
          }
        }
      };

      audioRef.current.addEventListener('timeupdate', updateProgress);
      
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('timeupdate', updateProgress);
        }
      };
    }
  }, [volume]);

  // 播放/暂停
  // const togglePlay = () => {
  //   if (audioRef.current) {
  //     if (isPlaying) {
  //       audioRef.current.pause();
  //     } else {
  //       audioRef.current.play();
  //     }
  //     setIsPlaying(!isPlaying);
  //   }
  // };

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

  // 选择特定歌曲
  const selectMusic = (item: Music, index: number) => {
    setCurrentMusicIndex(index);
    setCurrentMusic(item);

    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.src = item.url;
      //audioRef.current.play();
      playAudio(audioRef.current)
      
    } else {

    }

    setProgress(0);
  };

  // 音量控制
  const handleVolumeChange = (e: { target: { value: string; }; }) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // 进度条控制
  const handleProgressChange = (e: { target: { value: string; }; }) => {
    const newProgress = parseFloat(e.target.value);
    setProgress(newProgress);

    if (audioRef.current) {
      const time = (newProgress / 100) * audioRef.current.duration;
      audioRef.current.currentTime = time;
    }
  };

  // 切换播放列表显示
  const togglePlaylist = () => {
    setShowPlaylist(!showPlaylist);
  };

  // 音频加载完成时设置总时长
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      const total = audioRef.current.duration;
      const minutes = Math.floor(total / 60);
      const seconds = Math.floor(total % 60);
      setDuration(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
    }
  };

  return (
    <div className="player-container">
      <div className="fixed bottom-0 right-1 text-white">
        <div onClick={() => setShowPlaylist(true)}>
          {currentMusic?.title}
        </div>
      </div>

      <Modal isOpen={showPlaylist} onClose={() => setShowPlaylist(false)}>
        <div>
          <ul>
            {
              Playlist?.map((item, index) => (
                <li className={index == currentMusicIndex ?
                  'border-l-2 border-l-[#f57878] h-8 p-2 mt-2' : 'border-l-2 border-l-indigo-500/100 h-8 p-2 mt-2'}
                  onClick={() => selectMusic(item, index)}
                  key={index}
                >
                  {item.title} - {item.author}
                </li>
              ))
            }
          </ul>

        </div>
      </Modal>

      {/* 隐藏的audio元素用于引用 */}
      <audio ref={audioRef} style={{ display: 'none' }} />
    </div>

  );
};

export default MusicPlayer;