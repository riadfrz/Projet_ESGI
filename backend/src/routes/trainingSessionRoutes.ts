import { FastifyInstance } from "fastify";
import { trainingSessionController } from "@/features/trainingSession";
import { createSwaggerSchema } from "@/utils/swaggerUtils";
import { isAuthenticated } from "@/middleware/authenticate";

export default async function trainingSessionRoutes(app: FastifyInstance) {
    // Create training session (Authenticated users)
    app.post('/', {
        preHandler: [isAuthenticated],
        schema: createSwaggerSchema(
            "Enregistrer une session d'entraînement",
            [
                { message: 'Session enregistrée avec succès', data: {}, status: 201 },
                { message: 'Données invalides', data: {}, status: 400 },
                { message: 'Non authentifié', data: {}, status: 401 },
            ],
            null,
            true,
            null,
            ['Training Sessions']
        ),
        handler: trainingSessionController.createTrainingSession,
    });

    // Get all training sessions with filters and pagination (Authenticated)
    app.get('/', {
        preHandler: [isAuthenticated],
        schema: createSwaggerSchema(
            "Récupérer mes sessions d'entraînement",
            [
                { message: 'Sessions récupérées', data: {}, status: 200 },
                { message: 'Non authentifié', data: {}, status: 401 },
            ],
            null,
            true,
            null,
            ['Training Sessions']
        ),
        handler: trainingSessionController.getAllTrainingSessions,
    });

    // Get user statistics (Authenticated)
    app.get('/stats', {
        preHandler: [isAuthenticated],
        schema: createSwaggerSchema(
            "Récupérer mes statistiques globales",
            [
                { message: 'Statistiques récupérées', data: {}, status: 200 },
                { message: 'Non authentifié', data: {}, status: 401 },
            ],
            null,
            true,
            null,
            ['Training Sessions']
        ),
        handler: trainingSessionController.getStats,
    });

    // Get training session by ID (Authenticated, owner only)
    app.get('/:id', {
        preHandler: [isAuthenticated],
        schema: createSwaggerSchema(
            "Récupérer les détails d'une session",
            [
                { message: 'Session récupérée', data: {}, status: 200 },
                { message: 'Non authentifié', data: {}, status: 401 },
                { message: 'Non autorisé', data: {}, status: 403 },
                { message: 'Session introuvable', data: {}, status: 404 },
            ],
            null,
            true,
            null,
            ['Training Sessions']
        ),
        handler: trainingSessionController.getTrainingSessionById,
    });

    // Update training session (Authenticated, owner only)
    app.put('/:id', {
        preHandler: [isAuthenticated],
        schema: createSwaggerSchema(
            "Modifier une session d'entraînement",
            [
                { message: 'Session mise à jour', data: {}, status: 200 },
                { message: 'Données invalides', data: {}, status: 400 },
                { message: 'Non authentifié', data: {}, status: 401 },
                { message: 'Non autorisé', data: {}, status: 403 },
                { message: 'Session introuvable', data: {}, status: 404 },
            ],
            null,
            true,
            null,
            ['Training Sessions']
        ),
        handler: trainingSessionController.updateTrainingSession,
    });

    // Delete training session (Authenticated, owner only)
    app.delete('/:id', {
        preHandler: [isAuthenticated],
        schema: createSwaggerSchema(
            "Supprimer une session d'entraînement",
            [
                { message: 'Session supprimée avec succès', data: {}, status: 200 },
                { message: 'Non authentifié', data: {}, status: 401 },
                { message: 'Non autorisé', data: {}, status: 403 },
                { message: 'Session introuvable', data: {}, status: 404 },
            ],
            null,
            true,
            null,
            ['Training Sessions']
        ),
        handler: trainingSessionController.deleteTrainingSession,
    });
}
