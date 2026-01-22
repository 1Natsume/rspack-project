import React, { useEffect } from 'react';
//import '@assets/style/app.scss'
import '@/assets/app.css'
import { configManager } from './utils/ConfigManager';
import RootRouterProvider from './router/provider';
import { useConfigStore } from './stores';
import { musicPlayer } from './utils/musicplayer';

await configManager.load();

const App: React.FC = () => {
  
  const {setBg} = useConfigStore()
  
  const start = async()=>{
    // 加载配置
    
    //await musicPlayer.load()
  }

  useEffect(()=>{
    start()
    setBg(configManager.get().bg as string)
  },[])
  // const { darkMode, lang } = useGlobalStore(
  //   useSelector(['darkMode', 'lang'])
  // );

  // const { primaryColor } = useSettingStore(
  //   useSelector(['primaryColor'])
  // )

  return (
    <RootRouterProvider />
  );
}

export default App