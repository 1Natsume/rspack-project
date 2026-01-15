import CustomVideo from '@/components/CustomVideo';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber'
import Model from './Model';
import { OrbitControls } from '@react-three/drei';
import AudioControls from '@/components/AudioControls';
import { useAudioAnalyzer } from '@/hooks/useAudioAnalyzer';
import { useColorAnimation } from '@/hooks/useColorAnimation';
import AppMenu from '@/components/AppMenu';
import { configManager } from '@/utils/ConfigManager';
import { AppMenu as AM } from '@/types/config';
import HlsPlayer from './HlsPlayer';
import VideoFeed, { Video } from '@/components/VideoFeed/VideoFeed';

const Home = () => {
  const {
    audioRef,
    isPlaying,
    audioInfo,
    playAudio,
    stopAudio,
    getFrequencyData,
    getAverageFrequency
  } = useAudioAnalyzer();

  const averageFrequency = getAverageFrequency();
  const { getColorForElement } = useColorAnimation(8, isPlaying, averageFrequency);

  const [menus, setMenus] = useState<AM[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {

    let GetMenus = async () => {
      setMenus(await configManager.get().menu as AM[]);
    }
    GetMenus()

    const fetchVideos = async () => {
            try {
                const response = await fetch("http://8.209.221.116:8000/video/");
                if (!response.ok) throw new Error('Failed to fetch videos');
                const data = await response.json();
                setVideos(data);
            } catch (error) {
                console.error('Error fetching videos:', error);
                setVideos([]);
            }
        };

        fetchVideos();
  }, [])



  return (
    <div className="App">
      <AudioControls
        onPlay={playAudio}
        onStop={stopAudio}
        audioInfo={audioInfo}
      />

      {/* <div className='headertop filter-dot'>
        <CustomVideo movies={["https://video.cdn.queniuqe.com/store_trailers/256982456/movie480_vp9.webm?t=1703239286"]}></CustomVideo>
        <AppMenu menu={menus}></AppMenu>
      </div> */}
      {/* <div className="player-section">
        <div className="player-container">
          <HlsPlayer src='http://127.0.0.1:8000/hls/stream/639c939d0710/'></HlsPlayer>
        </div>
      </div> */}

      <VideoFeed videos={videos}/>


      {/* 隐藏的audio元素用于引用 */}
      <audio ref={audioRef} style={{ display: 'none' }} />
    </div>
  );
};

export default Home;