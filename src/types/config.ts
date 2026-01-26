export interface AppMenu {
  name: string;
  title: string;
  icon?: string;
  path: string;
}

export interface AppConfig {
  // API 相关配置
  api?: {
    baseUrl: string;
    timeout: number;
    authHeader: string;
    imageUrl: string;
  };

  // 应用配置
  app?: {
    name: string;
    version: string;
    environment: 'development' | 'staging' | 'production';
    debug: boolean;
  };

  menu?: AppMenu[],
  bg?: string,
  ishome?: boolean,
  logo?: string,
  music?: {
    enable: boolean;
    server: 'netease';
    type: 'playlist';
    id: string;
  },
  movies?:[]
}