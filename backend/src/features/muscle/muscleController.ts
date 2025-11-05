import { muscleRepository } from "@/features/muscle/muscleRepository";
import { muscleTransform } from "@/features/muscle/muscleTransform";
import { ApiResponse } from "@/types";
import { asyncHandler } from "@/utils";
import { jsonResponse } from "@/utils/jsonResponse";
import { logger } from "@/utils/logger";
import {
    CreateMuscleDto,
    UpdateMuscleDto,
    QueryMusclesDto,
    MuscleDto,
    IdParams,
    idSchema,
    createMuscleSchema,
    updateMuscleSchema,
    queryMusclesSchema,
    MessageResponseDto,
    PaginatedResponse,
} from "@shared/dto";

class MuscleController {
    private logger = logger.child({
        module: '[MUSCLE][CONTROLLER]',
    });

    /**
     * Create a new muscle
     */
    public createMuscle = asyncHandler<CreateMuscleDto, unknown, unknown, MuscleDto>({
        bodySchema: createMuscleSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<MuscleDto | void> | void> => {
            const data = request.body;

            // Check if muscle name already exists
            const existingMuscle = await muscleRepository.findByName(data.name);
            if (existingMuscle) {
                return jsonResponse(reply, 'Un muscle avec ce nom existe déjà', undefined, 409);
            }

            const muscle = await muscleRepository.create({
                name: data.name,
                description: data.description,
                picture: data.picture,
            });

            const muscleDto = muscleTransform.toMuscleDto(muscle);
            return jsonResponse(reply, 'Muscle créé avec succès', muscleDto, 201);
        },
    });

    /**
     * Get muscle by ID
     */
    public getMuscleById = asyncHandler<unknown, unknown, IdParams, MuscleDto>({
        paramsSchema: idSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<MuscleDto | void> | void> => {
            const { id } = request.params;

            const muscle = await muscleRepository.findById(id);

            if (!muscle) {
                return jsonResponse(reply, 'Muscle introuvable', undefined, 404);
            }

            const muscleDto = muscleTransform.toMuscleDto(muscle);
            return jsonResponse(reply, 'Muscle récupéré', muscleDto, 200);
        },
    });

    /**
     * Get all muscles with filters and pagination
     */
    public getAllMuscles = asyncHandler<unknown, QueryMusclesDto, unknown, PaginatedResponse<MuscleDto>>({
        querySchema: queryMusclesSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<PaginatedResponse<MuscleDto> | void> | void> => {
            const query = request.query;

            const result = await muscleRepository.findAll(query);

            const musclesDto = muscleTransform.toMuscleDtoArray(result.data);

            const response: PaginatedResponse<MuscleDto> = {
                data: musclesDto,
                pagination: result.pagination,
            };

            return jsonResponse(reply, 'Muscles récupérés', response, 200);
        },
    });

    /**
     * Update muscle
     */
    public updateMuscle = asyncHandler<UpdateMuscleDto, unknown, IdParams, MuscleDto>({
        bodySchema: updateMuscleSchema,
        paramsSchema: idSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<MuscleDto | void> | void> => {
            const { id } = request.params;
            const data = request.body;

            // Check if muscle exists
            const existingMuscle = await muscleRepository.findById(id);
            if (!existingMuscle) {
                return jsonResponse(reply, 'Muscle introuvable', undefined, 404);
            }

            // Check if name is being updated and if it already exists
            if (data.name && data.name !== existingMuscle.name) {
                const muscleWithSameName = await muscleRepository.findByName(data.name);
                if (muscleWithSameName) {
                    return jsonResponse(reply, 'Un muscle avec ce nom existe déjà', undefined, 409);
                }
            }

            const muscle = await muscleRepository.update(id, {
                name: data.name,
                description: data.description,
                picture: data.picture,
            });

            const muscleDto = muscleTransform.toMuscleDto(muscle);
            return jsonResponse(reply, 'Muscle mis à jour', muscleDto, 200);
        },
    });

    /**
     * Delete muscle
     */
    public deleteMuscle = asyncHandler<unknown, unknown, IdParams, MessageResponseDto>({
        paramsSchema: idSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<MessageResponseDto | void> | void> => {
            const { id } = request.params;

            // Check if muscle exists
            const existingMuscle = await muscleRepository.findById(id);
            if (!existingMuscle) {
                return jsonResponse(reply, 'Muscle introuvable', undefined, 404);
            }

            await muscleRepository.delete(id);

            const response: MessageResponseDto = { message: 'Muscle supprimé' };
            return jsonResponse(reply, 'Muscle supprimé', response, 200);
        },
    });
}

export const muscleController = new MuscleController();
