import { AxiosInstance, AxiosResponse } from 'axios';
import { axiosConfig } from './axios.config';
import { configManager } from '@/utils/ConfigManager';

// API 响应格式
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  code?: string;
  message?: string;
  timestamp: number;
}

// API 请求参数
export interface ApiRequestParams {
  [key: string]: any;
}

// API Service 类
export class ApiService {
  private axiosInstance: AxiosInstance | null = null;
  
  /**
   * 初始化 API Service
   */
  async init(): Promise<void> {
    if (!this.axiosInstance) {
      this.axiosInstance = await axiosConfig.initialize();
    }
  }
  
  /**
   * 获取 axios 实例
   */
  private getInstance(): AxiosInstance {
    if (!this.axiosInstance) {
      throw new Error('API Service 未初始化，请先调用 init() 方法');
    }
    return this.axiosInstance;
  }
  
  /**
   * 发起请求
   */
  private async request<T = any>(
    method: string,
    url: string,
    data?: any,
    config?: any
  ): Promise<ApiResponse<T>> {
    await this.init();
    
    try {
      const response: AxiosResponse<T> = await this.getInstance().request({
        method,
        url,
        data,
        ...config
      });
      
      return {
        success: true,
        data: response.data,
        timestamp: Date.now()
      };
    } catch (error: any) {
      // 已经由拦截器处理过的错误
      return {
        success: false,
        code: error.code || 'UNKNOWN_ERROR',
        message: error.message || '未知错误',
        timestamp: Date.now()
      };
    }
  }
  
  /**
   * GET 请求
   */
  async get<T = any>(url: string, params?: ApiRequestParams): Promise<ApiResponse<T>> {
    return this.request<T>('GET', url, undefined, { params });
  }
  
  /**
   * POST 请求
   */
  async post<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>('POST', url, data);
  }
  
  /**
   * PUT 请求
   */
  async put<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', url, data);
  }
  
  /**
   * PATCH 请求
   */
  async patch<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', url, data);
  }
  
  /**
   * DELETE 请求
   */
  async delete<T = any>(url: string, params?: ApiRequestParams): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', url, undefined, { params });
  }
  
  /**
   * 获取完整的 URL
   */
  getFullUrl(endpoint: string, params?: Record<string, string | number>): string {
    return configManager.getFullUrl(endpoint, params);
  }
  
  /**
   * 清除缓存
   */
  clearCache(): void {
    axiosConfig.clearCache();
  }
}

// 导出单例实例
export const apiService = new ApiService();