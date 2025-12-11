import { asyncHandler } from '@/utils';
import { jsonResponse } from '@/utils/jsonResponse';
import { badgeRepository } from './badgeRepository';
import { badgeTransform } from './badgeTransform';
import {
    UserBadgeSummaryDto,
    IdParams,
    idSchema,
} from '@shared/dto';

class UserBadgeController {
    /**
     * Get my badges (Authenticated user)
     * GET /api/users/me/badges
     */
    getMyBadges = asyncHandler<unknown, unknown, unknown, UserBadgeSummaryDto>({
        handler: async (request, reply) => {
            const userId = request.user?.id;

            if (!userId) {
                return jsonResponse(reply, 'Non authentifié', undefined, 401);
            }

            const userBadges = await badgeRepository.findUserBadges(userId);
            const summary = badgeTransform.toUserBadgeSummaryDto(userBadges);

            return jsonResponse(reply, 'Vos badges récupérés', summary, 200);
        },
    });

    /**
     * Get badges for a specific user (Public)
     * GET /api/users/:id/badges
     */
    getUserBadges = asyncHandler<unknown, unknown, IdParams, UserBadgeSummaryDto>({
        paramsSchema: idSchema,
        handler: async (request, reply) => {
            const userId = request.params.id;

            const userBadges = await badgeRepository.findUserBadges(userId);
            const summary = badgeTransform.toUserBadgeSummaryDto(userBadges);

            return jsonResponse(reply, 'Badges de l\'utilisateur récupérés', summary, 200);
        },
    });
}

export const userBadgeController = new UserBadgeController();
