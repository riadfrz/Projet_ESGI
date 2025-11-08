import { jsonResponse } from '@/utils/jsonResponse';
import { UserRole } from '@shared/enums/userEnum';
import { hasInheritedRole } from '@/config/roles';
import { FastifyReply, FastifyRequest } from 'fastify';

/**
 * Middleware factory to authorize users based on required role(s)
 * Uses role hierarchy from config/roles.ts
 *
 * @param requiredRole - The minimum role required to access the route
 * @returns Fastify preHandler middleware
 */
export const hasRole = (requiredRole: UserRole) => {
    return async (
        req: FastifyRequest,
        res: FastifyReply
    ): Promise<void> => {
        // User should be set by isAuthenticated middleware
        if (!req.user) {
            await res.status(401).send({
                message: 'Non authentifié',
                data: undefined,
                status: 401,
                timestamp: new Date().toISOString(),
            });
            return;
        }

        const userRole = req.user.role as UserRole;

        // Check if user's role satisfies the required role (including inheritance)
        if (!hasInheritedRole(userRole, requiredRole)) {
            await res.status(403).send({
                message: 'Accès refusé - Permissions insuffisantes',
                data: undefined,
                status: 403,
                timestamp: new Date().toISOString(),
            });
            return;
        }

        // User is authorized, continue to route handler
    };
};
