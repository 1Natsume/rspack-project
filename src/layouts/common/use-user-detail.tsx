import Result404 from '@/components/exception/404';
import { authService } from '@/api/authAPI';
import { Menu, MenuType } from '@/types/menu';
// import { useWebSocketMessage } from '@/hooks/use-websocket';
import { router } from '@/router';
import { replaceRoutes } from '@/router/router-utils';
//import { useGlobalStore } from '@/stores/global';
// import { SocketMessage, useMessageStore } from '@/stores/message';
//import { useUserStore } from '@/stores/user';
import { pages } from '@/utils/pages';
import { useRequest, useUpdateEffect } from 'ahooks';
import { lazy, useEffect, useState } from 'react';
import { useConfigStore } from '@/stores';
import { useUserStore } from '@/stores/user';
import { User } from '@/types/auth/types';

export type CurrentUser = User & { flatMenus: Menu[], menus: Menu[], authList: string[] }

export function useUserDetail() {
  const [loading, setLoading] = useState(true);

  const { refreshToken, token} = useConfigStore()
  const { setUser } = useUserStore();
  //   const { setLatestMessage } = useMessageStore();

  // 当获取完用户信息后，手动连接
  //   const { latestMessage, connect, disconnect } = useWebSocketMessage(
  //     `${window.location.protocol.replace('http', 'ws')}//${window.location.host}/ws/?token=${token}`,
  //     { manual: true }
  //   );

  const { data: currentUserDetail, loading: requestLoading } = useRequest(
    authService.getCurrentUser,
    {
      refreshDeps: [refreshToken],
      onError: () => {
        router.navigate('/login');
      }
    }
  );

  useEffect(() => {
    if (!currentUserDetail) return;

    setLoading(true);

    function formatMenus(
      menus: Menu[],
      menuGroup: Record<string, Menu[]>,
      routes: Menu[],
      parentMenu?: Menu
    ): Menu[] {
      return menus.map(menu => {
        const children = menuGroup[menu.id!];

        const parentPaths = parentMenu?.parentPaths || [];
        const lastPath = parentPaths[parentPaths.length - 1];
        const path = (parentMenu ? `${lastPath}${menu.path}` : menu.path) || '';

        routes.push({
          ...menu,
          path,
          parentPaths,
        });

        return {
          ...menu,
          path,
          parentPaths,
          children: children?.length ? formatMenus(children, menuGroup, routes, {
            ...menu,
            parentPaths: [...parentPaths, path || ''].filter(o => o),
          }) : undefined,
        };
      });
    }

    const { menus = [],permissions } = currentUserDetail as CurrentUser;

    const menuGroup = permissions?.reduce<Record<string, Menu[]>>((prev, menu) => {
      if (!menu.parentId) {
        return prev;
      }

      if (!prev[menu.parentId]) {
        prev[menu.parentId] = [];
      }

      prev[menu.parentId].push(menu);
      return prev;
    }, {}) as Record<string, Menu[]>;

    const routes: Menu[] = [];

    const currentUser: CurrentUser = {
      ...currentUserDetail,
      flatMenus: routes,
      menus: formatMenus(permissions?.filter((o: { parentId: any; }) => !o.parentId) as Menu[], menuGroup, routes),
      authList: menus
        .filter((menu) => menu.type === MenuType.Button && menu.authCode)
        .map((menu: { authCode: any; }) => menu.authCode!),
    };

    // replaceRoutes('*', [
    //   ...routes.map(menu => {
    //     return ({
    //       path: `/*${menu.path}`,
    //       id: `/*${menu.path}`,
    //       Component: menu.filePath ? pages[menu.filePath] ? lazy(pages[menu.filePath]) : Result404 : Result404,
    //       handle: {
    //         parentPaths: menu.parentPaths,
    //         path: menu.path,
    //         name: menu.title,
    //         icon: menu.icon,
    //       },
    //     })
    //   }), {
    //     id: '*',
    //     path: '*',
    //     Component: Result404,
    //     handle: {
    //       path: '404',
    //       name: '404',
    //     },
    //   }
    // ]);

    setUser(currentUser);

    // replace一下当前路由，为了触发路由匹配
    router.navigate(`${location.pathname}${location.search}`, { replace: true });

    setLoading(false);

    // connect && connect();
  }, [currentUserDetail, setUser]);


  //   useUpdateEffect(() => {
  //     if (latestMessage?.data) {
  //       try {
  //         const socketMessage = JSON.parse(latestMessage?.data) as SocketMessage;
  //         setLatestMessage(socketMessage)
  //       } catch {
  //         console.error(latestMessage?.data);
  //       }
  //     }
  //   }, [latestMessage]);

  //   useUpdateEffect(() => {
  //     if (token) {
  //       connect && connect();
  //     }
  //   }, [token])

  return {
    loading: requestLoading || loading,
    //disconnectWS: disconnect,
  }
}