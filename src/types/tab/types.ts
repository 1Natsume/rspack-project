import { KeepAliveTab } from ".";

// 页签
export type Tab = {
    key: string;
    label: string;
    path?: string;
    icon?: string;
    filePath?: string;
    children?: React.ReactNode;
}

// 拖拽项接口
export interface DragItem {
    index: number;
    id: string;
}

// 组件Props接口
export interface DraggableTabsProps {
    tabs: Tab[];
    onTabsChange?: (tabRoutePath: string) => void;
    activeTab?: string;
    className?: string;
    style?: React.CSSProperties;
    addable?: boolean;
    onAddTab?: () => void;
    editable?: boolean;
    onEditLabel?: (tabId: string, newLabel: string) => void;
    onClose: (targetKey: string | React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>, action: "add" | "remove") => void;
}

export interface TabState {
    tabs: Tab[] | null;
    setTab: (tab: Tab) => void;
    setTabs: (tabs: Tab[]) => void;
}

export type tabProps = {
    tab: Tab;
    active: Boolean;
    //onClick: (id: string) => void;
    onClose: (targetKey: string | React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>, action: "add" | "remove") => void;
    onDragStart: (e: any) => void;
    onDragOver: (e: any) => void;
    onDrop: (e: any) => void;
}