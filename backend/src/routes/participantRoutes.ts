import { FastifyInstance } from "fastify";
import { participantController } from "@/features/challenge";
import { createSwaggerSchema } from "@/utils/swaggerUtils";
import { isAuthenticated } from "@/middleware/authenticate";

export default async function participantRoutes(app: FastifyInstance) {
    // Join a challenge (Authenticated)
    app.post('/:id/join', {
        preHandler: [isAuthenticated],
        schema: createSwaggerSchema(
            "Rejoindre un défi",
            [
                { message: 'Vous avez rejoint le défi avec succès', data: {}, status: 200 },
                { message: 'Impossible de rejoindre ce défi', data: {}, status: 400 },
                { message: 'Non authentifié', data: {}, status: 401 },
                { message: 'Défi introuvable', data: {}, status: 404 },
            ],
            null,
            true,
            null,
            ['Challenge Participants']
        ),
        handler: participantController.joinChallenge,
    });

    // Invite users to a challenge (Creator only)
    app.post('/:id/invite', {
        preHandler: [isAuthenticated],
        schema: createSwaggerSchema(
            "Inviter des utilisateurs à un défi",
            [
                { message: 'Invitations envoyées avec succès', data: {}, status: 200 },
                { message: 'Données invalides', data: {}, status: 400 },
                { message: 'Non authentifié', data: {}, status: 401 },
                { message: 'Non autorisé', data: {}, status: 403 },
                { message: 'Défi introuvable', data: {}, status: 404 },
            ],
            null,
            true,
            null,
            ['Challenge Participants']
        ),
        handler: participantController.inviteUsers,
    });

    // Get participants of a challenge (Public)
    app.get('/:id/participants', {
        schema: createSwaggerSchema(
            "Récupérer la liste des participants d'un défi",
            [
                { message: 'Participants récupérés', data: {}, status: 200 },
                { message: 'Défi introuvable', data: {}, status: 404 },
            ],
            null,
            false,
            null,
            ['Challenge Participants']
        ),
        handler: participantController.getParticipants,
    });

    // Update participant status (Creator or participant themselves)
    app.patch('/:id/participants/:userId', {
        preHandler: [isAuthenticated],
        schema: createSwaggerSchema(
            "Mettre à jour le statut d'un participant",
            [
                { message: 'Statut du participant mis à jour', data: {}, status: 200 },
                { message: 'Données invalides', data: {}, status: 400 },
                { message: 'Non authentifié', data: {}, status: 401 },
                { message: 'Non autorisé', data: {}, status: 403 },
                { message: 'Participant introuvable', data: {}, status: 404 },
            ],
            null,
            true,
            null,
            ['Challenge Participants']
        ),
        handler: participantController.updateParticipantStatus,
    });

    // Leave a challenge (Authenticated, but not creator)
    app.delete('/:id/leave', {
        preHandler: [isAuthenticated],
        schema: createSwaggerSchema(
            "Quitter un défi",
            [
                { message: 'Vous avez quitté le défi', data: {}, status: 200 },
                { message: 'Le créateur ne peut pas quitter son propre défi', data: {}, status: 400 },
                { message: 'Non authentifié', data: {}, status: 401 },
                { message: 'Défi introuvable', data: {}, status: 404 },
            ],
            null,
            true,
            null,
            ['Challenge Participants']
        ),
        handler: participantController.leaveChallenge,
    });

    // Get challenges where user is participating (Authenticated)
    app.get('/participating', {
        preHandler: [isAuthenticated],
        schema: createSwaggerSchema(
            "Récupérer les défis auxquels je participe",
            [
                { message: 'Défis auxquels vous participez récupérés', data: {}, status: 200 },
                { message: 'Non authentifié', data: {}, status: 401 },
            ],
            null,
            true,
            null,
            ['Challenge Participants']
        ),
        handler: participantController.getParticipatingChallenges,
    });
}
