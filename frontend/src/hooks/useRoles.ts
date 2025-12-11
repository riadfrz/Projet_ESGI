/**
 * Convenience hooks for role-based checks
 * 
 * These hooks provide easy ways to check user roles in components.
 */

import { useAuthStore } from '@/stores';
import { UserRole } from '@shared/enums';

/**
 * Check if current user is an admin
 */
export function useIsAdmin(): boolean {
    const user = useAuthStore((state) => state.user);
    return user?.role === UserRole.ADMIN;
}

/**
 * Check if current user is a gym owner
 */
export function useIsGymOwner(): boolean {
    const user = useAuthStore((state) => state.user);
    return user?.role === UserRole.GYM_OWNER;
}

/**
 * Check if current user is a client
 */
export function useIsClient(): boolean {
    const user = useAuthStore((state) => state.user);
    return user?.role === UserRole.CLIENT;
}

/**
 * Check if current user has any of the specified roles
 */
export function useHasRole(roles: UserRole[]): boolean {
    const user = useAuthStore((state) => state.user);
    return user ? roles.includes(user.role) : false;
}

/**
 * Example Usage:
 * 
 * function Dashboard() {
 *   const isAdmin = useIsAdmin();
 *   const isGymOwner = useIsGymOwner();
 *   
 *   return (
 *     <div>
 *       {isAdmin && <AdminStats />}
 *       {isGymOwner && <GymOwnerStats />}
 *       <UserStats />
 *     </div>
 *   );
 * }
 * 
 * // Or use useHasRole for multiple roles
 * function ManagementPanel() {
 *   const canManage = useHasRole([UserRole.ADMIN, UserRole.GYM_OWNER]);
 *   
 *   if (!canManage) {
 *     return <div>Access Denied</div>;
 *   }
 *   
 *   return <div>Management Content</div>;
 * }
 */
