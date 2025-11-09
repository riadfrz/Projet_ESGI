import { Challenge, ChallengeParticipant, Prisma } from '@/config/client';
import prisma from '@/config/prisma';
import { QueryChallengesDto } from '@shared/dto';
import { ChallengeWithRelations, ChallengeParticipantWithUser } from './challengeTransform';

// Define include object for consistent use across methods
const challengeInclude = {
    creator: {
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
        },
    },
    gym: {
        select: {
            id: true,
            name: true,
        },
    },
    challengeExercises: {
        include: {
            exercise: {
                select: {
                    id: true,
                    name: true,
                    description: true,
                },
            },
        },
    },
    challengeParticipants: {
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                },
            },
        },
    },
};

const challengeIncludeWithCount = {
    ...challengeInclude,
    _count: {
        select: {
            challengeParticipants: true,
        },
    },
};

class ChallengeRepository {
    /**
     * Find challenge by ID with all relations
     */
    async findById(id: string): Promise<ChallengeWithRelations | null> {
        return prisma.challenge.findUnique({
            where: { id },
            include: challengeIncludeWithCount,
        });
    }

    /**
     * Create a new challenge
     */
    async create(data: Prisma.ChallengeCreateInput): Promise<ChallengeWithRelations> {
        return prisma.challenge.create({
            data,
            include: challengeIncludeWithCount,
        });
    }

    /**
     * Update challenge
     */
    async update(id: string, data: Prisma.ChallengeUpdateInput): Promise<ChallengeWithRelations> {
        return prisma.challenge.update({
            where: { id },
            data,
            include: challengeIncludeWithCount,
        });
    }

    /**
     * Delete challenge
     */
    async delete(id: string): Promise<Challenge> {
        return prisma.challenge.delete({
            where: { id },
        });
    }

    /**
     * Find all challenges with filters and pagination
     */
    async findAll(
        query: QueryChallengesDto = {}
    ): Promise<{
        data: ChallengeWithRelations[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
            nextPage: number;
            previousPage: number;
            perPage: number;
        };
    }> {
        const page = query.page ? parseInt(query.page, 10) : 1;
        const limit = query.limit ? parseInt(query.limit, 10) : 10;
        const skip = (page - 1) * limit;

        // Build where clause
        const where: Prisma.ChallengeWhereInput = {};

        if (query.difficulty) {
            where.difficulty = query.difficulty;
        }

        if (query.status) {
            where.status = query.status;
        }

        if (query.objectiveType) {
            where.objectiveType = query.objectiveType;
        }

        if (query.gymId) {
            where.gymId = query.gymId;
        }

        if (query.isPublic !== undefined) {
            where.isPublic = query.isPublic === 'true';
        }

        if (query.minDuration || query.maxDuration) {
            where.duration = {};
            if (query.minDuration) {
                where.duration.gte = parseInt(query.minDuration, 10);
            }
            if (query.maxDuration) {
                where.duration.lte = parseInt(query.maxDuration, 10);
            }
        }

        if (query.search) {
            where.OR = [
                { title: { contains: query.search } },
                { description: { contains: query.search } },
            ];
        }

        const [data, total] = await Promise.all([
            prisma.challenge.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: challengeIncludeWithCount,
            }),
            prisma.challenge.count({ where }),
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            data,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems: total,
                nextPage: page < totalPages ? page + 1 : 0,
                previousPage: page > 1 ? page - 1 : 0,
                perPage: limit,
            },
        };
    }

    /**
     * Find challenges created by a specific user
     */
    async findByCreator(userId: string): Promise<ChallengeWithRelations[]> {
        return prisma.challenge.findMany({
            where: { createdBy: userId },
            orderBy: { createdAt: 'desc' },
            include: challengeIncludeWithCount,
        });
    }

    /**
     * Find challenges where user is participating
     */
    async findByParticipant(userId: string): Promise<ChallengeWithRelations[]> {
        return prisma.challenge.findMany({
            where: {
                challengeParticipants: {
                    some: {
                        userId,
                        status: {
                            in: ['ACCEPTED', 'COMPLETED'],
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
            include: challengeIncludeWithCount,
        });
    }

    /**
     * Add exercise associations to challenge
     */
    async addExercises(challengeId: string, exerciseIds: string[]): Promise<void> {
        if (exerciseIds.length > 0) {
            await prisma.challengeExercise.createMany({
                data: exerciseIds.map(exerciseId => ({
                    challengeId,
                    exerciseId,
                })),
                skipDuplicates: true,
            });
        }
    }

    /**
     * Remove exercise associations from challenge
     */
    async removeExercises(challengeId: string, exerciseIds: string[]): Promise<void> {
        await prisma.challengeExercise.deleteMany({
            where: {
                challengeId,
                exerciseId: { in: exerciseIds },
            },
        });
    }

    /**
     * Update exercise associations (replace all)
     */
    async updateExercises(challengeId: string, exerciseIds: string[]): Promise<void> {
        // Delete existing associations
        await prisma.challengeExercise.deleteMany({
            where: { challengeId },
        });

        // Create new associations
        if (exerciseIds.length > 0) {
            await prisma.challengeExercise.createMany({
                data: exerciseIds.map(exerciseId => ({
                    challengeId,
                    exerciseId,
                })),
            });
        }
    }

    // ==================== PARTICIPANT OPERATIONS ====================

    /**
     * Add participant to challenge
     */
    async addParticipant(
        challengeId: string,
        userId: string,
        status: 'INVITED' | 'ACCEPTED' = 'INVITED'
    ): Promise<ChallengeParticipant> {
        return prisma.challengeParticipant.create({
            data: {
                challengeId,
                userId,
                status,
            },
        });
    }

    /**
     * Add multiple participants to challenge
     */
    async addParticipants(
        challengeId: string,
        userIds: string[],
        status: 'INVITED' | 'ACCEPTED' = 'INVITED'
    ): Promise<void> {
        await prisma.challengeParticipant.createMany({
            data: userIds.map(userId => ({
                challengeId,
                userId,
                status,
            })),
            skipDuplicates: true,
        });
    }

    /**
     * Find participant by challenge and user
     */
    async findParticipant(challengeId: string, userId: string): Promise<ChallengeParticipant | null> {
        return prisma.challengeParticipant.findUnique({
            where: {
                challengeId_userId: {
                    challengeId,
                    userId,
                },
            },
        });
    }

    /**
     * Update participant status and progress
     */
    async updateParticipant(
        challengeId: string,
        userId: string,
        data: Prisma.ChallengeParticipantUpdateInput
    ): Promise<ChallengeParticipant> {
        return prisma.challengeParticipant.update({
            where: {
                challengeId_userId: {
                    challengeId,
                    userId,
                },
            },
            data,
        });
    }

    /**
     * Remove participant from challenge
     */
    async removeParticipant(challengeId: string, userId: string): Promise<ChallengeParticipant> {
        return prisma.challengeParticipant.delete({
            where: {
                challengeId_userId: {
                    challengeId,
                    userId,
                },
            },
        });
    }

    /**
     * Get all participants of a challenge
     */
    async getParticipants(challengeId: string): Promise<ChallengeParticipantWithUser[]> {
        return prisma.challengeParticipant.findMany({
            where: { challengeId },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
            orderBy: { joinedAt: 'desc' },
        });
    }

    /**
     * Count participants of a challenge
     */
    async countParticipants(challengeId: string): Promise<number> {
        return prisma.challengeParticipant.count({
            where: { challengeId },
        });
    }

    /**
     * Check if user can join challenge (not full, not already joined)
     */
    async canJoinChallenge(challengeId: string, userId: string): Promise<{ canJoin: boolean; reason?: string }> {
        const challenge = await prisma.challenge.findUnique({
            where: { id: challengeId },
            include: {
                _count: {
                    select: {
                        challengeParticipants: true,
                    },
                },
            },
        });

        if (!challenge) {
            return { canJoin: false, reason: 'Challenge not found' };
        }

        if (challenge.maxParticipants && challenge._count.challengeParticipants >= challenge.maxParticipants) {
            return { canJoin: false, reason: 'Challenge is full' };
        }

        const existingParticipant = await this.findParticipant(challengeId, userId);
        if (existingParticipant) {
            return { canJoin: false, reason: 'Already participating in this challenge' };
        }

        return { canJoin: true };
    }
}

export const challengeRepository = new ChallengeRepository();
