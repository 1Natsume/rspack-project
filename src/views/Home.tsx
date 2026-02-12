import CustomVideo from '@/components/CustomVideo';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei';

import AppMenu from '@/components/AppMenu';
import { configManager } from '@/utils/ConfigManager';
import { AppMenu as AM } from '@/types/config';
import HlsPlayer from '../components/HlsPlayer';
import VideoFeed, { Video } from '@/components/VideoFeed/VideoFeed';
import GLTFModel from '@/components/GLTFModel';


const Home = () => {

  const [menus, setMenus] = useState<AM[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [environment, setEnvironment] = useState<'studio' | 'sunset' | 'night' | 'city'>('studio');
  const [autoRotate, setAutoRotate] = useState(false);

  useEffect(() => {

    let GetMenus = async () => {
      setMenus(await configManager.get().menu as AM[]);
    }
    GetMenus()

    // const fetchVideos = async () => {
    //         try {
    //             const response = await fetch("http://8.209.221.116:8000/video/");
    //             if (!response.ok) throw new Error('Failed to fetch videos');
    //             const data = await response.json();
    //             setVideos(data);
    //         } catch (error) {
    //             console.error('Error fetching videos:', error);
    //             setVideos([]);
    //         }
    //     };

    //     fetchVideos();
  }, [])



  return (
    <div className="App">
      <div className='headertop filter-dot'>
        <CustomVideo movies={configManager.get().movies}></CustomVideo>
        <AppMenu menu={menus}></AppMenu>

        {/* <GLTFModel
          url={'./ams/鸣潮-爱弥斯.gltf'}
          scale={5}
          position={[0, -4, 0]}
          enableControls={true}
          autoPlayAnimations={true}
        /> */}

      </div>
      {/* <div className="player-section">
        <div className="player-container">
          <HlsPlayer src='http://127.0.0.1:8000/hls/stream/639c939d0710/'></HlsPlayer>
        </div>
      </div> */}

      {/* <VideoFeed videos={videos}/> */}
    </div>
  );
};

export default Home;