import React from 'react';
import { createBrowserRouter, createHashRouter } from 'react-router-dom';
// 使用 React.lazy 实现路由懒加载
const Login = React.lazy(() => import('@views/auth/login'));
const Home = React.lazy(() => import('@views/Home'));
const Blog = React.lazy(() => import('@/views/blog'));
const MainLayout = React.lazy(() => import('@layouts/MainLayout'));
const CG = React.lazy(() => import('@/views/cg'));
const Layout = React.lazy(() => import('@/layouts'));
// const Video = React.lazy(() => import('@/views/Video'));
const basename = process.env.NODE_ENV === 'production'
    ? '/newjersey'
    : '';

const routers = createHashRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: 'blog',
                element: <Blog />
            },
            {
                path: 'cg',
                element: <CG />
            }
        ],
    },
    // {
    //   path: '*',
    //   element: <Layout/>,
    //   children: [],
    // },
    // {
    //   path: '/login',
    //   element: <Login />,
    // },
]);

export default routers;