import { equipmentRepository } from "@/features/equipment/equipmentRepository";
import { equipmentTransform } from "@/features/equipment/equipmentTransform";
import { gymRepository } from "@/features/gym";
import { ApiResponse } from "@/types";
import { asyncHandler } from "@/utils";
import { jsonResponse } from "@/utils/jsonResponse";
import { logger } from "@/utils/logger";
import {
    CreateEquipmentDto,
    UpdateEquipmentDto,
    QueryEquipmentsDto,
    EquipmentDto,
    IdParams,
    idSchema,
    createEquipmentSchema,
    updateEquipmentSchema,
    queryEquipmentsSchema,
    MessageResponseDto,
    PaginatedResponse,
} from "@shared/dto";

class EquipmentController {
    private logger = logger.child({
        module: '[EQUIPMENT][CONTROLLER]',
    });

    /**
     * Create a new equipment
     */
    public createEquipment = asyncHandler<CreateEquipmentDto, unknown, unknown, EquipmentDto>({
        bodySchema: createEquipmentSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<EquipmentDto | void> | void> => {
            const data = request.body;

            // Verify gym exists
            const gym = await gymRepository.findById(data.gymId);
            if (!gym) {
                return jsonResponse(reply, 'Salle de sport introuvable', undefined, 404);
            }

            // TODO: Add authorization check - only gym owner or admin can add equipment

            const equipment = await equipmentRepository.create({
                name: data.name,
                quantity: data.quantity,
                gym: {
                    connect: { id: data.gymId }
                },
            });

            const equipmentDto = equipmentTransform.toEquipmentDto(equipment);
            return jsonResponse(reply, 'Équipement créé avec succès', equipmentDto, 201);
        },
    });

    /**
     * Get equipment by ID
     */
    public getEquipmentById = asyncHandler<unknown, unknown, IdParams, EquipmentDto>({
        paramsSchema: idSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<EquipmentDto | void> | void> => {
            const { id } = request.params;

            const equipment = await equipmentRepository.findById(id);

            if (!equipment) {
                return jsonResponse(reply, 'Équipement introuvable', undefined, 404);
            }

            const equipmentDto = equipmentTransform.toEquipmentDto(equipment);
            return jsonResponse(reply, 'Équipement récupéré', equipmentDto, 200);
        },
    });

    /**
     * Get all equipments with filters and pagination
     */
    public getAllEquipments = asyncHandler<unknown, QueryEquipmentsDto, unknown, PaginatedResponse<EquipmentDto>>({
        querySchema: queryEquipmentsSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<PaginatedResponse<EquipmentDto> | void> | void> => {
            const query = request.query;

            const result = await equipmentRepository.findAll(query);

            const equipmentsDto = equipmentTransform.toEquipmentDtoArray(result.data);

            const response: PaginatedResponse<EquipmentDto> = {
                data: equipmentsDto,
                pagination: result.pagination,
            };

            return jsonResponse(reply, 'Équipements récupérés', response, 200);
        },
    });

    /**
     * Update equipment
     */
    public updateEquipment = asyncHandler<UpdateEquipmentDto, unknown, IdParams, EquipmentDto>({
        bodySchema: updateEquipmentSchema,
        paramsSchema: idSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<EquipmentDto | void> | void> => {
            const { id } = request.params;
            const data = request.body;

            // Check if equipment exists
            const existingEquipment = await equipmentRepository.findById(id);
            if (!existingEquipment) {
                return jsonResponse(reply, 'Équipement introuvable', undefined, 404);
            }

            // TODO: Add authorization check - only gym owner or admin can update

            const equipment = await equipmentRepository.update(id, {
                name: data.name,
                quantity: data.quantity,
            });

            const equipmentDto = equipmentTransform.toEquipmentDto(equipment);
            return jsonResponse(reply, 'Équipement mis à jour', equipmentDto, 200);
        },
    });

    /**
     * Delete equipment
     */
    public deleteEquipment = asyncHandler<unknown, unknown, IdParams, MessageResponseDto>({
        paramsSchema: idSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<MessageResponseDto | void> | void> => {
            const { id } = request.params;

            // Check if equipment exists
            const existingEquipment = await equipmentRepository.findById(id);
            if (!existingEquipment) {
                return jsonResponse(reply, 'Équipement introuvable', undefined, 404);
            }

            // TODO: Add authorization check - only gym owner or admin can delete

            await equipmentRepository.delete(id);

            const response: MessageResponseDto = { message: 'Équipement supprimé' };
            return jsonResponse(reply, 'Équipement supprimé', response, 200);
        },
    });
}

export const equipmentController = new EquipmentController();
