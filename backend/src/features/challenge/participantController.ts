import { challengeRepository } from '@/features/challenge/challengeRepository';
import { challengeTransform } from '@/features/challenge/challengeTransform';
import { ApiResponse } from '@/types';
import { asyncHandler } from '@/utils';
import { jsonResponse } from '@/utils/jsonResponse';
import { logger } from '@/utils/logger';
import {
    IdParams,
    idSchema,
    MessageResponseDto,
    InviteUserDto,
    inviteUserSchema,
    UpdateParticipantStatusDto,
    updateParticipantStatusSchema,
    ParticipantWithUserDto,
    ParticipantParams,
    participantParamsSchema,
    ChallengeWithDetailsDto,
} from '@shared/dto';

class ParticipantController {
    private logger = logger.child({
        module: '[PARTICIPANT][CONTROLLER]',
    });

    /**
     * Join a challenge
     */
    public joinChallenge = asyncHandler<unknown, unknown, IdParams, MessageResponseDto>({
        paramsSchema: idSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<MessageResponseDto | void> | void> => {
            const { id } = request.params;
            const userId = request.user?.id;

            if (!userId) {
                return jsonResponse(reply, 'Non authentifié', undefined, 401);
            }

            const challenge = await challengeRepository.findById(id);
            if (!challenge) {
                return jsonResponse(reply, 'Défi introuvable', undefined, 404);
            }

            // Check if challenge is still active
            if (challenge.status !== 'ACTIVE') {
                return jsonResponse(reply, 'Ce défi n\'est plus actif', undefined, 400);
            }

            // Check if user can join
            const { canJoin, reason } = await challengeRepository.canJoinChallenge(id, userId);
            if (!canJoin) {
                return jsonResponse(reply, reason || 'Impossible de rejoindre ce défi', undefined, 400);
            }

            await challengeRepository.addParticipant(id, userId, 'ACCEPTED');

            return jsonResponse(reply, 'Vous avez rejoint le défi avec succès', { message: 'Défi rejoint' }, 200);
        },
    });

    /**
     * Invite users to a challenge (only creator can invite)
     */
    public inviteUsers = asyncHandler<InviteUserDto, unknown, IdParams, MessageResponseDto>({
        bodySchema: inviteUserSchema,
        paramsSchema: idSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<MessageResponseDto | void> | void> => {
            const { id } = request.params;
            const { userIds } = request.body;
            const userId = request.user?.id;

            if (!userId) {
                return jsonResponse(reply, 'Non authentifié', undefined, 401);
            }

            const challenge = await challengeRepository.findById(id);
            if (!challenge) {
                return jsonResponse(reply, 'Défi introuvable', undefined, 404);
            }

            if (challenge.createdBy !== userId) {
                return jsonResponse(reply, 'Seul le créateur peut inviter des utilisateurs', undefined, 403);
            }

            await challengeRepository.addParticipants(id, userIds, 'INVITED');

            return jsonResponse(reply, 'Invitations envoyées avec succès', { message: 'Invitations envoyées' }, 200);
        },
    });

    /**
     * Get all participants of a challenge
     */
    public getParticipants = asyncHandler<unknown, unknown, IdParams, ParticipantWithUserDto[]>({
        paramsSchema: idSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<ParticipantWithUserDto[] | void> | void> => {
            const { id } = request.params;

            const challenge = await challengeRepository.findById(id);
            if (!challenge) {
                return jsonResponse(reply, 'Défi introuvable', undefined, 404);
            }

            const participants = await challengeRepository.getParticipants(id);
            const participantsDto = challengeTransform.toParticipantWithUserDtoArray(participants);

            return jsonResponse(reply, 'Participants récupérés', participantsDto, 200);
        },
    });

    /**
     * Update participant status (creator or the participant themselves)
     */
    public updateParticipantStatus = asyncHandler<UpdateParticipantStatusDto, unknown, ParticipantParams, MessageResponseDto>({
        bodySchema: updateParticipantStatusSchema,
        paramsSchema: participantParamsSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<MessageResponseDto | void> | void> => {
            const { id, userId: targetUserId } = request.params;
            const { status, progress } = request.body;
            const currentUserId = request.user?.id;

            if (!currentUserId) {
                return jsonResponse(reply, 'Non authentifié', undefined, 401);
            }

            const challenge = await challengeRepository.findById(id);
            if (!challenge) {
                return jsonResponse(reply, 'Défi introuvable', undefined, 404);
            }

            // Check if user is authorized (creator or the participant themselves)
            const isCreator = challenge.createdBy === currentUserId;
            const isSelf = targetUserId === currentUserId;

            if (!isCreator && !isSelf) {
                return jsonResponse(reply, 'Non autorisé à modifier ce participant', undefined, 403);
            }

            const participant = await challengeRepository.findParticipant(id, targetUserId);
            if (!participant) {
                return jsonResponse(reply, 'Participant introuvable', undefined, 404);
            }

            await challengeRepository.updateParticipant(id, targetUserId, {
                status,
                progress,
                completedAt: status === 'COMPLETED' ? new Date() : undefined,
            });

            return jsonResponse(reply, 'Statut du participant mis à jour', { message: 'Statut mis à jour' }, 200);
        },
    });

    /**
     * Leave a challenge
     */
    public leaveChallenge = asyncHandler<unknown, unknown, IdParams, MessageResponseDto>({
        paramsSchema: idSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<MessageResponseDto | void> | void> => {
            const { id } = request.params;
            const userId = request.user?.id;

            if (!userId) {
                return jsonResponse(reply, 'Non authentifié', undefined, 401);
            }

            const challenge = await challengeRepository.findById(id);
            if (!challenge) {
                return jsonResponse(reply, 'Défi introuvable', undefined, 404);
            }

            // Creator cannot leave their own challenge
            if (challenge.createdBy === userId) {
                return jsonResponse(reply, 'Le créateur ne peut pas quitter son propre défi', undefined, 400);
            }

            const participant = await challengeRepository.findParticipant(id, userId);
            if (!participant) {
                return jsonResponse(reply, 'Vous ne participez pas à ce défi', undefined, 404);
            }

            await challengeRepository.removeParticipant(id, userId);

            return jsonResponse(reply, 'Vous avez quitté le défi', { message: 'Défi quitté' }, 200);
        },
    });

    /**
     * Get challenges where the current user is participating
     */
    public getParticipatingChallenges = asyncHandler<unknown, unknown, unknown, ChallengeWithDetailsDto[]>({
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<ChallengeWithDetailsDto[] | void> | void> => {
            const userId = request.user?.id;

            if (!userId) {
                return jsonResponse(reply, 'Non authentifié', undefined, 401);
            }

            const challenges = await challengeRepository.findByParticipant(userId);
            const challengesDto = challengeTransform.toChallengeWithDetailsDtoArray(challenges);

            return jsonResponse(reply, 'Défis auxquels vous participez récupérés', challengesDto, 200);
        },
    });
}

export const participantController = new ParticipantController();
