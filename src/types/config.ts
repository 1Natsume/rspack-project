export interface AppMenu{
  name:string;
  title:string;
  icon?:string;
  path:string;
}

export interface AppConfig {
  // API 相关配置
  api: {
    baseUrl: string;
    timeout: number;
    authHeader: string;
    imageUrl: string;
  };
  
  // 应用配置
  app: {
    name: string;
    version: string;
    environment: 'development' | 'staging' | 'production';
    debug: boolean;
  };

  menu?:AppMenu[]
}

// 默认配置（开发环境）
export const defaultConfig: AppConfig = {
  api: {
    baseUrl: 'http://localhost:3000',
    timeout: 30000,
    authHeader: 'Authorization',
    imageUrl: 'http://localhost:3000',
  },
  app: {
    name: 'My React App',
    version: '1.0.0',
    environment: 'development',
    debug: true
  },
};