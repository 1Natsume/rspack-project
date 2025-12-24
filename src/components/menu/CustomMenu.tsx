import { memo, useState } from 'react';
import { Menu } from '@/types/menu'
import { useconfigStore } from '@/stores/config';

import './CustomMenu.css'

export type MenuItemProps = {
    item: Menu;
    icon: string;
    active: Boolean;
    onClick: (item: Menu) => void;
}

export type MenuProps = {
    items: Menu[] | null | undefined;
    onSelect: (item: Menu) => void;
    activeKey: string | null;
}

// 菜单项组件
const MenuItem = memo(({ item, onClick, active, icon }: MenuItemProps) => {
    const [expanded, setExpanded] = useState(false);
    const { collapsed } = useconfigStore();
    const hasChildren = item.children && item.children.length > 0;
    const handleClick = () => {
        if (hasChildren) {
            setExpanded(!expanded);
        } else if (item.path) {
            onClick(item);
        }
    };
    return (
        <div className="menu-group">
            <div
                className={`menu-item ${active ? 'active' : ''}`}
                // onClick={() => onClick(item)}
                onClick={handleClick}
            >
                <div className='flex'>
                    <span className='menu-item-icon'><i className={collapsed ? icon + ' fa-lg fa-fw' : icon}></i></span>
                    <span className={collapsed ? 'menu-item-title' : 'menu-item-title active'}>{item.title}</span>
                    {hasChildren && (
                        <span className={collapsed ? 'menu-arrow' : 'menu-arrow active'}><i className={expanded ? 'fas fa-angle-down' : 'fas fa-angle-right'}></i></span>
                    )}
                </div>

            </div>
            {hasChildren && expanded && (
                <div className="submenu">
                    {item.children?.map((child: Menu) => (
                        <MenuItem
                            key={child.id}
                            item={child}
                            onClick={() => onClick(child)}
                            active={active}
                            icon={child.icon}
                        />
                    ))}
                </div>
            )}
        </div>)

});

// 菜单组件
const CustomMenu = ({ items, onSelect, activeKey }: MenuProps) => (
    <div className="menu">
        {items?.map((item: Menu) => (
            <MenuItem
                key={item.id}
                item={item}
                onClick={onSelect}
                active={item.id == activeKey}
                icon={item.icon}
            />

        ))}

    </div>

);
export default CustomMenu;