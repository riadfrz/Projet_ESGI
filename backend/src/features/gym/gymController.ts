import { gymRepository } from "@/features/gym";
import { gymTransform } from "@/features/gym/gymTransform";
import { ApiResponse } from "@/types";
import { asyncHandler } from "@/utils";
import { jsonResponse } from "@/utils/jsonResponse";
import { logger } from "@/utils/logger";
import {
    CreateGymDto,
    UpdateGymDto,
    QueryGymsDto,
    UpdateGymStatusDto,
    GymDto,
    IdParams,
    idSchema,
    createGymSchema,
    updateGymSchema,
    queryGymsSchema,
    updateGymStatusSchema,
    MessageResponseDto,
    PaginatedResponse,
} from "@shared/dto";
import { $Enums } from "@/config/client";

class GymController {
    private logger = logger.child({
        module: '[GYM][CONTROLLER]',
    });

    /**
     * Create a new gym (ADMIN or GYM_OWNER)
     */
    public createGym = asyncHandler<CreateGymDto, unknown, unknown, GymDto>({
        bodySchema: createGymSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<GymDto | void> | void> => {
            try {
                const data = request.body;
                const currentUser = request.user;

                this.logger.info('Creating gym with data:', { data, user: currentUser?.email });

                if (!currentUser) {
                    return jsonResponse(reply, 'Non authentifié', undefined, 401);
                }

                // Determine ownerId:
                // - If ADMIN and ownerId provided in body, use it
                // - Otherwise, use the authenticated user's ID
                const ownerId = (currentUser.role === 'ADMIN' && data.ownerId)
                    ? data.ownerId
                    : currentUser.id;

                this.logger.info('Owner ID determined:', { ownerId, userRole: currentUser.role });

                const gym = await gymRepository.create({
                    name: data.name,
                    description: data.description,
                    address: data.address,
                    city: data.city,
                    zipCode: data.zipCode,
                    country: data.country,
                    phone: data.phone,
                    email: data.email,
                    capacity: data.capacity,
                    owner: {
                        connect: { id: ownerId }
                    },
                });

                this.logger.info('Gym created successfully:', { gymId: gym.id });

                const gymDto = gymTransform.toGymDto(gym);
                return jsonResponse(reply, 'Salle de sport créée avec succès', gymDto, 201);
            } catch (error) {
                this.logger.error('Error creating gym:', error);
                throw error;
            }
        },
    });

    /**
     * Get gym by ID
     */
    public getGymById = asyncHandler<unknown, unknown, IdParams, GymDto>({
        paramsSchema: idSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<GymDto | void> | void> => {
            const { id } = request.params;

            const gym = await gymRepository.findById(id);

            if (!gym) {
                return jsonResponse(reply, 'Salle de sport introuvable', undefined, 404);
            }

            const gymDto = gymTransform.toGymDto(gym);
            return jsonResponse(reply, 'Salle de sport récupérée', gymDto, 200);
        },
    });

    /**
     * Get all gyms with filters and pagination
     */
    public getAllGyms = asyncHandler<unknown, QueryGymsDto, unknown, PaginatedResponse<GymDto>>({
        querySchema: queryGymsSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<PaginatedResponse<GymDto> | void> | void> => {
            const query = request.query;

            const result = await gymRepository.findAll(query);

            const gymsDto = gymTransform.toGymDtoArray(result.data);

            const response: PaginatedResponse<GymDto> = {
                data: gymsDto,
                pagination: result.pagination,
            };

            return jsonResponse(reply, 'Salles de sport récupérées', response, 200);
        },
    });

    /**
     * Update gym (ADMIN or gym owner)
     */
    public updateGym = asyncHandler<UpdateGymDto, unknown, IdParams, GymDto>({
        bodySchema: updateGymSchema,
        paramsSchema: idSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<GymDto | void> | void> => {
            const { id } = request.params;
            const data = request.body;

            // Check if gym exists
            const existingGym = await gymRepository.findById(id);
            if (!existingGym) {
                return jsonResponse(reply, 'Salle de sport introuvable', undefined, 404);
            }

            // TODO: Add authorization check - only owner or admin can update

            const gym = await gymRepository.update(id, {
                name: data.name,
                description: data.description,
                address: data.address,
                city: data.city,
                zipCode: data.zipCode,
                country: data.country,
                phone: data.phone,
                email: data.email,
                capacity: data.capacity,
            });

            const gymDto = gymTransform.toGymDto(gym);
            return jsonResponse(reply, 'Salle de sport mise à jour', gymDto, 200);
        },
    });

    /**
     * Update gym status - Approve/Reject (ADMIN only)
     */
    public updateGymStatus = asyncHandler<UpdateGymStatusDto, unknown, IdParams, GymDto>({
        bodySchema: updateGymStatusSchema,
        paramsSchema: idSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<GymDto | void> | void> => {
            const { id } = request.params;
            const { status } = request.body;

            // Check if gym exists
            const existingGym = await gymRepository.findById(id);
            if (!existingGym) {
                return jsonResponse(reply, 'Salle de sport introuvable', undefined, 404);
            }

            // TODO: Add ADMIN role check

            const gym = await gymRepository.update(id, {
                status: status as $Enums.GymStatus,
            });

            const gymDto = gymTransform.toGymDto(gym);

            const message = status === 'APPROVED'
                ? 'Salle de sport approuvée'
                : status === 'REJECTED'
                ? 'Salle de sport rejetée'
                : 'Statut de la salle de sport mis à jour';

            return jsonResponse(reply, message, gymDto, 200);
        },
    });

    /**
     * Delete gym (ADMIN only)
     */
    public deleteGym = asyncHandler<unknown, unknown, IdParams, MessageResponseDto>({
        paramsSchema: idSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<MessageResponseDto | void> | void> => {
            const { id } = request.params;

            // Check if gym exists
            const existingGym = await gymRepository.findById(id);
            if (!existingGym) {
                return jsonResponse(reply, 'Salle de sport introuvable', undefined, 404);
            }

            // TODO: Add ADMIN role check

            await gymRepository.delete(id);

            const response: MessageResponseDto = { message: 'Salle de sport supprimée' };
            return jsonResponse(reply, 'Salle de sport supprimée', response, 200);
        },
    });
}

export const gymController = new GymController();
