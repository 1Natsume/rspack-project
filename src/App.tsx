import React, { useEffect } from 'react';
import '@/assets/app.css'
import { configManager } from './utils/ConfigManager';
import RootRouterProvider from './router/provider';
import { useConfigStore } from './stores';

const App: React.FC = () => {

  const { setBg } = useConfigStore()

  const start = async () => {
    // 加载配置
    setBg(configManager.get().bg as string)
  }

  useEffect(() => {
    start()
  }, [])

  return (
    <RootRouterProvider />
  );
}

export default App