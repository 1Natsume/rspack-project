import type { DraggableTabsProps, DragItem, Tab, tabProps } from '@/types/tab'
import './index.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 页签组件
const Tab = ({ tab, active, onClose, onDragStart, onDragOver, onDrop }: tabProps) => (
    <div className={`tab ${active ? 'active' : ''}`}
        draggable
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDrop={onDrop}
    >
        <span>{tab.label}</span>
        {/* {tab.closable && ( */}
        <span className="close-icon" onClick={(e) => {
            e.stopPropagation();
            onClose(tab.key,'remove');
        }}>×</span>
        {/* )} */}
    </div>
);

// 页签组容器
const DraggableTab = ({ tabs, activeTab, onTabsChange, onClose }: DraggableTabsProps) => {
    // const { setTab, setTabs } = tabSlice()
    const [dragItem, setDragItem] = useState<DragItem | null>(null);
    const navigate = useNavigate()

    // 处理拖拽开始
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        setDragItem({ index, id: e.currentTarget.id });
        e.dataTransfer.effectAllowed = 'move';
        // 设置拖拽图像
        e.dataTransfer.setDragImage(e.currentTarget, 10, 10);
    };

    // 处理拖拽经过
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, _index: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    // 处理放置
    const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.preventDefault();
        if (dragItem) {
            const newTabs = [...tabs];
            const movedItem = newTabs[dragItem.index];
            newTabs.splice(dragItem.index, 1);
            newTabs.splice(index, 0, movedItem);
            //setTabs(newTabs)
            //onChange(index);
            //onTabSelect(dragItem.id)
            setDragItem(null);
        }
    };

    return (
        <div className="">
            <div className='tablist flex flex-nowrap flex-row self-cente w-auto'>
                {tabs.map((tab, index) => (
                    <div id={tab.key}
                        key={tab.key}
                        className='w-auto h-full'
                        onClick={() => { onTabsChange }}
                    >
                    <Tab
                        tab={tab}
                        active={tab.key === activeTab}
                        onClose={onClose}
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDrop={(e) => handleDrop(e, index)}
                    />

                    </div>

                ))}
            </div>

            <div className='tabs-body relative mt-5'>
                {tabs.map((tab, index) => (
                    <div key={tab.key} className={`tab-content  ${tab.key === activeTab ? 'active' : ''}`}>
                        {tab.children && (tab.children)}
                    </div>
                ))}
            </div>

        </div>

    )
};
export default DraggableTab;