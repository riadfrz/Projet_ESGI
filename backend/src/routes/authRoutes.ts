import { FastifyInstance } from "fastify";
import { authController } from "@/features/auth";
import { createSwaggerSchema } from "@/utils/swaggerUtils";

export default async function authRoutes(app: FastifyInstance) {
    // Google OAuth callback (registered before wildcard route)
    app.get('/google/callback', {
        schema: createSwaggerSchema(
            "Google OAuth callback",
            [
                { message: 'OAuth successful', data: {}, status: 302 },
            ],
            null,
            false,
            null,
            ['Auth']
        ),
        
        handler: authController.handleGoogleCallback,
    });

    // Get current user
    app.get('/me', {
        schema: createSwaggerSchema(
            "Récupère l'utilisateur connecté",
            [
                { message: 'Utilisateur récupéré', data: {}, status: 200 },
                { message: 'Non authentifié', data: {}, status: 401 },
            ],
            null,
            true,
            null,
            ['Auth']
        ),
        handler: authController.getCurrentUser,
    });

    // Get user sessions
    app.get('/sessions', {
        schema: createSwaggerSchema(
            "Récupère les sessions de l'utilisateur",
            [
                { message: 'Sessions récupérées', data: {}, status: 200 },
                { message: 'Non authentifié', data: {}, status: 401 },
            ],
            null,
            true,
            null,
            ['Auth']
        ),
        handler: authController.getMySessions,
    });

    // Revoke session
    app.delete('/sessions/:sessionId', {
        schema: createSwaggerSchema(
            "Révoque une session",
            [
                { message: 'Session révoquée', data: {}, status: 200 },
            ],
            null,
            true,
            null,
            ['Auth']
        ),
        handler: authController.revokeSession,
    });
}
