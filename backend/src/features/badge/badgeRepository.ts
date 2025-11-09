import prisma from '@/config/prisma';
import { Badge, UserBadge, Prisma } from '@/config/client';
import { CreateBadgeDto, UpdateBadgeDto, QueryBadgesDto } from '@shared/dto';
import { BadgeRuleType } from '@shared/enums';
import { UserBadgeWithBadge } from './badgeTransform';

class BadgeRepository {
    // ========================================================================
    // Badge CRUD Operations (Admin)
    // ========================================================================

    /**
     * Create a new badge
     */
    async create(data: CreateBadgeDto): Promise<Badge> {
        return prisma.badge.create({
            data: {
                name: data.name,
                description: data.description,
                icon: data.icon,
                ruleType: data.ruleType,
                ruleValue: data.ruleValue,
                points: data.points || 0,
            },
        });
    }

    /**
     * Find badge by ID
     */
    async findById(id: string): Promise<Badge | null> {
        return prisma.badge.findUnique({
            where: { id },
        });
    }

    /**
     * Find badge by name
     */
    async findByName(name: string): Promise<Badge | null> {
        return prisma.badge.findUnique({
            where: { name },
        });
    }

    /**
     * Find all badges with filters and pagination
     */
    async findAll(query: QueryBadgesDto): Promise<{ badges: Badge[]; total: number }> {
        const page = parseInt(query.page || '1');
        const limit = parseInt(query.limit || '10');
        const skip = (page - 1) * limit;

        const where: Prisma.BadgeWhereInput = {};

        // Filter by rule type
        if (query.ruleType) {
            where.ruleType = query.ruleType;
        }

        // Search in name or description
        if (query.search) {
            where.OR = [
                { name: { contains: query.search } },
                { description: { contains: query.search } },
            ];
        }

        const [badges, total] = await Promise.all([
            prisma.badge.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.badge.count({ where }),
        ]);

        return { badges, total };
    }

    /**
     * Update badge
     */
    async update(id: string, data: UpdateBadgeDto): Promise<Badge> {
        return prisma.badge.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
                icon: data.icon,
                ruleType: data.ruleType,
                ruleValue: data.ruleValue,
                points: data.points,
            },
        });
    }

    /**
     * Delete badge
     */
    async delete(id: string): Promise<Badge> {
        return prisma.badge.delete({
            where: { id },
        });
    }

    // ========================================================================
    // User Badge Operations
    // ========================================================================

    /**
     * Award badge to user
     */
    async awardBadge(userId: string, badgeId: string): Promise<UserBadge> {
        return prisma.userBadge.create({
            data: {
                userId,
                badgeId,
            },
        });
    }

    /**
     * Check if user has badge
     */
    async userHasBadge(userId: string, badgeId: string): Promise<boolean> {
        const userBadge = await prisma.userBadge.findUnique({
            where: {
                userId_badgeId: {
                    userId,
                    badgeId,
                },
            },
        });
        return !!userBadge;
    }

    /**
     * Get user's badges with badge details
     */
    async findUserBadges(userId: string): Promise<UserBadgeWithBadge[]> {
        return prisma.userBadge.findMany({
            where: { userId },
            include: { badge: true },
            orderBy: { earnedAt: 'desc' },
        });
    }

    /**
     * Get all users with their badges (for checking)
     */
    async findAllUsersForBadgeCheck(): Promise<string[]> {
        const users = await prisma.user.findMany({
            select: { id: true },
        });
        return users.map(u => u.id);
    }

    /**
     * Get all badges for checking eligibility
     */
    async findAllBadgesForCheck(): Promise<Badge[]> {
        return prisma.badge.findMany();
    }

    // ========================================================================
    // Badge Checking Logic
    // ========================================================================

    /**
     * Check user's training stats for badge eligibility
     */
    async getUserTrainingStats(userId: string): Promise<{
        totalSessions: number;
        totalDuration: number;
        totalCalories: number;
        totalRepetitions: number;
    }> {
        const stats = await prisma.trainingSession.aggregate({
            where: { userId },
            _count: { id: true },
            _sum: {
                duration: true,
                caloriesBurned: true,
                repetitions: true,
            },
        });

        return {
            totalSessions: stats._count.id,
            totalDuration: stats._sum.duration || 0,
            totalCalories: stats._sum.caloriesBurned || 0,
            totalRepetitions: stats._sum.repetitions || 0,
        };
    }

    /**
     * Check user's challenge stats for badge eligibility
     */
    async getUserChallengeStats(userId: string): Promise<{
        challengesCompleted: number;
        challengesCreated: number;
        challengesWon: number;
    }> {
        const [completed, created, won] = await Promise.all([
            // Count completed challenges
            prisma.challengeParticipant.count({
                where: {
                    userId,
                    status: 'COMPLETED',
                },
            }),
            // Count created challenges
            prisma.challenge.count({
                where: { createdBy: userId },
            }),
            // Count challenges won (1st place - you'd need ranking logic)
            // For now, returning 0 - would need more complex query
            0,
        ]);

        return {
            challengesCompleted: completed,
            challengesCreated: created,
            challengesWon: won,
        };
    }

    /**
     * Check user's training streak
     */
    async getUserTrainingStreak(userId: string): Promise<number> {
        const sessions = await prisma.trainingSession.findMany({
            where: { userId },
            select: { date: true },
            orderBy: { date: 'desc' },
        });

        if (sessions.length === 0) return 0;

        let streak = 1;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if last session was today or yesterday
        const lastSession = new Date(sessions[0].date);
        lastSession.setHours(0, 0, 0, 0);
        
        const daysDiff = Math.floor((today.getTime() - lastSession.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff > 1) return 0; // Streak broken

        // Count consecutive days
        for (let i = 1; i < sessions.length; i++) {
            const currentDate = new Date(sessions[i - 1].date);
            const previousDate = new Date(sessions[i].date);
            currentDate.setHours(0, 0, 0, 0);
            previousDate.setHours(0, 0, 0, 0);

            const diff = Math.floor((currentDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24));

            if (diff === 1) {
                streak++;
            } else if (diff > 1) {
                break; // Streak broken
            }
        }

        return streak;
    }

    /**
     * Check if user meets badge requirements
     */
    async checkBadgeEligibility(userId: string, badge: Badge): Promise<boolean> {
        const ruleType = badge.ruleType as BadgeRuleType;
        const requiredValue = badge.ruleValue;

        switch (ruleType) {
            case BadgeRuleType.TOTAL_SESSIONS: {
                const stats = await this.getUserTrainingStats(userId);
                return stats.totalSessions >= requiredValue;
            }

            case BadgeRuleType.TOTAL_DURATION: {
                const stats = await this.getUserTrainingStats(userId);
                return stats.totalDuration >= requiredValue;
            }

            case BadgeRuleType.TOTAL_CALORIES: {
                const stats = await this.getUserTrainingStats(userId);
                return stats.totalCalories >= requiredValue;
            }

            case BadgeRuleType.TOTAL_REPETITIONS: {
                const stats = await this.getUserTrainingStats(userId);
                return stats.totalRepetitions >= requiredValue;
            }

            case BadgeRuleType.CHALLENGES_COMPLETED: {
                const stats = await this.getUserChallengeStats(userId);
                return stats.challengesCompleted >= requiredValue;
            }

            case BadgeRuleType.CHALLENGES_CREATED: {
                const stats = await this.getUserChallengeStats(userId);
                return stats.challengesCreated >= requiredValue;
            }

            case BadgeRuleType.TRAINING_STREAK: {
                const streak = await this.getUserTrainingStreak(userId);
                return streak >= requiredValue;
            }

            case BadgeRuleType.CHALLENGES_WON: {
                const stats = await this.getUserChallengeStats(userId);
                return stats.challengesWon >= requiredValue;
            }

            default:
                return false;
        }
    }

    /**
     * Check and award new badges for a user
     */
    async checkAndAwardBadges(userId: string): Promise<Badge[]> {
        const badges = await this.findAllBadgesForCheck();
        const newBadges: Badge[] = [];

        for (const badge of badges) {
            // Check if user already has this badge
            const hasBadge = await this.userHasBadge(userId, badge.id);
            if (hasBadge) continue;

            // Check if user is eligible
            const isEligible = await this.checkBadgeEligibility(userId, badge);
            if (isEligible) {
                await this.awardBadge(userId, badge.id);
                newBadges.push(badge);
            }
        }

        return newBadges;
    }
}

export const badgeRepository = new BadgeRepository();
