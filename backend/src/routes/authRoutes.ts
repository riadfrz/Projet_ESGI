import { FastifyInstance } from "fastify";
import { authController } from "@/features/auth";
import { createSwaggerSchema } from "@/utils/swaggerUtils";
import { registerSchema, loginSchema } from "@shared/dto";

export default async function authRoutes(app: FastifyInstance) {
    // Register new user
    app.post('/register', {
        schema: createSwaggerSchema(
            "Créer un nouvel utilisateur",
            [
                { message: 'Utilisateur créé avec succès', data: {}, status: 200 },
                { message: 'Utilisateur déjà existant', data: {}, status: 409 },
                { message: "Erreur lors de la création de l'utilisateur", data: {}, status: 500 },
            ],
            (registerSchema as any)._def?.schema || registerSchema,
            false,
            null,
            ['Auth']
        ),
        handler: authController.register,
    });

    // Login
    app.post('/login', {
        schema: createSwaggerSchema(
            "Connexion à l'application",
            [
                {
                    message: 'Connexion réussie',
                    data: {
                        accessToken: 'string',
                        refreshToken: 'string',
                    },
                    status: 200,
                },
                { message: 'Identifiants invalides', data: {}, status: 401 },
                { message: 'Erreur lors de la connexion', data: {}, status: 500 },
            ],
            loginSchema,
            false,
            null,
            ['Auth']
        ),
        handler: authController.login,
    });

    // Logout
    app.post('/logout', {
        schema: createSwaggerSchema(
            "Se déconnecter",
            [
                { message: 'Logged out successfully', data: {}, status: 200 },
                { message: 'No active session', data: {}, status: 401 },
            ],
            null,
            false,
            null,
            ['Auth']
        ),
        handler: authController.logout,
    });

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
