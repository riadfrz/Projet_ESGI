import { userRepository } from "@/features/user/userRepository";
import { ApiResponse } from "@/types";
import { asyncHandler } from "@/utils";
import { jsonResponse } from "@/utils/jsonResponse";
import { logger } from "@/utils/logger";
import {
    UserDto,
    QueryUsersDto,
    UpdateUserDto,
    queryUsersSchema,
    updateUserSchema,
    IdParams,
    idSchema
} from "@shared/dto";
import { UserRole, CivilityEnum } from "@shared/enums";

class UserController {
    private logger = logger.child({
        module: '[USER][CONTROLLER]',
    });

    /**
     * Get all users with pagination
     */
    public getAllUsers = asyncHandler<unknown, QueryUsersDto, unknown, UserDto[]>({
        querySchema: queryUsersSchema,
        logger: this.logger,
        handler: async (request, reply) => {
            const { page, limit, search, role } = request.query;

            const result = await userRepository.findAll({
                page: page ? parseInt(page) : 1,
                limit: limit ? parseInt(limit) : 10,
                search,
                role: role as any,
            });

            const usersDto: UserDto[] = result.users.map(user => ({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                civility: user.civility as CivilityEnum | null,
                birthDate: user.birthDate?.toISOString() ?? null,
                role: user.role as UserRole,
                points: user.points,
                createdAt: user.createdAt.toISOString(),
                updatedAt: user.updatedAt.toISOString(),
                deletedAt: user.deletedAt?.toISOString() ?? null,
            }));

            const totalPages = Math.ceil(result.total / (limit ? parseInt(limit) : 10));
            const currentPage = page ? parseInt(page) : 1;

            return jsonResponse(reply, 'Utilisateurs récupérés', usersDto, 200, {
                currentPage,
                totalPages,
                totalItems: result.total,
                nextPage: currentPage < totalPages ? currentPage + 1 : currentPage,
                previousPage: currentPage > 1 ? currentPage - 1 : 1,
                perPage: limit ? parseInt(limit) : 10,
            });
        },
    });

    /**
     * Get user by ID
     */
    public getUserById = asyncHandler<unknown, unknown, IdParams, UserDto>({
        paramsSchema: idSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<UserDto | void> | void> => {
            const { id } = request.params;

            const user = await userRepository.findById(id);

            if (!user) {
                return jsonResponse(reply, 'Utilisateur non trouvé', undefined, 404);
            }

            const userDto: UserDto = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                civility: user.civility as CivilityEnum | null,
                birthDate: user.birthDate?.toISOString() ?? null,
                role: user.role as UserRole,
                points: user.points,
                createdAt: user.createdAt.toISOString(),
                updatedAt: user.updatedAt.toISOString(),
                deletedAt: user.deletedAt?.toISOString() ?? null,
            };

            return jsonResponse(reply, 'Utilisateur récupéré', userDto, 200);
        },
    });

    /**
     * Update user
     */
    public updateUser = asyncHandler<UpdateUserDto, unknown, IdParams, UserDto>({
        bodySchema: updateUserSchema,
        paramsSchema: idSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<UserDto | void> | void> => {
            const { id } = request.params;
            const updateData = request.body;

            const existingUser = await userRepository.findById(id);

            if (!existingUser) {
                return jsonResponse(reply, 'Utilisateur non trouvé', undefined, 404);
            }

            const updatedUser = await userRepository.update(id, updateData as any);

            const userDto: UserDto = {
                id: updatedUser.id,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
                phone: updatedUser.phone,
                civility: updatedUser.civility as CivilityEnum | null,
                birthDate: updatedUser.birthDate?.toISOString() ?? null,
                role: updatedUser.role as UserRole,
                points: updatedUser.points,
                createdAt: updatedUser.createdAt.toISOString(),
                updatedAt: updatedUser.updatedAt.toISOString(),
                deletedAt: updatedUser.deletedAt?.toISOString() ?? null,
            };

            return jsonResponse(reply, 'Utilisateur mis à jour', userDto, 200);
        },
    });

    /**
     * Delete user (soft delete)
     */
    public deleteUser = asyncHandler<unknown, unknown, IdParams, void>({
        paramsSchema: idSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<void> | void> => {
            const { id } = request.params;

            const existingUser = await userRepository.findById(id);

            if (!existingUser) {
                return jsonResponse(reply, 'Utilisateur non trouvé', undefined, 404);
            }

            await userRepository.delete(id);

            return jsonResponse(reply, 'Utilisateur supprimé', undefined, 200);
        },
    });
}

export const userController = new UserController();
