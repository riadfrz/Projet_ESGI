import { FastifyInstance } from "fastify";
import { muscleController } from "@/features/muscle";
import { createSwaggerSchema } from "@/utils/swaggerUtils";
import { isAuthenticated } from "@/middleware/authenticate";
import { hasRole } from "@/middleware/authorize";
import { UserRole } from "@shared/enums/userEnum";

export default async function muscleRoutes(app: FastifyInstance) {
    // Create muscle (ADMIN only)
    app.post('/', {
        preHandler: [isAuthenticated, hasRole(UserRole.ADMIN)],
        schema: createSwaggerSchema(
            "Créer un nouveau muscle (ADMIN)",
            [
                { message: 'Muscle créé avec succès', data: {}, status: 201 },
                { message: 'Un muscle avec ce nom existe déjà', data: {}, status: 409 },
                { message: 'Données invalides', data: {}, status: 400 },
                { message: 'Non authentifié', data: {}, status: 401 },
                { message: 'Accès refusé', data: {}, status: 403 },
            ],
            null,
            true,
            null,
            ['Muscles']
        ),
        handler: muscleController.createMuscle,
    });

    // Get all muscles with filters and pagination (Public)
    app.get('/', {
        schema: createSwaggerSchema(
            "Récupérer tous les muscles",
            [
                { message: 'Muscles récupérés', data: {}, status: 200 },
            ],
            null,
            false,
            null,
            ['Muscles']
        ),
        handler: muscleController.getAllMuscles,
    });

    // Get muscle by ID (Public)
    app.get('/:id', {
        schema: createSwaggerSchema(
            "Récupérer un muscle par ID",
            [
                { message: 'Muscle récupéré', data: {}, status: 200 },
                { message: 'Muscle introuvable', data: {}, status: 404 },
            ],
            null,
            false,
            null,
            ['Muscles']
        ),
        handler: muscleController.getMuscleById,
    });

    // Update muscle (ADMIN only)
    app.put('/:id', {
        preHandler: [isAuthenticated, hasRole(UserRole.ADMIN)],
        schema: createSwaggerSchema(
            "Mettre à jour un muscle (ADMIN)",
            [
                { message: 'Muscle mis à jour', data: {}, status: 200 },
                { message: 'Muscle introuvable', data: {}, status: 404 },
                { message: 'Un muscle avec ce nom existe déjà', data: {}, status: 409 },
                { message: 'Non authentifié', data: {}, status: 401 },
                { message: 'Accès refusé', data: {}, status: 403 },
            ],
            null,
            true,
            null,
            ['Muscles']
        ),
        handler: muscleController.updateMuscle,
    });

    // Delete muscle (ADMIN only)
    app.delete('/:id', {
        preHandler: [isAuthenticated, hasRole(UserRole.ADMIN)],
        schema: createSwaggerSchema(
            "Supprimer un muscle (ADMIN)",
            [
                { message: 'Muscle supprimé', data: {}, status: 200 },
                { message: 'Muscle introuvable', data: {}, status: 404 },
                { message: 'Non authentifié', data: {}, status: 401 },
                { message: 'Accès refusé', data: {}, status: 403 },
            ],
            null,
            true,
            null,
            ['Muscles']
        ),
        handler: muscleController.deleteMuscle,
    });
}
