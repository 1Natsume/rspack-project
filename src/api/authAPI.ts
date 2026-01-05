import { LoginCredentials, RegisterData, User } from '../hooks/use-auth/types';
import { useConfigStore } from '@/stores';
import { apiService } from '@/request/api.service';

export const authService = {
    // 获取当前用户
    getCurrentUser: async () => {
        const response = await apiService.post<User>(`/user/detail`);
        return response.data;
    },
    // 登录请求
    login: async (credentials: LoginCredentials) => {
        const response = await apiService.post('/auth/login', credentials)
        return response.data
    },
    // 注册请求
    register: async (userData: RegisterData) => {
        const response = await apiService.post(`/auth/register`, userData);
        return response;
    },
    logout: async (): Promise<void> => {
        const refreshToken = useConfigStore.getState().refreshToken
        if (refreshToken) {
            try {
                await apiService.post('/auth/logout', { refreshToken })
            } catch (error) {
                console.error('Logout API error:', error)
            }
        }
        //useAuthStore.getState().logout()
    },

    refreshToken: async (refreshToken: string): Promise<{ token: string; refreshToken?: string }> => {
        const response = await apiService.post<{ token: string; refreshToken?: string }>(
            '/auth/refreshToken',
            { refreshToken }
        )
        return response.data as { token: string; refreshToken?: string }
    },
}