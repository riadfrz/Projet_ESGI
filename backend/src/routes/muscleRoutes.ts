import { FastifyInstance } from "fastify";
import { muscleController } from "@/features/muscle";
import { createSwaggerSchema } from "@/utils/swaggerUtils";

export default async function muscleRoutes(app: FastifyInstance) {
    // Create muscle
    app.post('/', {
        schema: createSwaggerSchema(
            "Créer un nouveau muscle",
            [
                { message: 'Muscle créé avec succès', data: {}, status: 201 },
                { message: 'Un muscle avec ce nom existe déjà', data: {}, status: 409 },
                { message: 'Données invalides', data: {}, status: 400 },
            ],
            null,
            true,
            null,
            ['Muscles']
        ),
        handler: muscleController.createMuscle,
    });

    // Get all muscles with filters and pagination
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

    // Get muscle by ID
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

    // Update muscle
    app.put('/:id', {
        schema: createSwaggerSchema(
            "Mettre à jour un muscle",
            [
                { message: 'Muscle mis à jour', data: {}, status: 200 },
                { message: 'Muscle introuvable', data: {}, status: 404 },
                { message: 'Un muscle avec ce nom existe déjà', data: {}, status: 409 },
            ],
            null,
            true,
            null,
            ['Muscles']
        ),
        handler: muscleController.updateMuscle,
    });

    // Delete muscle
    app.delete('/:id', {
        schema: createSwaggerSchema(
            "Supprimer un muscle",
            [
                { message: 'Muscle supprimé', data: {}, status: 200 },
                { message: 'Muscle introuvable', data: {}, status: 404 },
            ],
            null,
            true,
            null,
            ['Muscles']
        ),
        handler: muscleController.deleteMuscle,
    });
}
