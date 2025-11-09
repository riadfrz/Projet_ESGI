/**
 * Example: Auth Layout Component
 * 
 * Wrapper component that handles authentication state on app load.
 * Should be used at the root of your app to check for existing sessions.
 */

import { useAutoLogin } from '@/api/queries';
import { Outlet } from 'react-router-dom';

interface AuthLayoutProps {
    /**
     * Optional loading component to show while checking auth
     */
    loadingComponent?: React.ReactNode;
}

export function AuthLayout({ loadingComponent }: AuthLayoutProps) {
    const { isLoading } = useAutoLogin();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                {loadingComponent || (
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading...</p>
                    </div>
                )}
            </div>
        );
    }

    return <Outlet />;
}

/**
 * Example Usage in Router:
 * 
 * import { AuthLayout } from '@/components/auth/AuthLayout';
 * 
 * <Route element={<AuthLayout />}>
 *   <Route path="/" element={<Home />} />
 *   <Route path="/login" element={<Login />} />
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/dashboard" element={<Dashboard />} />
 *   </Route>
 * </Route>
 */
