import { FastifyInstance } from "fastify";
import { challengeController } from "@/features/challenge";
import { createSwaggerSchema } from "@/utils/swaggerUtils";
import { isAuthenticated } from "@/middleware/authenticate";

export default async function challengeRoutes(app: FastifyInstance) {
    // Create challenge (Authenticated users)
    app.post('/', {
        preHandler: [isAuthenticated],
        schema: createSwaggerSchema(
            "Créer un nouveau défi",
            [
                { message: 'Défi créé avec succès', data: {}, status: 201 },
                { message: 'Données invalides', data: {}, status: 400 },
                { message: 'Non authentifié', data: {}, status: 401 },
            ],
            null,
            true,
            null,
            ['Challenges']
        ),
        handler: challengeController.createChallenge,
    });

    // Get all challenges with filters and pagination (Public)
    app.get('/', {
        schema: createSwaggerSchema(
            "Explorer les défis avec filtres",
            [
                { message: 'Défis récupérés', data: {}, status: 200 },
            ],
            null,
            false,
            null,
            ['Challenges']
        ),
        handler: challengeController.getAllChallenges,
    });

    // Get my created challenges (Authenticated)
    app.get('/my', {
        preHandler: [isAuthenticated],
        schema: createSwaggerSchema(
            "Récupérer mes défis créés",
            [
                { message: 'Vos défis récupérés', data: {}, status: 200 },
                { message: 'Non authentifié', data: {}, status: 401 },
            ],
            null,
            true,
            null,
            ['Challenges']
        ),
        handler: challengeController.getMyChallenges,
    });

    // Get challenge by ID (Public)
    app.get('/:id', {
        schema: createSwaggerSchema(
            "Récupérer les détails d'un défi",
            [
                { message: 'Défi récupéré', data: {}, status: 200 },
                { message: 'Défi introuvable', data: {}, status: 404 },
            ],
            null,
            false,
            null,
            ['Challenges']
        ),
        handler: challengeController.getChallengeById,
    });

    // Update challenge (Creator only)
    app.put('/:id', {
        preHandler: [isAuthenticated],
        schema: createSwaggerSchema(
            "Modifier un défi",
            [
                { message: 'Défi mis à jour', data: {}, status: 200 },
                { message: 'Données invalides', data: {}, status: 400 },
                { message: 'Non authentifié', data: {}, status: 401 },
                { message: 'Non autorisé', data: {}, status: 403 },
                { message: 'Défi introuvable', data: {}, status: 404 },
            ],
            null,
            true,
            null,
            ['Challenges']
        ),
        handler: challengeController.updateChallenge,
    });

    // Delete challenge (Creator only)
    app.delete('/:id', {
        preHandler: [isAuthenticated],
        schema: createSwaggerSchema(
            "Supprimer un défi",
            [
                { message: 'Défi supprimé avec succès', data: {}, status: 200 },
                { message: 'Non authentifié', data: {}, status: 401 },
                { message: 'Non autorisé', data: {}, status: 403 },
                { message: 'Défi introuvable', data: {}, status: 404 },
            ],
            null,
            true,
            null,
            ['Challenges']
        ),
        handler: challengeController.deleteChallenge,
    });
}
