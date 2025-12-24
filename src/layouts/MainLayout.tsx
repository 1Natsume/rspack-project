import { Outlet } from 'react-router-dom';

const MainLayout = () => {
    return (
        <div className="main-layout">
            <main className="content">
                <Outlet />
            </main>
            {/* <footer className="footer">
                <p>© 2023 我的应用</p>
            </footer> */}
        </div>
    );
};

export default MainLayout;