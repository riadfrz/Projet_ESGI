import { asyncHandler } from '@/utils';
import { jsonResponse } from '@/utils/jsonResponse';
import { badgeRepository } from './badgeRepository';
import { badgeTransform } from './badgeTransform';
import {
    CreateBadgeDto,
    UpdateBadgeDto,
    QueryBadgesDto,
    BadgeDto,
    MessageResponseDto,
    PaginatedResponseDto,
    IdParams,
    BadgeCheckResultDto,
    createBadgeSchema,
    updateBadgeSchema,
    queryBadgesSchema,
    idSchema,
} from '@shared/dto';

class BadgeController {
    /**
     * Create a new badge (ADMIN only)
     * POST /api/badges
     */
    createBadge = asyncHandler<CreateBadgeDto, unknown, unknown, BadgeDto>({
        bodySchema: createBadgeSchema,
        handler: async (request, reply) => {
            // Check if badge with same name exists
            const existingBadge = await badgeRepository.findByName(request.body.name);
            if (existingBadge) {
                return jsonResponse(
                    reply,
                    'Un badge avec ce nom existe déjà',
                    undefined,
                    409
                );
            }

            const badge = await badgeRepository.create(request.body);
            const badgeDto = badgeTransform.toBadgeDto(badge);

            return jsonResponse(reply, 'Badge créé avec succès', badgeDto, 201);
        },
    });

    /**
     * Get all badges with filters and pagination
     * GET /api/badges
     */
    getAllBadges = asyncHandler<unknown, QueryBadgesDto, unknown, PaginatedResponseDto<BadgeDto>>({
        querySchema: queryBadgesSchema,
        handler: async (request, reply) => {
            const { badges, total } = await badgeRepository.findAll(request.query);
            const badgeDtos = badgeTransform.toBadgeDtos(badges);

            const page = parseInt(request.query.page || '1');
            const limit = parseInt(request.query.limit || '10');

            return jsonResponse(reply, 'Badges récupérés', {
                data: badgeDtos,
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            }, 200);
        },
    });

    /**
     * Get badge by ID
     * GET /api/badges/:id
     */
    getBadgeById = asyncHandler<unknown, unknown, IdParams, BadgeDto>({
        paramsSchema: idSchema,
        handler: async (request, reply) => {
            const badge = await badgeRepository.findById(request.params.id);

            if (!badge) {
                return jsonResponse(reply, 'Badge introuvable', undefined, 404);
            }

            const badgeDto = badgeTransform.toBadgeDto(badge);
            return jsonResponse(reply, 'Badge récupéré', badgeDto, 200);
        },
    });

    /**
     * Update badge (ADMIN only)
     * PUT /api/badges/:id
     */
    updateBadge = asyncHandler<UpdateBadgeDto, unknown, IdParams, BadgeDto>({
        paramsSchema: idSchema,
        bodySchema: updateBadgeSchema,
        handler: async (request, reply) => {
            const badge = await badgeRepository.findById(request.params.id);

            if (!badge) {
                return jsonResponse(reply, 'Badge introuvable', undefined, 404);
            }

            // Check if name is being changed and if it conflicts
            if (request.body.name && request.body.name !== badge.name) {
                const existingBadge = await badgeRepository.findByName(request.body.name);
                if (existingBadge) {
                    return jsonResponse(
                        reply,
                        'Un badge avec ce nom existe déjà',
                        undefined,
                        409
                    );
                }
            }

            const updatedBadge = await badgeRepository.update(request.params.id, request.body);
            const badgeDto = badgeTransform.toBadgeDto(updatedBadge);

            return jsonResponse(reply, 'Badge mis à jour', badgeDto, 200);
        },
    });

    /**
     * Delete badge (ADMIN only)
     * DELETE /api/badges/:id
     */
    deleteBadge = asyncHandler<unknown, unknown, IdParams, MessageResponseDto>({
        paramsSchema: idSchema,
        handler: async (request, reply) => {
            const badge = await badgeRepository.findById(request.params.id);

            if (!badge) {
                return jsonResponse(reply, 'Badge introuvable', undefined, 404);
            }

            await badgeRepository.delete(request.params.id);

            return jsonResponse(reply, 'Badge supprimé', undefined, 200);
        },
    });

    /**
     * Check and award badges for all users (Cron job endpoint - ADMIN only)
     * POST /api/badges/check
     */
    checkBadges = asyncHandler<unknown, unknown, unknown, BadgeCheckResultDto[]>({
        handler: async (request, reply) => {
            const userIds = await badgeRepository.findAllUsersForBadgeCheck();
            const results: BadgeCheckResultDto[] = [];

            for (const userId of userIds) {
                const newBadges = await badgeRepository.checkAndAwardBadges(userId);
                
                if (newBadges.length > 0) {
                    results.push({
                        userId,
                        newBadges: badgeTransform.toBadgeDtos(newBadges),
                        totalChecked: newBadges.length,
                    });
                }
            }

            return jsonResponse(
                reply,
                `Vérification des badges terminée. ${results.length} utilisateurs ont reçu de nouveaux badges.`,
                results,
                200
            );
        },
    });
}

export const badgeController = new BadgeController();
