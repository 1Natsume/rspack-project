import React, { useEffect } from 'react';
//import '@assets/style/app.scss'
import '@/assets/app.css'
import { configManager } from './utils/ConfigManager';
import RootRouterProvider from './router/provider';
import { useConfigStore } from './stores';

// 加载配置
await configManager.load();

const App: React.FC = () => {
  const config = configManager.get()
  const {setBg} = useConfigStore()
  

  useEffect(()=>{
    setBg(config.bg as string)
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