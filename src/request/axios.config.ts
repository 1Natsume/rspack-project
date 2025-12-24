import { useconfigStore } from '@/stores/config';
import { AppConfig } from '@/types/config';
import { configManager } from '@/utils/ConfigManager';
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosError
} from 'axios';
import { apiService } from './api.service';

// 请求缓存
interface CacheItem {
  data: any;
  timestamp: number;
  expires: number;
}

class ApiCache {
  private cache = new Map<string, CacheItem>();
  
  set(key: string, data: any, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expires: Date.now() + ttl
    });
  }
  
  get(key: string): any {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }
  
  delete(key: string): void {
    this.cache.delete(key);
  }
  
  clear(): void {
    this.cache.clear();
  }
}

// 创建 axios 实例的配置
export class AxiosConfig {
  private instance: AxiosInstance | null = null;
  private cache: ApiCache;
  private config: AppConfig;
  
  constructor() {
    this.cache = new ApiCache();
    this.config = configManager.get();
  }
  
  /**
   * 初始化 axios 实例
   */
  async initialize(): Promise<AxiosInstance> {
    // 确保配置已加载
    if (!configManager.isReady()) {
      await configManager.load();
      this.config = configManager.get();
    }
    
    if (this.instance) {
      return this.instance;
    }
    
    // 创建 axios 实例
    this.instance = axios.create({
      baseURL: this.config.api.baseUrl,
      timeout: this.config.api.timeout,
      //withCredentials: this.config.api.withCredentials,
      //headers: this.config.api.headers
    });
    
    // 设置请求拦截器
    this.setupRequestInterceptors();
    
    // 设置响应拦截器
    this.setupResponseInterceptors();
    
    return this.instance;
  }
  
  /**
   * 设置请求拦截器
   */
  private setupRequestInterceptors(): void {
    if (!this.instance) return;
    
    this.instance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const cfg = configManager.get();
        
        // 添加请求时间戳
        config.headers['X-Request-Timestamp'] = Date.now();
        config.headers['X-App-Version'] = cfg.app.version;
        config.headers['X-Environment'] = cfg.app.environment;

        const token = useconfigStore.getState().token
        if (token) {
          //config.headers = config.headers || {};
          config.headers.Authorization = `${token}`;
        }
        
        // 如果是调试模式，添加日志
        if (cfg.app.debug) {
          console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
            data: config.data,
            params: config.params
          });
        }
        
        // 检查缓存
        // if (cfg.features.enableCache && config.method?.toLowerCase() === 'get') {
        //   const cacheKey = this.getCacheKey(config);
        //   const cachedData = this.cache.get(cacheKey);
          
        //   if (cachedData) {
        //     // 中断请求并返回缓存数据
        //     return {
        //       ...config,
        //       adapter: () => Promise.resolve({
        //         data: cachedData,
        //         status: 200,
        //         statusText: 'OK',
        //         headers: {},
        //         config: config
        //       })
        //     };
        //   }
        // }
        
        return config;
      },
      (error: AxiosError) => {
        const cfg = configManager.get();
        if (cfg.app.debug) {
          console.error('[API Request Error]', error);
        }
        return Promise.reject(error);
      }
    );
  }
  
  /**
   * 设置响应拦截器
   */
  private setupResponseInterceptors(): void {
    if (!this.instance) return;
    
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        const cfg = configManager.get();
        
        // 缓存 GET 请求响应
        // if (cfg.features.enableCache && 
        //     response.config.method?.toLowerCase() === 'get') {
        //   const cacheKey = this.getCacheKey(response.config);
        //   this.cache.set(cacheKey, response.data, cfg.cache.ttl);
        // }
        
        if (cfg.app.debug) {
          console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
            data: response.data,
            status: response.status
          });
        }
        
        return response;
      },
      async (error: AxiosError) => {
        const cfg = configManager.get();
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
        
        // 日志记录
        if (cfg.app.debug) {
          console.error('[API Response Error]', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            message: error.message
          });
        }
        
        // 重试逻辑
        // if (cfg.features.enableRetry && 
        //     error.response && 
        //     cfg.retry.statusCodes.includes(error.response.status) &&
        //     !originalRequest._retry) {
          
        //   originalRequest._retry = true;
          
        //   // 延迟后重试
        //   await this.delay(cfg.retry.delay);
          
        //   if (this.instance) {
        //     return this.instance(originalRequest);
        //   }
        // }
        
        // 错误处理
        return Promise.reject(this.handleError(error));
      }
    );
  }
  
  /**
   * 获取缓存键
   */
//   private getCacheKey(config: InternalAxiosRequestConfig): string {
//     const cfg = configManager.get();
//     const baseKey = `${config.method}:${config.url}:${JSON.stringify(config.params)}:${JSON.stringify(config.data)}`;
//     return `${cfg.cache.prefix}${btoa(baseKey)}`;
//   }
  
  /**
   * 延迟函数
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  /**
   * 错误处理
   */
  private async handleError(error: AxiosError): Promise<any> {
    const cfg = configManager.get();

    if (error.response) {
      // 服务器返回错误
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          try {
            // 尝试刷新token
            const res = apiService.post('/auth/refreshToken')
            const newToken = (await res).data.token

            // 存储新token
            localStorage.setItem('token', newToken)

            // 重试当前请求
            //return apiService(config as InternalAxiosRequestConfig)
          } catch (refreshError) {
            // 刷新token失败，退出登录
            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')
            window.location.href = '/login'
            return Promise.reject(refreshError)
          }
          // return {
          //   code: 'UNAUTHORIZED',
          //   message: '未授权，请重新登录',
          //   data,
          //   originalError: error
          // };
        case 403:
          return {
            code: 'FORBIDDEN',
            message: '访问被拒绝',
            data,
            originalError: error
          };
        case 404:
          return {
            code: 'NOT_FOUND',
            message: '资源不存在',
            data,
            originalError: error
          };
        case 500:
          return {
            code: 'SERVER_ERROR',
            message: '服务器内部错误',
            data,
            originalError: error
          };
        default:
          return {
            code: `HTTP_${status}`,
            message: `请求错误 (${status})`,
            data,
            originalError: error
          };
      }
    } else if (error.request) {
      // 请求发送但无响应
      return {
        code: 'NETWORK_ERROR',
        message: '网络错误，请检查连接',
        originalError: error
      };
    } else {
      // 请求配置错误
      return {
        code: 'REQUEST_ERROR',
        message: '请求配置错误',
        originalError: error
      };
    }
  }
  
  /**
   * 清除缓存
   */
  clearCache(): void {
    this.cache.clear();
  }
  
  /**
   * 获取 axios 实例
   */
  getInstance(): AxiosInstance | null {
    return this.instance;
  }
}

// 导出单例实例
export const axiosConfig = new AxiosConfig();