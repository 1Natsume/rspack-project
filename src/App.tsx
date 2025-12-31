import React, { useEffect } from 'react';
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

  useEffect(() => {
    // 移除 URL 中的 #/
    const originalPushState = window.history.pushState;
    window.history.pushState = function(...args) {
      const result = originalPushState.apply(this, args);
      // 在 hashchange 时重写 URL
      const handleHashChange = () => {
        const hash = window.location.hash.substring(2); // 移除 #/
        if (hash && !hash.startsWith('#')) {
          const newUrl = `${window.location.pathname}${hash ? '/' + hash : ''}`;
          window.history.replaceState({}, '', newUrl);
        }
      };
      
      window.addEventListener('hashchange', handleHashChange);
      return result;
    };
    
    return () => {
      window.history.pushState = originalPushState;
    };
  }, []);

  return (
    <RouterProvider router={router} />
  );
}

export default App