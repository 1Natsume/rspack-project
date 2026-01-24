import Article from '@/components/article';
import { configManager } from '@/utils/ConfigManager';
import React from 'react';
import { createBrowserRouter, createHashRouter } from 'react-router-dom';
// 使用 React.lazy 实现路由懒加载
const Login = React.lazy(() => import('@views/auth/login'));
const Home = React.lazy(() => import('@views/Home'));
const Blog = React.lazy(() => import('@/views/blog'));
const MainLayout = React.lazy(() => import('@layouts/MainLayout'));
const CG = React.lazy(() => import('@/views/cg'));
const Layout = React.lazy(() => import('@/layouts'));
const basename = process.env.NODE_ENV === 'production'
    ? '/newjersey'
    : '';
const ishome = configManager.get().ishome ?? false
const Main = ishome ? Home:Blog

const routers = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Main />
            },
            {
                path: 'blog',
                element: <Blog />
            },
            {
                path: 'cg',
                element: <CG />
            },
            {
                path: '/p/:id?',
                element: <Article />
            },
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