import { exerciseRepository } from "@/features/exercise/exerciseRepository";
import { exerciseTransform } from "@/features/exercise/exerciseTransform";
import { ApiResponse } from "@/types";
import { asyncHandler } from "@/utils";
import { jsonResponse } from "@/utils/jsonResponse";
import { logger } from "@/utils/logger";
import {
    CreateExerciseDto,
    UpdateExerciseDto,
    QueryExercisesDto,
    ExerciseDto,
    ExerciseWithMusclesDto,
    IdParams,
    idSchema,
    createExerciseSchema,
    updateExerciseSchema,
    queryExercisesSchema,
    MessageResponseDto,
    PaginatedResponse,
} from "@shared/dto";
import { $Enums } from "@/config/client";

class ExerciseController {
    private logger = logger.child({
        module: '[EXERCISE][CONTROLLER]',
    });

    /**
     * Create a new exercise (ADMIN only)
     */
    public createExercise = asyncHandler<CreateExerciseDto, unknown, unknown, ExerciseWithMusclesDto>({
        bodySchema: createExerciseSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<ExerciseWithMusclesDto | void> | void> => {
            const data = request.body;

            // TODO: Add ADMIN role check

            const exercise = await exerciseRepository.create({
                name: data.name,
                description: data.description,
                difficulty: data.difficulty as $Enums.Difficulty,
            });

            // Add muscle associations if provided
            if (data.muscleIds && data.muscleIds.length > 0) {
                await exerciseRepository.updateExerciseMuscles(exercise.id, data.muscleIds);
            }

            // Fetch the exercise with muscles
            const exerciseWithMuscles = await exerciseRepository.findById(exercise.id);
            if (!exerciseWithMuscles) {
                return jsonResponse(reply, 'Erreur lors de la création de l\'exercice', undefined, 500);
            }

            const exerciseDto = exerciseTransform.toExerciseWithMusclesDto(exerciseWithMuscles);
            return jsonResponse(reply, 'Exercice créé avec succès', exerciseDto, 201);
        },
    });

    /**
     * Get exercise by ID
     */
    public getExerciseById = asyncHandler<unknown, unknown, IdParams, ExerciseWithMusclesDto>({
        paramsSchema: idSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<ExerciseWithMusclesDto | void> | void> => {
            const { id } = request.params;

            const exercise = await exerciseRepository.findById(id);

            if (!exercise) {
                return jsonResponse(reply, 'Exercice introuvable', undefined, 404);
            }

            const exerciseDto = exerciseTransform.toExerciseWithMusclesDto(exercise);
            return jsonResponse(reply, 'Exercice récupéré', exerciseDto, 200);
        },
    });

    /**
     * Get all exercises with filters and pagination
     */
    public getAllExercises = asyncHandler<unknown, QueryExercisesDto, unknown, PaginatedResponse<ExerciseWithMusclesDto>>({
        querySchema: queryExercisesSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<PaginatedResponse<ExerciseWithMusclesDto> | void> | void> => {
            const query = request.query;

            const result = await exerciseRepository.findAll(query);

            const exercisesDto = exerciseTransform.toExerciseWithMusclesDtoArray(result.data);

            const response: PaginatedResponse<ExerciseWithMusclesDto> = {
                data: exercisesDto,
                pagination: result.pagination,
            };

            return jsonResponse(reply, 'Exercices récupérés', response, 200);
        },
    });

    /**
     * Update exercise (ADMIN only)
     */
    public updateExercise = asyncHandler<UpdateExerciseDto, unknown, IdParams, ExerciseWithMusclesDto>({
        bodySchema: updateExerciseSchema,
        paramsSchema: idSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<ExerciseWithMusclesDto | void> | void> => {
            const { id } = request.params;
            const data = request.body;

            // Check if exercise exists
            const existingExercise = await exerciseRepository.findById(id);
            if (!existingExercise) {
                return jsonResponse(reply, 'Exercice introuvable', undefined, 404);
            }

            // TODO: Add ADMIN role check

            const exercise = await exerciseRepository.update(id, {
                name: data.name,
                description: data.description,
                difficulty: data.difficulty ? data.difficulty as $Enums.Difficulty : undefined,
            });

            // Update muscle associations if provided
            if (data.muscleIds) {
                await exerciseRepository.updateExerciseMuscles(exercise.id, data.muscleIds);
            }

            // Fetch the updated exercise with muscles
            const exerciseWithMuscles = await exerciseRepository.findById(exercise.id);
            if (!exerciseWithMuscles) {
                return jsonResponse(reply, 'Erreur lors de la mise à jour de l\'exercice', undefined, 500);
            }

            const exerciseDto = exerciseTransform.toExerciseWithMusclesDto(exerciseWithMuscles);
            return jsonResponse(reply, 'Exercice mis à jour', exerciseDto, 200);
        },
    });

    /**
     * Delete exercise (ADMIN only)
     */
    public deleteExercise = asyncHandler<unknown, unknown, IdParams, MessageResponseDto>({
        paramsSchema: idSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<MessageResponseDto | void> | void> => {
            const { id } = request.params;

            // Check if exercise exists
            const existingExercise = await exerciseRepository.findById(id);
            if (!existingExercise) {
                return jsonResponse(reply, 'Exercice introuvable', undefined, 404);
            }

            // TODO: Add ADMIN role check

            await exerciseRepository.delete(id);

            const response: MessageResponseDto = { message: 'Exercice supprimé' };
            return jsonResponse(reply, 'Exercice supprimé', response, 200);
        },
    });
}

export const exerciseController = new ExerciseController();
