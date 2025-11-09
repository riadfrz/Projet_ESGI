/**
 * Example: Role-Based Component Wrapper
 * 
 * Conditionally renders children based on user role.
 * Useful for showing/hiding UI elements based on permissions.
 */

import { useAuthStore } from '@/stores';
import { UserRole } from '@shared/enums';

interface RoleGuardProps {
    /**
     * Roles allowed to see the content
     */
    allowedRoles: UserRole[];
    /**
     * Content to render if user has the required role
     */
    children: React.ReactNode;
    /**
     * Optional fallback content to render if user doesn't have permission
     */
    fallback?: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children, fallback = null }: RoleGuardProps) {
    const user = useAuthStore((state) => state.user);

    if (!user || !allowedRoles.includes(user.role)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}

/**
 * Example Usage:
 * 
 * import { RoleGuard } from '@/components/auth/RoleGuard';
 * import { UserRole } from '@shared/enums';
 * 
 * // Only show admin panel to admins
 * <RoleGuard allowedRoles={[UserRole.ADMIN]}>
 *   <AdminPanel />
 * </RoleGuard>
 * 
 * // Show different content for non-admins
 * <RoleGuard 
 *   allowedRoles={[UserRole.ADMIN]} 
 *   fallback={<p>You need admin access</p>}
 * >
 *   <AdminPanel />
 * </RoleGuard>
 * 
 * // Multiple roles
 * <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.GYM_OWNER]}>
 *   <GymOwnerTools />
 * </RoleGuard>
 */
