import Modal from '@/components/modal';
import MusicPlayer from '@/components/music-player';
import { configManager } from '@/utils/ConfigManager';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                // 在这里执行ESC按键按下后的操作，例如关闭模态框
                console.log('ESC pressed');
                // 可以在这里调用父组件传递的回调函数，或者使用状态管理来触发某些操作
                setOpen(!open);
            }
        };

        // 添加事件监听器
        window.addEventListener('keydown', handleEsc);

        // 清理函数：组件卸载时移除事件监听器
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, []); // 空依赖数组表示effect只运行一次（在组件挂载和卸载时）

    return (
        <div className="main-layout">
            <main className="content">
                <Outlet />
            </main>
            {/* {
                configManager.get().music?.enable && (
                    <MusicPlayer></MusicPlayer>
                )
            } */}
            <Modal
                isOpen={open}
                onClose={() => setOpen(false)}
                className='bg-black/[0.15]'
                size="full">
                <div className='flex'>
                    <div className='flex-2/5'>
                        <div className='relative mt-20 ml-20 flex'>
                            <div className='w-80 h-80 rounded-full overflow-hidden'>
                                <img src="https://q9.itc.cn/q_70/images03/20250730/7e535ac6918d44c4a0ab740ed9aa349d.jpeg" className='w-full h-full object-cover"' />
                            </div>
                            <div className='flex-auto text-white text-[30px] self-center ml-10'>石头祥子</div>
                        </div>

                    </div>
                    <div className='flex-3/5'>

                    </div>

                </div>
            </Modal>
        </div>
    );
};

export default MainLayout;