import { AppConfig, defaultConfig } from "@/types/config";

// 配置管理类
class ConfigManager {
  private isLoaded = false;
  private config: AppConfig = { ...defaultConfig };
  
  /**
   * 加载配置
   */
  async load(): Promise<void> {
    if (this.isLoaded) return;
    
    try {
      // 1. 首先检查 window 对象是否有配置
      let externalConfig: Partial<AppConfig> = {};
      
      if (typeof window !== 'undefined') {
        // 从 window 对象读取
        if ((window as any)._config) {
          externalConfig = (window as any)._config;
        } else {
          // 尝试从 script 标签加载
          await this.loadFromScript();
          if ((window as any)._config) {
            externalConfig = (window as any)._config;
          }
        }
      }
      
      // 2. 合并配置
      this.config = this.deepMerge(this.config, externalConfig);
      
      
      console.log('[Config] 配置加载完成');
      
      this.isLoaded = true;
    } catch (error) {
      console.warn('[Config] 配置加载失败，使用默认配置:', error);
      this.isLoaded = true;
    }
  }
  
  /**
   * 从外部脚本加载配置
   */
  private loadFromScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = '/config.js';
      script.async = true;
      
      script.onload = () => {
        setTimeout(() => {
          if ((window as any)._config) {
            resolve();
          } else {
            reject(new Error('配置文件加载但未设置 APP_CONFIG'));
          }
        }, 100);
      };
      
      script.onerror = reject;
      
      // 设置超时
      setTimeout(() => {
        if (!this.isLoaded) {
          reject(new Error('配置加载超时'));
        }
      }, 5000);
      
      document.head.appendChild(script);
    });
  }
  
  /**
   * 深度合并对象
   */
  private deepMerge<T extends object>(target: T, source: Partial<T>): T {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] !== null && typeof source[key] === 'object') {
        if (target[key] !== null && typeof target[key] === 'object') {
          result[key] = this.deepMerge(target[key] as any, source[key] as any);
        } else {
          result[key] = source[key] as any;
        }
      } else if (source[key] !== undefined) {
        result[key] = source[key] as any;
      }
    }
    
    return result;
  }
  
  /**
   * 获取配置
   */
  get(): AppConfig {
    if (!this.isLoaded) {
      console.warn('[Config] 配置尚未加载，返回默认配置');
    }
    return this.config;
  }
  
  /**
   * 获取完整 URL
   */
  getFullUrl(endpoint: string, params?: Record<string, string | number>): string {
    const { baseUrl } = this.config.api;
    let url = endpoint;
    
    // 替换路径参数
    if (params) {
      Object.keys(params).forEach(key => {
        url = url.replace(`:${key}`, String(params[key]));
      });
    }
    
    // 移除未替换的参数
    url = url.replace(/\/:[^/]+/g, '');
    
    // 确保 URL 格式正确
    if (url.startsWith('/')) {
      return `${baseUrl}${url}`;
    }
    
    return `${baseUrl}/${url}`;
  }
  
  /**
   * 检查是否已加载
   */
  isReady(): boolean {
    return this.isLoaded;
  }
}

// 创建单例实例
export const configManager = new ConfigManager();