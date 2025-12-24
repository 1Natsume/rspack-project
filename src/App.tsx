import React from 'react';
import { router } from './router'
import { RouterProvider } from 'react-router-dom';
//import '@assets/style/app.scss'
import '@/assets/app.css'
import { configManager } from './utils/ConfigManager';

// 加载配置
await configManager.load();

const App: React.FC = () => {
  // const { darkMode, lang } = useGlobalStore(
  //   useSelector(['darkMode', 'lang'])
  // );

  // const { primaryColor } = useSettingStore(
  //   useSelector(['primaryColor'])
  // )

  return (
    <RouterProvider router={router} />
  );
}

export default App