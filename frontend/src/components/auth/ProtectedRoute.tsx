/**
 * Example: Protected Route Component
 * 
 * Wraps routes that require authentication.
 * Redirects to login if user is not authenticated.
 * Optionally checks for specific roles.
 */

import { useAuthStore } from '@/stores';
import { Navigate, Outlet } from 'react-router-dom';
import { UserRole } from '@shared/enums';

interface ProtectedRouteProps {
    /**
     * Optional array of roles that are allowed to access this route.
     * If empty, any authenticated user can access.
     */
    allowedRoles?: UserRole[];
    /**
     * Optional redirect path if unauthorized. Defaults to /login
     */
    redirectTo?: string;
}

export function ProtectedRoute({ 
    allowedRoles = [], 
    redirectTo = '/login' 
}: ProtectedRouteProps) {
    const { isAuthenticated, user } = useAuthStore();

    // Not authenticated - redirect to login
    if (!isAuthenticated) {
        return <Navigate to={redirectTo} replace />;
    }

    // Check role-based access if roles are specified
    if (allowedRoles.length > 0) {
        if (!user || !allowedRoles.includes(user.role)) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    // Render child routes
    return <Outlet />;
}

/**
 * Example Usage in Router:
 * 
 * import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
 * import { UserRole } from '@shared/enums';
 * 
 * <Route element={<ProtectedRoute />}>
 *   <Route path="/dashboard" element={<Dashboard />} />
 * </Route>
 * 
 * <Route element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]} />}>
 *   <Route path="/admin" element={<AdminPanel />} />
 * </Route>
 */
