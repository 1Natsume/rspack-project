// // hooks/useTokenRefresh.ts
// import { apiService } from '@/request/api.service';
// import { useAuthStore } from '@/hooks/auth/authSlice'
// import { useEffect } from 'react'

// // Token检查间隔（毫秒）
// const TOKEN_CHECK_INTERVAL = 4.5 * 60 * 1000 // 4.5分钟
// // 用户无操作超时时间（毫秒）
// const INACTIVITY_TIMEOUT = 30 * 60 * 1000 // 30分钟

// export const useTokenRefresh = () => {
//     const { token, refreshToken, logout } = useAuthStore()

//     useEffect(() => {
//         if (!token || !refreshToken) return

//         // 定期刷新Token
//         const refreshTokenInterval = setInterval(async () => {
//             try {
//                 const response = await apiService.post('/auth/refresh', { refreshToken })
//                 const { token: newToken, refreshToken: newRefreshToken } = response.data

//                 useAuthStore.getState().setToken(newToken)
//                 if (newRefreshToken) {
//                     useAuthStore.setState({ refreshToken: newRefreshToken })
//                 }

//                 console.log('Token refreshed successfully')
//             } catch (error) {
//                 console.error('Token refresh failed:', error)
//                 logout()
//             }
//         }, TOKEN_CHECK_INTERVAL)

//         // 用户无操作检查
//         const inactivityCheckInterval = setInterval(() => {
//             const lastOperationTime = parseInt(
//                 sessionStorage.getItem('lastOperationTime') || '0'
//             )
//             const now = Date.now()

//             if (now - lastOperationTime > INACTIVITY_TIMEOUT) {
//                 console.log('用户长时间无操作，自动退出')
//                 logout()
//             }
//         }, 60000) // 每分钟检查一次

//         // 监听用户操作事件
//         const updateLastOperationTime = () => {
//             sessionStorage.setItem('lastOperationTime', Date.now().toString())
//         }

//         const events = ['mousedown', 'keypress', 'scroll', 'touchstart']
//         events.forEach(event => {
//             window.addEventListener(event, updateLastOperationTime)
//         })

//         return () => {
//             clearInterval(refreshTokenInterval)
//             clearInterval(inactivityCheckInterval)
//             events.forEach(event => {
//                 window.removeEventListener(event, updateLastOperationTime)
//             })
//         }
//     }, [token, refreshToken, logout])
// }