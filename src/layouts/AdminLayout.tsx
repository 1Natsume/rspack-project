import React, { ComponentType, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import CustomMenu from '@/components/menu/CustomMenu'
import { useConfigStore } from '@/stores/config';
import { Menu } from '@/types/menu';
import { KeepAliveTab, Tab, useTabs } from '@/types/tab';
import DraggableTab from '@/components/Tab/DraggableTab';
import User from '@/layouts/header/user';
import { Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useMatchRoute } from '@/hooks/use-match-router';
import { router } from '@/router';
import { useUserDetail } from './common/use-user-detail';
import { useUserStore } from '@/stores/user';


const AdminLayout = () => {
  // const { tabs, setTab, setTabs } = tabSlice();
  const { loading } = useUserDetail();
  const {
    activeTabRoutePath,
    tabs = [],
    closeTab,
    refreshTab,
    closeOtherTab,
    setTabs,
  } = useTabs();

  const { collapsed, setCollapsed } = useConfigStore();
  // 当前激活的页签key
  const [activeTab, setActiveTab] = useState('');
  const { user } = useUserStore()
  const menus = user?.permissions;
  const navigate = useNavigate()
  const location = useLocation()
  const hasMounted = useRef(false);
  const matchRoute = useMatchRoute()

  // 路由变化时处理标签页
  useEffect(() => {
    if (hasMounted.current) return;
    hasMounted.current = true;

  }, [location.pathname])

  // 处理菜单点击
  const handleMenuSelect = (item: Menu) => {
    if (item.children) {

    }
    else {
      
      setActiveTab(item.id);
      navigate(item.path);
    }

  }

  // 关闭页签
  const onTabEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: 'add' | 'remove',
  ) => {
    if (action === 'remove') {
      closeTab(targetKey as string);
    }
  };

  const tabItems = useMemo(() => {
    return tabs.map(tab => {
      return {
        key: tab.routePath,
        label: tab.title,
        children: (
          <div
            key={tab.key}
            className='overflow-y-auto'
          >
              {tab.children}
          </div>
        ),
        closable: tabs.length > 1, // 剩最后一个就不能删除了
      }
    })
  }, [tabs]);


   const onTabsChange = useCallback((tabRoutePath: string) => {
    router.navigate(tabRoutePath);
  }, []);

  return (
    <div className='relative isolate flex min-h-svh w-full bg-white max-lg:flex-col lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950'>
      <div className={collapsed ? 'h-full w-20' : 'h-full w-64 lg:w-48 menu-slide bg-transparent transition-all top-header fixed box-border left-0 bottom-0 overflow-y-auto px-[16px] max-md:hidden dark:text-white bg-white'}>
        <div className="h-10"></div>
        <CustomMenu
          items={menus}
          onSelect={handleMenuSelect}
          activeKey={activeTab}
        />
      </div>
      <main className={collapsed ? 'flex flex-1 flex-col pb-2' : 'flex flex-1 flex-col pb-2 lg:min-w-0 lg:pt-2 lg:pr-2 lg:pl-64'}>
        <div className='h-16 bg-white ml-4 mr-4 '>
          <div className="flex items-stretch h-full">
            <div className='w-14 self-center'>
              <div className='text-center' onClick={() => setCollapsed(!collapsed)}>
                <i className={collapsed ? 'fas fa-indent fa-fw fa-lg' : 'fas fa-outdent fa-fw fa-lg'}></i>
              </div>
            </div>
            <div className='w-64 flex items-stretch'>

            </div>
            <div className='w-32'>
              <User></User>
            </div>
          </div>
          <div className='w-100 flex items-stretch mt-5'>
            {tabs ? <DraggableTab tabs={tabItems} activeTab={activeTab}
              onTabsChange={onTabsChange}
              onClose={onTabEdit} /> : <Outlet />}
          </div>
        </div>
      </main>
    </div>
  );
};
export default AdminLayout;