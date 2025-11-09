import { challengeRepository } from '@/features/challenge/challengeRepository';
import { challengeTransform } from '@/features/challenge/challengeTransform';
import { ApiResponse } from '@/types';
import { asyncHandler } from '@/utils';
import { jsonResponse } from '@/utils/jsonResponse';
import { logger } from '@/utils/logger';
import {
    CreateChallengeDto,
    UpdateChallengeDto,
    QueryChallengesDto,
    ChallengeWithDetailsDto,
    IdParams,
    idSchema,
    createChallengeSchema,
    updateChallengeSchema,
    queryChallengesSchema,
    MessageResponseDto,
    PaginatedResponse,
} from '@shared/dto';

class ChallengeController {
    private logger = logger.child({
        module: '[CHALLENGE][CONTROLLER]',
    });

    /**
     * Create a new challenge
     */
    public createChallenge = asyncHandler<CreateChallengeDto, unknown, unknown, ChallengeWithDetailsDto>({
        bodySchema: createChallengeSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<ChallengeWithDetailsDto | void> | void> => {
            const data = request.body;
            const userId = request.user?.id;

            if (!userId) {
                return jsonResponse(reply, 'Non authentifié', undefined, 401);
            }

            // Validate dates
            const startDate = new Date(data.startDate);
            const endDate = new Date(data.endDate);
            
            if (endDate <= startDate) {
                return jsonResponse(reply, 'La date de fin doit être après la date de début', undefined, 400);
            }

            const challenge = await challengeRepository.create({
                title: data.title,
                description: data.description,
                duration: data.duration,
                difficulty: data.difficulty,
                objectiveType: data.objectiveType,
                objectiveValue: data.objectiveValue,
                startDate,
                endDate,
                maxParticipants: data.maxParticipants,
                isPublic: data.isPublic ?? true,
                creator: {
                    connect: { id: userId },
                },
                gym: data.gymId ? { connect: { id: data.gymId } } : undefined,
            });

            // Add exercise associations if provided
            if (data.exerciseIds && data.exerciseIds.length > 0) {
                await challengeRepository.addExercises(challenge.id, data.exerciseIds);
            }

            // Fetch the challenge with all relations
            const challengeWithDetails = await challengeRepository.findById(challenge.id);
            if (!challengeWithDetails) {
                return jsonResponse(reply, 'Erreur lors de la création du défi', undefined, 500);
            }

            const challengeDto = challengeTransform.toChallengeWithDetailsDto(challengeWithDetails);
            return jsonResponse(reply, 'Défi créé avec succès', challengeDto, 201);
        },
    });

    /**
     * Get challenge by ID
     */
    public getChallengeById = asyncHandler<unknown, unknown, IdParams, ChallengeWithDetailsDto>({
        paramsSchema: idSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<ChallengeWithDetailsDto | void> | void> => {
            const { id } = request.params;

            const challenge = await challengeRepository.findById(id);

            if (!challenge) {
                return jsonResponse(reply, 'Défi introuvable', undefined, 404);
            }

            const challengeDto = challengeTransform.toChallengeWithDetailsDto(challenge);
            return jsonResponse(reply, 'Défi récupéré', challengeDto, 200);
        },
    });

    /**
     * Get all challenges with filters and pagination
     */
    public getAllChallenges = asyncHandler<unknown, QueryChallengesDto, unknown, PaginatedResponse<ChallengeWithDetailsDto>>({
        querySchema: queryChallengesSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<PaginatedResponse<ChallengeWithDetailsDto> | void> | void> => {
            const query = request.query;

            const result = await challengeRepository.findAll(query);

            const challengesDto = challengeTransform.toChallengeWithDetailsDtoArray(result.data);

            const response: PaginatedResponse<ChallengeWithDetailsDto> = {
                data: challengesDto,
                pagination: result.pagination,
            };

            return jsonResponse(reply, 'Défis récupérés', response, 200);
        },
    });

    /**
     * Update challenge (only creator can update)
     */
    public updateChallenge = asyncHandler<UpdateChallengeDto, unknown, IdParams, ChallengeWithDetailsDto>({
        bodySchema: updateChallengeSchema,
        paramsSchema: idSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<ChallengeWithDetailsDto | void> | void> => {
            const { id } = request.params;
            const data = request.body;
            const userId = request.user?.id;

            if (!userId) {
                return jsonResponse(reply, 'Non authentifié', undefined, 401);
            }

            // Check if challenge exists and user is the creator
            const existingChallenge = await challengeRepository.findById(id);
            if (!existingChallenge) {
                return jsonResponse(reply, 'Défi introuvable', undefined, 404);
            }

            if (existingChallenge.createdBy !== userId) {
                return jsonResponse(reply, 'Vous n\'êtes pas autorisé à modifier ce défi', undefined, 403);
            }

            // Validate dates if provided
            if (data.startDate || data.endDate) {
                const startDate = data.startDate ? new Date(data.startDate) : existingChallenge.startDate;
                const endDate = data.endDate ? new Date(data.endDate) : existingChallenge.endDate;
                
                if (endDate <= startDate) {
                    return jsonResponse(reply, 'La date de fin doit être après la date de début', undefined, 400);
                }
            }

            const challenge = await challengeRepository.update(id, {
                title: data.title,
                description: data.description,
                duration: data.duration,
                difficulty: data.difficulty,
                objectiveType: data.objectiveType,
                objectiveValue: data.objectiveValue,
                maxParticipants: data.maxParticipants,
                isPublic: data.isPublic,
                startDate: data.startDate ? new Date(data.startDate) : undefined,
                endDate: data.endDate ? new Date(data.endDate) : undefined,
                gym: data.gymId ? { connect: { id: data.gymId } } : undefined,
            });

            // Update exercise associations if provided
            if (data.exerciseIds) {
                await challengeRepository.updateExercises(challenge.id, data.exerciseIds);
            }

            // Fetch the updated challenge with all relations
            const challengeWithDetails = await challengeRepository.findById(challenge.id);
            if (!challengeWithDetails) {
                return jsonResponse(reply, 'Erreur lors de la mise à jour du défi', undefined, 500);
            }

            const challengeDto = challengeTransform.toChallengeWithDetailsDto(challengeWithDetails);
            return jsonResponse(reply, 'Défi mis à jour', challengeDto, 200);
        },
    });

    /**
     * Delete challenge (only creator can delete)
     */
    public deleteChallenge = asyncHandler<unknown, unknown, IdParams, MessageResponseDto>({
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

            if (challenge.createdBy !== userId) {
                return jsonResponse(reply, 'Vous n\'êtes pas autorisé à supprimer ce défi', undefined, 403);
            }

            await challengeRepository.delete(id);

            return jsonResponse(reply, 'Défi supprimé avec succès', { message: 'Défi supprimé avec succès' }, 200);
        },
    });

    /**
     * Get challenges created by the current user
     */
    public getMyChallenges = asyncHandler<unknown, unknown, unknown, ChallengeWithDetailsDto[]>({
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<ChallengeWithDetailsDto[] | void> | void> => {
            const userId = request.user?.id;

            if (!userId) {
                return jsonResponse(reply, 'Non authentifié', undefined, 401);
            }

            const challenges = await challengeRepository.findByCreator(userId);
            const challengesDto = challengeTransform.toChallengeWithDetailsDtoArray(challenges);

            return jsonResponse(reply, 'Vos défis récupérés', challengesDto, 200);
        },
    });
}

export const challengeController = new ChallengeController();
