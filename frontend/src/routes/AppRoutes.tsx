import { Navigate, Route, Routes } from 'react-router-dom';
import PrivateRoutes from '@/routes/PrivateRoutes';
import PublicRoutes from '@/routes/PublicRoutes';
import LandingPage from '@/pages/landing/LandingPage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import Dashboard from '@/pages/dashboard/Dashboard';

const AppRoutes = () => {

    return (
        <div className="flex min-h-screen flex-col overflow-x-hidden bg-dark-bg text-white">
            <main className="flex-1">
                <Routes>
                    {/* Public Routes (Accessible by everyone, but redirects to dashboard if logged in for auth pages) */}
                    <Route path="/" element={<LandingPage />} />
                    
                    <Route element={<PublicRoutes />}>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                    </Route>

                    {/* Private Routes (Protected) */}
                    <Route element={<PrivateRoutes />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        {/* Add more dashboard sub-routes here if needed */}
                         <Route path="/dashboard/*" element={<Dashboard />} />
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
        </div>
    );
};

export default AppRoutes;
