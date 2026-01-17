import { RouterProvider } from 'react-router-dom';

import { antdUtils } from '@/utils/antd';
import { App } from 'antd';
import { useEffect } from 'react';
import { router } from '.';


export default function RootRouterProvider() {
  const {  modal,notification,message } = App.useApp();

  useEffect(() => {
    antdUtils.setMessageInstance(message);
    antdUtils.setNotificationInstance(notification);
    antdUtils.setModalInstance(modal);
    // 移除 URL 中的 #/
    const originalPushState = window.history.pushState;
    window.history.pushState = function(...args) {
      const result = originalPushState.apply(this, args);
      // 在 hashchange 时重写 URL
      const handleHashChange = () => {
        const hash = window.location.hash.substring(2); // 移除 #/
        console.log(hash)
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
  }, [notification, message, modal]);

  return (
    <RouterProvider router={router} />
  )
}