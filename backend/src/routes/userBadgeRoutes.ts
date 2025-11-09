import { FastifyInstance } from "fastify";
import { userBadgeController } from "@/features/badge";
import { createSwaggerSchema } from "@/utils/swaggerUtils";
import { isAuthenticated } from "@/middleware/authenticate";

export default async function userBadgeRoutes(app: FastifyInstance) {
    // Get my badges (Authenticated user)
    app.get('/me/badges', {
        preHandler: [isAuthenticated],
        schema: createSwaggerSchema(
            "Récupérer mes badges",
            [
                { message: 'Vos badges récupérés', data: {}, status: 200 },
                { message: 'Non authentifié', data: {}, status: 401 },
            ],
            null,
            true,
            null,
            ['User Badges']
        ),
        handler: userBadgeController.getMyBadges,
    });

    // Get badges for a specific user (Public)
    app.get('/:id/badges', {
        schema: createSwaggerSchema(
            "Récupérer les badges d'un utilisateur",
            [
                { message: 'Badges de l\'utilisateur récupérés', data: {}, status: 200 },
            ],
            null,
            false,
            null,
            ['User Badges']
        ),
        handler: userBadgeController.getUserBadges,
    });
}
