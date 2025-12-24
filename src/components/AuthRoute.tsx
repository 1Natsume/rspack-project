// // src/components/AuthRoute.tsx
// import React, { useEffect, useMemo } from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuthStore } from '@/hooks/auth/authSlice';
// import { authService } from '@/api/authAPI';
// import { User } from '@/hooks/auth';
// import AdminLayout from '@/layouts/AdminLayout';
// import { Menu } from '@/hooks/menu';

// interface AuthRouteProps {
//   requiredRoles?: string[];
//   redirectTo?: string;
//   unauthorizedRedirectTo?: string;
// }

// const AuthRoute: React.FC<AuthRouteProps> = ({
//   requiredRoles = [],
//   redirectTo = '/login',
//   unauthorizedRedirectTo = '/unauthorized'
// }) => {
//   const { isAuthenticated, user, setUser } = useAuthStore()

//   useEffect(() => {
//     let routes: Menu[] = [];
//     const fetchUser = async () => {
//       try {
//         const data = await authService.getCurrentUser();
//         setUser(data as User);
//         //location.href = '/dashboard'
//       } catch (error) {
//         localStorage.removeItem('token')
//         localStorage.removeItem('refreshToken')
//         window.location.href = '/login'
//         console.error("Fetch user failed:", error);
//       }
//     };

//     if (isAuthenticated) fetchUser();
//   }, [isAuthenticated])

//   // 如果没有token或用户数据，重定向到登录页
//   if (!isAuthenticated) {
//     return <Navigate to={redirectTo} replace />;
//   }

//   // 检查用户是否拥有所需角色
//   const hasRequiredRole = useMemo(() => {
//     if (requiredRoles.length === 0) return true;
//     return requiredRoles.some(role => user?.role?.includes(role));
//   }, [user, requiredRoles]);

//   // 检查角色权限
//   if (requiredRoles.length > 0 && !hasRequiredRole) {
//     return <Navigate to={unauthorizedRedirectTo} replace />;
//   }

//   // 所有检查通过，渲染子路由
//   return <AdminLayout />;
// };

// export default AuthRoute;