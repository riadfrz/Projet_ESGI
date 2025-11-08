import { jsonResponse } from '@/utils/jsonResponse';
import { UserRole } from '@shared/enums/userEnum';
import { hasInheritedRole } from '@/config/roles';
import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';

/**
 * Middleware factory to authorize users based on required role(s)
 * Uses role hierarchy from config/roles.ts
 *
 * @param requiredRole - The minimum role required to access the route
 * @returns Fastify preHandler middleware
 */
export const hasRole = (requiredRole: UserRole) => {
    return (
        req: FastifyRequest,
        res: FastifyReply,
        done: HookHandlerDoneFunction
    ): void => {
        // User should be set by isAuthenticated middleware
        if (!req.user) {
            jsonResponse(res, 'Non authentifié', undefined, 401);
            return;
        }

        const userRole = req.user.role as UserRole;

        // Check if user's role satisfies the required role (including inheritance)
        if (!hasInheritedRole(userRole, requiredRole)) {
            jsonResponse(
                res,
                'Accès refusé - Permissions insuffisantes',
                undefined,
                403
            );
            return;
        }

        // User is authorized, continue to route handler
        done();
    };
};
