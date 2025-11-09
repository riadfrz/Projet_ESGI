import { FastifyInstance } from "fastify";
import { badgeController } from "@/features/badge";
import { createSwaggerSchema } from "@/utils/swaggerUtils";
import { isAuthenticated } from "@/middleware/authenticate";
import { hasRole } from "@/middleware/authorize";
import { UserRole } from "@shared/enums/userEnum";

export default async function badgeRoutes(app: FastifyInstance) {
    // Create badge (ADMIN only)
    app.post('/', {
        preHandler: [isAuthenticated, hasRole(UserRole.ADMIN)],
        schema: createSwaggerSchema(
            "Créer un nouveau badge (ADMIN)",
            [
                { message: 'Badge créé avec succès', data: {}, status: 201 },
                { message: 'Un badge avec ce nom existe déjà', data: {}, status: 409 },
                { message: 'Données invalides', data: {}, status: 400 },
                { message: 'Non authentifié', data: {}, status: 401 },
                { message: 'Accès refusé', data: {}, status: 403 },
            ],
            null,
            true,
            null,
            ['Badges']
        ),
        handler: badgeController.createBadge,
    });

    // Get all badges with filters and pagination (Public)
    app.get('/', {
        schema: createSwaggerSchema(
            "Récupérer tous les badges",
            [
                { message: 'Badges récupérés', data: {}, status: 200 },
            ],
            null,
            false,
            null,
            ['Badges']
        ),
        handler: badgeController.getAllBadges,
    });

    // Check badges for all users (ADMIN only - for cron jobs)
    app.post('/check', {
        preHandler: [isAuthenticated, hasRole(UserRole.ADMIN)],
        schema: createSwaggerSchema(
            "Vérifier et attribuer les badges pour tous les utilisateurs (ADMIN/Cron)",
            [
                { message: 'Vérification des badges terminée', data: {}, status: 200 },
                { message: 'Non authentifié', data: {}, status: 401 },
                { message: 'Accès refusé', data: {}, status: 403 },
            ],
            null,
            true,
            null,
            ['Badges']
        ),
        handler: badgeController.checkBadges,
    });

    // Get badge by ID (Public)
    app.get('/:id', {
        schema: createSwaggerSchema(
            "Récupérer les détails d'un badge",
            [
                { message: 'Badge récupéré', data: {}, status: 200 },
                { message: 'Badge introuvable', data: {}, status: 404 },
            ],
            null,
            false,
            null,
            ['Badges']
        ),
        handler: badgeController.getBadgeById,
    });

    // Update badge (ADMIN only)
    app.put('/:id', {
        preHandler: [isAuthenticated, hasRole(UserRole.ADMIN)],
        schema: createSwaggerSchema(
            "Mettre à jour un badge (ADMIN)",
            [
                { message: 'Badge mis à jour', data: {}, status: 200 },
                { message: 'Badge introuvable', data: {}, status: 404 },
                { message: 'Un badge avec ce nom existe déjà', data: {}, status: 409 },
                { message: 'Non authentifié', data: {}, status: 401 },
                { message: 'Accès refusé', data: {}, status: 403 },
            ],
            null,
            true,
            null,
            ['Badges']
        ),
        handler: badgeController.updateBadge,
    });

    // Delete badge (ADMIN only)
    app.delete('/:id', {
        preHandler: [isAuthenticated, hasRole(UserRole.ADMIN)],
        schema: createSwaggerSchema(
            "Supprimer un badge (ADMIN)",
            [
                { message: 'Badge supprimé', data: {}, status: 200 },
                { message: 'Badge introuvable', data: {}, status: 404 },
                { message: 'Non authentifié', data: {}, status: 401 },
                { message: 'Accès refusé', data: {}, status: 403 },
            ],
            null,
            true,
            null,
            ['Badges']
        ),
        handler: badgeController.deleteBadge,
    });
}
