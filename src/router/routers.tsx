import Layout from '@/layouts';
import CG from '@/views/cg';
import React from 'react';
import { RouteObject } from 'react-router-dom';
// 使用 React.lazy 实现路由懒加载
const Login = React.lazy(() => import('@views/auth/login'));
const Home = React.lazy(() => import('@views/Home'));
const MainLayout = React.lazy(() => import('@layouts/MainLayout'));
const AdminLayout = React.lazy(() => import('@layouts/AdminLayout'));
// const Video = React.lazy(() => import('@/views/Video'));

const routers: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path :'CG',
        element:<CG/>
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
];

export default routers;