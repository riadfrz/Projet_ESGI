import { Outlet } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';

const DashboardLayout = () => {
    return (
        <div className="min-h-screen bg-dark-bg text-white">
            <Navbar />
            <Sidebar />
            
            <main className="ml-0 md:ml-64 pt-20 p-6 transition-all duration-300">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
