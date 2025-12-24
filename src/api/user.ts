import { apiService } from '@/request/api.service';

export const getuserlist = async (data: any) => {
    const response = await apiService.post(`/user/getUserList`, data);
    return response;
};

export const getrolelist = async () => {
    const response = await apiService.post(`/role/getRoleList`);
    return response;
};

export const getMenusByRoleId = async (roleId: string) => {
    const data = {
        roleId: roleId
    }
    const response = await apiService.post(`/role/getRoleMenuList`, data);
    return response;
};

export const getmenulist = async () => {
    const response = await apiService.post(`/menu/getMenuTree`);
    return response;
};

export const getmenutree = async () => {
    const response = await apiService.post(`/menu/getMenuTree`);
    return response;
};

export const role_allocMenu = async (ids: string[], roleId: string) => {
    const data = {
        ids: ids,
        roleId: roleId
    }
    const response = await apiService.post(`/role/update_role_permission`, data);
    return response;
};

export const addMenu = async (data: any) => {
    const response = await apiService.post(`/menu/addMenu`, data);
    return response;
};

export const menu_update = async (data: any) => {
    const response = await apiService.post(`/menu/updateMenu`, data);
    return response;
};