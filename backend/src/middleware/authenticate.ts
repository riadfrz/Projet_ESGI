import { jsonResponse } from '@/utils/jsonResponse';
import { authRepository } from '@/features/auth';
import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';
import { User } from '@/config/client';

declare module 'fastify' {
    interface FastifyRequest {
        user?: User;
    }
}

/**
 * Middleware to check if the user is authenticated via session cookie
 * @param req - Fastify request
 * @param res - Fastify response
 * @returns void
 */
export const isAuthenticated = async (
    req: FastifyRequest,
    res: FastifyReply
): Promise<void> => {
    const sessionToken = req.cookies.session;

    if (!sessionToken) {
        await res.status(401).send({
            message: 'Non authentifié',
            data: undefined,
            status: 401,
            timestamp: new Date().toISOString(),
        });
        return;
    }

    try {
        const user = await authRepository.getCurrentUser(sessionToken);

        if (!user) {
            await res.status(401).send({
                message: 'Session invalide ou expirée',
                data: undefined,
                status: 401,
                timestamp: new Date().toISOString(),
            });
            return;
        }

        // Attach user to request for downstream handlers
        req.user = user;
    } catch (error) {
        await res.status(401).send({
            message: 'Erreur d\'authentification',
            data: undefined,
            status: 401,
            timestamp: new Date().toISOString(),
        });
    }
};
