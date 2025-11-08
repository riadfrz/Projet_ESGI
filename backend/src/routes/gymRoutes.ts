import { FastifyInstance } from "fastify";
import { gymController } from "@/features/gym";
import { createSwaggerSchema } from "@/utils/swaggerUtils";
import { isAuthenticated } from "@/middleware/authenticate";
import { hasRole } from "@/middleware/authorize";
import { UserRole } from "@shared/enums/userEnum";

export default async function gymRoutes(app: FastifyInstance) {
    // Create gym (GYM_OWNER or ADMIN) - Creates with PENDING status
    app.post('/', {
        preHandler: [isAuthenticated, hasRole(UserRole.GYM_OWNER)],
        schema: createSwaggerSchema(
            "Créer une nouvelle salle de sport",
            [
                { message: 'Salle de sport créée avec succès', data: {}, status: 201 },
                { message: 'Données invalides', data: {}, status: 400 },
                { message: 'Non authentifié', data: {}, status: 401 },
                { message: 'Accès refusé', data: {}, status: 403 },
            ],
            null,
            true,
            null,
            ['Gyms']
        ),
        handler: gymController.createGym,
    });

    // Get all gyms with filters and pagination
    app.get('/', {
        schema: createSwaggerSchema(
            "Récupérer toutes les salles de sport",
            [
                { message: 'Salles de sport récupérées', data: {}, status: 200 },
            ],
            null,
            false,
            null,
            ['Gyms']
        ),
        handler: gymController.getAllGyms,
    });

    // Get gym by ID
    app.get('/:id', {
        schema: createSwaggerSchema(
            "Récupérer une salle de sport par ID",
            [
                { message: 'Salle de sport récupérée', data: {}, status: 200 },
                { message: 'Salle de sport introuvable', data: {}, status: 404 },
            ],
            null,
            false,
            null,
            ['Gyms']
        ),
        handler: gymController.getGymById,
    });

    // Update gym (GYM_OWNER for their own gym, or ADMIN)
    app.put('/:id', {
        preHandler: [isAuthenticated, hasRole(UserRole.GYM_OWNER)],
        schema: createSwaggerSchema(
            "Mettre à jour une salle de sport",
            [
                { message: 'Salle de sport mise à jour', data: {}, status: 200 },
                { message: 'Salle de sport introuvable', data: {}, status: 404 },
                { message: 'Non autorisé', data: {}, status: 403 },
                { message: 'Non authentifié', data: {}, status: 401 },
            ],
            null,
            true,
            null,
            ['Gyms']
        ),
        handler: gymController.updateGym,
    });

    // Update gym status - Approve/Reject (ADMIN only)
    app.patch('/:id/status', {
        preHandler: [isAuthenticated, hasRole(UserRole.ADMIN)],
        schema: createSwaggerSchema(
            "Approuver ou rejeter une salle de sport (ADMIN)",
            [
                { message: 'Statut de la salle de sport mis à jour', data: {}, status: 200 },
                { message: 'Salle de sport introuvable', data: {}, status: 404 },
                { message: 'Non autorisé', data: {}, status: 403 },
                { message: 'Non authentifié', data: {}, status: 401 },
            ],
            null,
            true,
            null,
            ['Gyms']
        ),
        handler: gymController.updateGymStatus,
    });

    // Delete gym (ADMIN only)
    app.delete('/:id', {
        preHandler: [isAuthenticated, hasRole(UserRole.ADMIN)],
        schema: createSwaggerSchema(
            "Supprimer une salle de sport (ADMIN)",
            [
                { message: 'Salle de sport supprimée', data: {}, status: 200 },
                { message: 'Salle de sport introuvable', data: {}, status: 404 },
                { message: 'Non autorisé', data: {}, status: 403 },
                { message: 'Non authentifié', data: {}, status: 401 },
            ],
            null,
            true,
            null,
            ['Gyms']
        ),
        handler: gymController.deleteGym,
    });
}
