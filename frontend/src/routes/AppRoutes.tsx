import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import PrivateRoutes from '@/routes/PrivateRoutes';
import PublicRoutes from '@/routes/PublicRoutes';
import LandingPage from '@/pages/landing/LandingPage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import DashboardLayout from '@/layouts/DashboardLayout';
import ClientDashboard from '@/pages/dashboard/ClientDashboard';
import OwnerDashboard from '@/pages/dashboard/OwnerDashboard';
import AdminDashboard from '@/pages/dashboard/AdminDashboard';
import { useAuthStore } from '@/stores/authStore';

// Helper to redirect to correct role dashboard
const DashboardRedirect = () => {
    const { user } = useAuthStore();
    const role = user?.role || 'CLIENT';
    
    if (role === 'ADMIN') return <Navigate to="/dashboard/admin" replace />;
    if (role === 'GYM_OWNER') return <Navigate to="/dashboard/owner" replace />;
    return <Navigate to="/dashboard/client" replace />;
};

const AppRoutes = () => {
    const { checkAuth, isLoading } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (isLoading) {
        // Futuristic loader placeholder
        return (
            <div className="min-h-screen flex items-center justify-center bg-dark-bg">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neon-blue"></div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col overflow-x-hidden bg-dark-bg text-white">
            <main className="flex-1">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    
                    <Route element={<PublicRoutes />}>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                    </Route>

                    {/* Private Routes */}
                    <Route element={<PrivateRoutes />}>
                        <Route path="/dashboard" element={<DashboardLayout />}>
                            <Route index element={<DashboardRedirect />} />
                            <Route path="client/*" element={<ClientDashboard />} />
                            <Route path="owner/*" element={<OwnerDashboard />} />
                            <Route path="admin/*" element={<AdminDashboard />} />
                        </Route>
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
        </div>
    );
};

export default AppRoutes;
