import { Menu } from "@/types/menu";

// 定义用户数据类型
export type User = {
    id: string;
    username: string;
    name: string;
    avatar: string;
    role: string[];
    status: number;
    permissions: Menu[] | null;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface UserState {
    user: User | null;
    setUser: (user: User) => void
    logout:()=> void
}

export interface RegisterData extends LoginCredentials {
    email: string;
}