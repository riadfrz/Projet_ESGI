import { jsonResponse } from '@/utils/jsonResponse';
import { authRepository } from '@/features/auth';
import { userRepository } from '@/features/user';
import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';
import { User } from '@/config/client';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

declare module 'fastify' {
    interface FastifyRequest {
        user?: User;
    }
}

/**
 * Middleware to check if the user is authenticated via session cookie or Bearer token
 * @param req - Fastify request
 * @param res - Fastify response
 * @returns void
 */
export const isAuthenticated = async (
    req: FastifyRequest,
    res: FastifyReply
): Promise<void> => {
    const sessionToken = req.cookies.session;
    let user = null;

    // 1. Try Session Cookie
    if (sessionToken) {
        try {
            user = await authRepository.getCurrentUser(sessionToken);
        } catch (error) {
            // Ignore error, try next method
        }
    }

    // 2. Try Bearer Token
    if (!user) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            try {
                const decoded = verify(token, JWT_SECRET) as any;
                if (decoded && decoded.id) {
                    user = await userRepository.findById(decoded.id);
                }
            } catch (error) {
                // Ignore error
            }
        }
    }

    if (!user) {
        await res.status(401).send({
            message: 'Non authentifié',
            data: undefined,
            status: 401,
            timestamp: new Date().toISOString(),
        });
        return;
    }

    // Attach user to request for downstream handlers
    req.user = user;
};
