import MusicPlayer from '@/components/music-player';
import { configManager } from '@/utils/ConfigManager';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
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
        </div>
    );
};

export default MainLayout;