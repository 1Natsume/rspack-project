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

  const [menus,setMenus] = useState<AM[]>([]);

  useEffect(() => {

    let GetMenus = async()=>{
      setMenus(await configManager.get().menu as AM[]);
    }
    GetMenus()
  }, [])

  

  return (
    <div className="App">
      <AudioControls
        onPlay={playAudio}
        onStop={stopAudio}
        audioInfo={audioInfo}
      />

      <div className='headertop filter-dot'>
        <CustomVideo movies={["https://video.cdn.queniuqe.com/store_trailers/256982456/movie480_vp9.webm?t=1703239286"]}></CustomVideo>
        <AppMenu menu={menus}></AppMenu>
      </div>
      
      {/* 隐藏的audio元素用于引用 */}
      <audio ref={audioRef} style={{ display: 'none' }} />
    </div>
  );
};

export default Home;