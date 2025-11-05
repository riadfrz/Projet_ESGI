import { FastifyInstance } from "fastify";
import { exerciseController } from "@/features/exercise";
import { createSwaggerSchema } from "@/utils/swaggerUtils";

export default async function exerciseRoutes(app: FastifyInstance) {
    // Create exercise (ADMIN only)
    app.post('/', {
        schema: createSwaggerSchema(
            "Créer un nouvel exercice (ADMIN)",
            [
                { message: 'Exercice créé avec succès', data: {}, status: 201 },
                { message: 'Données invalides', data: {}, status: 400 },
            ],
            null,
            true,
            null,
            ['Exercises']
        ),
        handler: exerciseController.createExercise,
    });

    // Get all exercises with filters and pagination
    app.get('/', {
        schema: createSwaggerSchema(
            "Récupérer tous les exercices",
            [
                { message: 'Exercices récupérés', data: {}, status: 200 },
            ],
            null,
            false,
            null,
            ['Exercises']
        ),
        handler: exerciseController.getAllExercises,
    });

    // Get exercise by ID
    app.get('/:id', {
        schema: createSwaggerSchema(
            "Récupérer un exercice par ID",
            [
                { message: 'Exercice récupéré', data: {}, status: 200 },
                { message: 'Exercice introuvable', data: {}, status: 404 },
            ],
            null,
            false,
            null,
            ['Exercises']
        ),
        handler: exerciseController.getExerciseById,
    });

    // Update exercise (ADMIN only)
    app.put('/:id', {
        schema: createSwaggerSchema(
            "Mettre à jour un exercice (ADMIN)",
            [
                { message: 'Exercice mis à jour', data: {}, status: 200 },
                { message: 'Exercice introuvable', data: {}, status: 404 },
                { message: 'Non autorisé', data: {}, status: 403 },
            ],
            null,
            true,
            null,
            ['Exercises']
        ),
        handler: exerciseController.updateExercise,
    });

    // Delete exercise (ADMIN only)
    app.delete('/:id', {
        schema: createSwaggerSchema(
            "Supprimer un exercice (ADMIN)",
            [
                { message: 'Exercice supprimé', data: {}, status: 200 },
                { message: 'Exercice introuvable', data: {}, status: 404 },
                { message: 'Non autorisé', data: {}, status: 403 },
            ],
            null,
            true,
            null,
            ['Exercises']
        ),
        handler: exerciseController.deleteExercise,
    });
}
