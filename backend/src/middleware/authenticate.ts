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
        jsonResponse(res, 'Non authentifié', undefined, 401);
        return;
    }

    try {
        const user = await authRepository.getCurrentUser(sessionToken);

        if (!user) {
            jsonResponse(res, 'Session invalide ou expirée', undefined, 401);
            return;
        }

        // Attach user to request for downstream handlers
        req.user = user;
    } catch (error) {
        jsonResponse(res, 'Erreur d\'authentification', undefined, 401);
    }
};
