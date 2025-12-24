export type Menu = {
    id: string;
    icon: string;
    title: string;
    path: string;
    filePath: string;
    parentId: string;
    authCode: string;
    type?: number;
    children?: Menu[];
    show:boolean;
    parentPaths?: string[];
}

export enum MenuType {
    Catalog = 1,
    Menu = 2,
    Button = 3
}