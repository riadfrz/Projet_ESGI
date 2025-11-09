import { trainingSessionRepository } from '@/features/trainingSession/trainingSessionRepository';
import { trainingSessionTransform } from '@/features/trainingSession/trainingSessionTransform';
import { ApiResponse } from '@/types';
import { asyncHandler } from '@/utils';
import { jsonResponse } from '@/utils/jsonResponse';
import { logger } from '@/utils/logger';
import {
    CreateTrainingSessionDto,
    UpdateTrainingSessionDto,
    QueryTrainingSessionsDto,
    TrainingSessionWithDetailsDto,
    TrainingStatsDto,
    ChallengeProgressDto,
    IdParams,
    idSchema,
    createTrainingSessionSchema,
    updateTrainingSessionSchema,
    queryTrainingSessionsSchema,
    MessageResponseDto,
    PaginatedResponse,
} from '@shared/dto';

class TrainingSessionController {
    private logger = logger.child({
        module: '[TRAINING_SESSION][CONTROLLER]',
    });

    /**
     * Create a new training session
     */
    public createTrainingSession = asyncHandler<CreateTrainingSessionDto, unknown, unknown, TrainingSessionWithDetailsDto>({
        bodySchema: createTrainingSessionSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<TrainingSessionWithDetailsDto | void> | void> => {
            const data = request.body;
            const userId = request.user?.id;

            if (!userId) {
                return jsonResponse(reply, 'Non authentifié', undefined, 401);
            }

            const session = await trainingSessionRepository.create({
                date: new Date(data.date),
                duration: data.duration,
                caloriesBurned: data.caloriesBurned,
                repetitions: data.repetitions,
                notes: data.notes,
                user: { connect: { id: userId } },
                exercise: { connect: { id: data.exerciseId } },
                challenge: data.challengeId ? { connect: { id: data.challengeId } } : undefined,
                gym: data.gymId ? { connect: { id: data.gymId } } : undefined,
            });

            const sessionDto = trainingSessionTransform.toTrainingSessionWithDetailsDto(session);
            return jsonResponse(reply, 'Session enregistrée avec succès', sessionDto, 201);
        },
    });

    /**
     * Get training session by ID
     */
    public getTrainingSessionById = asyncHandler<unknown, unknown, IdParams, TrainingSessionWithDetailsDto>({
        paramsSchema: idSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<TrainingSessionWithDetailsDto | void> | void> => {
            const { id } = request.params;
            const userId = request.user?.id;

            if (!userId) {
                return jsonResponse(reply, 'Non authentifié', undefined, 401);
            }

            const session = await trainingSessionRepository.findById(id);

            if (!session) {
                return jsonResponse(reply, 'Session introuvable', undefined, 404);
            }

            // Check if session belongs to user
            if (session.userId !== userId) {
                return jsonResponse(reply, 'Non autorisé', undefined, 403);
            }

            const sessionDto = trainingSessionTransform.toTrainingSessionWithDetailsDto(session);
            return jsonResponse(reply, 'Session récupérée', sessionDto, 200);
        },
    });

    /**
     * Get all training sessions for current user with filters and pagination
     */
    public getAllTrainingSessions = asyncHandler<unknown, QueryTrainingSessionsDto, unknown, PaginatedResponse<TrainingSessionWithDetailsDto>>({
        querySchema: queryTrainingSessionsSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<PaginatedResponse<TrainingSessionWithDetailsDto> | void> | void> => {
            const query = request.query;
            const userId = request.user?.id;

            if (!userId) {
                return jsonResponse(reply, 'Non authentifié', undefined, 401);
            }

            const result = await trainingSessionRepository.findAllByUser(userId, query);

            const sessionsDto = trainingSessionTransform.toTrainingSessionWithDetailsDtoArray(result.data);

            const response: PaginatedResponse<TrainingSessionWithDetailsDto> = {
                data: sessionsDto,
                pagination: result.pagination,
            };

            return jsonResponse(reply, 'Sessions récupérées', response, 200);
        },
    });

    /**
     * Update training session (only owner can update)
     */
    public updateTrainingSession = asyncHandler<UpdateTrainingSessionDto, unknown, IdParams, TrainingSessionWithDetailsDto>({
        bodySchema: updateTrainingSessionSchema,
        paramsSchema: idSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<TrainingSessionWithDetailsDto | void> | void> => {
            const { id } = request.params;
            const data = request.body;
            const userId = request.user?.id;

            if (!userId) {
                return jsonResponse(reply, 'Non authentifié', undefined, 401);
            }

            // Check if session exists and user is the owner
            const existingSession = await trainingSessionRepository.findById(id);
            if (!existingSession) {
                return jsonResponse(reply, 'Session introuvable', undefined, 404);
            }

            if (existingSession.userId !== userId) {
                return jsonResponse(reply, 'Vous n\'êtes pas autorisé à modifier cette session', undefined, 403);
            }

            const session = await trainingSessionRepository.update(id, {
                date: data.date ? new Date(data.date) : undefined,
                duration: data.duration,
                caloriesBurned: data.caloriesBurned,
                repetitions: data.repetitions,
                notes: data.notes,
                exercise: data.exerciseId ? { connect: { id: data.exerciseId } } : undefined,
                challenge: data.challengeId ? { connect: { id: data.challengeId } } : undefined,
                gym: data.gymId ? { connect: { id: data.gymId } } : undefined,
            });

            const sessionDto = trainingSessionTransform.toTrainingSessionWithDetailsDto(session);
            return jsonResponse(reply, 'Session mise à jour', sessionDto, 200);
        },
    });

    /**
     * Delete training session (only owner can delete)
     */
    public deleteTrainingSession = asyncHandler<unknown, unknown, IdParams, MessageResponseDto>({
        paramsSchema: idSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<MessageResponseDto | void> | void> => {
            const { id } = request.params;
            const userId = request.user?.id;

            if (!userId) {
                return jsonResponse(reply, 'Non authentifié', undefined, 401);
            }

            const session = await trainingSessionRepository.findById(id);
            if (!session) {
                return jsonResponse(reply, 'Session introuvable', undefined, 404);
            }

            if (session.userId !== userId) {
                return jsonResponse(reply, 'Vous n\'êtes pas autorisé à supprimer cette session', undefined, 403);
            }

            await trainingSessionRepository.delete(id);

            return jsonResponse(reply, 'Session supprimée avec succès', { message: 'Session supprimée avec succès' }, 200);
        },
    });

    /**
     * Get user statistics
     */
    public getStats = asyncHandler<unknown, unknown, unknown, TrainingStatsDto>({
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<TrainingStatsDto | void> | void> => {
            const userId = request.user?.id;

            if (!userId) {
                return jsonResponse(reply, 'Non authentifié', undefined, 401);
            }

            const stats = await trainingSessionRepository.getUserStats(userId);

            const averageDuration = stats.totalSessions > 0 ? stats.totalDuration / stats.totalSessions : 0;
            const averageCalories = stats.totalSessions > 0 ? stats.totalCalories / stats.totalSessions : 0;

            const recentSessionsDto = trainingSessionTransform.toTrainingSessionWithDetailsDtoArray(stats.recentSessions);

            const statsDto: TrainingStatsDto = {
                totalSessions: stats.totalSessions,
                totalDuration: stats.totalDuration,
                totalCalories: stats.totalCalories,
                totalRepetitions: stats.totalRepetitions,
                averageDuration: Math.round(averageDuration),
                averageCalories: Math.round(averageCalories),
                sessionsThisWeek: stats.sessionsThisWeek,
                sessionsThisMonth: stats.sessionsThisMonth,
                favoriteExercise: stats.favoriteExercise,
                recentSessions: recentSessionsDto,
            };

            return jsonResponse(reply, 'Statistiques récupérées', statsDto, 200);
        },
    });

    /**
     * Get challenge progress for user
     */
    public getChallengeProgress = asyncHandler<unknown, unknown, IdParams, ChallengeProgressDto>({
        paramsSchema: idSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<ChallengeProgressDto | void> | void> => {
            const { id } = request.params;
            const userId = request.user?.id;

            if (!userId) {
                return jsonResponse(reply, 'Non authentifié', undefined, 401);
            }

            const progress = await trainingSessionRepository.getChallengeProgress(id, userId);

            if (!progress) {
                return jsonResponse(reply, 'Défi introuvable', undefined, 404);
            }

            const sessionsDto = trainingSessionTransform.toTrainingSessionWithDetailsDtoArray(progress.sessions);

            // Calculate current progress based on objective type
            let currentProgress = 0;
            if (progress.challenge.objectiveType === 'DURATION') {
                currentProgress = progress.totalDuration;
            } else if (progress.challenge.objectiveType === 'REPS' || progress.challenge.objectiveType === 'REPETITIONS') {
                currentProgress = progress.totalRepetitions;
            } else {
                // For other types, use session count
                currentProgress = progress.sessionsCount;
            }

            const progressPercentage = Math.min(100, Math.round((currentProgress / progress.challenge.objectiveValue) * 100));
            const isCompleted = currentProgress >= progress.challenge.objectiveValue;

            const progressDto: ChallengeProgressDto = {
                challengeId: progress.challenge.id,
                challengeTitle: progress.challenge.title,
                objectiveType: progress.challenge.objectiveType,
                objectiveValue: progress.challenge.objectiveValue,
                currentProgress,
                progressPercentage,
                sessionsCount: progress.sessionsCount,
                totalDuration: progress.totalDuration,
                totalRepetitions: progress.totalRepetitions,
                isCompleted,
                sessions: sessionsDto,
            };

            return jsonResponse(reply, 'Progression récupérée', progressDto, 200);
        },
    });
}

export const trainingSessionController = new TrainingSessionController();
