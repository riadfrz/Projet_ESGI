import { Badge, UserBadge } from '@/config/client';
import { transformDateToString } from '@/utils';
import { 
    BadgeDto, 
    UserBadgeDto,
    UserBadgeSummaryDto
} from '@shared/dto';
import { BadgeRuleType } from '@shared/enums';

// Type for UserBadge with Badge relation
export type UserBadgeWithBadge = UserBadge & {
    badge: Badge;
};

class BadgeTransform {
    /**
     * Transform Prisma Badge to BadgeDto
     */
    toBadgeDto(badge: Badge): BadgeDto {
        return {
            id: badge.id,
            name: badge.name,
            description: badge.description || undefined,
            icon: badge.icon || undefined,
            ruleType: badge.ruleType as BadgeRuleType,
            ruleValue: badge.ruleValue,
            points: badge.points,
            createdAt: badge.createdAt.toISOString(),
            updatedAt: badge.updatedAt.toISOString(),
        };
    }

    /**
     * Transform array of Badges to BadgeDto[]
     */
    toBadgeDtos(badges: Badge[]): BadgeDto[] {
        return badges.map(badge => this.toBadgeDto(badge));
    }

    /**
     * Transform Prisma UserBadge with Badge relation to UserBadgeDto
     */
    toUserBadgeDto(userBadge: UserBadgeWithBadge): UserBadgeDto {
        return {
            id: userBadge.id,
            userId: userBadge.userId,
            badgeId: userBadge.badgeId,
            earnedAt: userBadge.earnedAt.toISOString(),
            badge: this.toBadgeDto(userBadge.badge),
        };
    }

    /**
     * Transform array of UserBadges to UserBadgeDto[]
     */
    toUserBadgeDtos(userBadges: UserBadgeWithBadge[]): UserBadgeDto[] {
        return userBadges.map(ub => this.toUserBadgeDto(ub));
    }

    /**
     * Transform user badges to summary with totals
     */
    toUserBadgeSummaryDto(userBadges: UserBadgeWithBadge[]): UserBadgeSummaryDto {
        const badges = this.toUserBadgeDtos(userBadges);
        const totalPoints = userBadges.reduce((sum, ub) => sum + ub.badge.points, 0);

        return {
            totalBadges: badges.length,
            totalPoints,
            badges,
        };
    }
}

export const badgeTransform = new BadgeTransform();
