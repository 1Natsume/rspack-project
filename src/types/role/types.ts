import { MenuType } from "@/types/menu";

export interface Role {
    id: string;
    name: string;
    permissions: MenuType[];
}