import { TrainingSession, Prisma } from '@/config/client';
import prisma from '@/config/prisma';
import { QueryTrainingSessionsDto, TrainingStatsDto, ChallengeProgressDto } from '@shared/dto';
import { TrainingSessionWithRelations } from './trainingSessionTransform';

// Define include object for consistent use across methods
const trainingSessionInclude = {
    exercise: {
        select: {
            id: true,
            name: true,
            difficulty: true,
        },
    },
    gym: {
        select: {
            id: true,
            name: true,
        },
    },
    challenge: {
        select: {
            id: true,
            title: true,
        },
    },
};

class TrainingSessionRepository {
    /**
     * Find training session by ID
     */
    async findById(id: string): Promise<TrainingSessionWithRelations | null> {
        return prisma.trainingSession.findUnique({
            where: { id },
            include: trainingSessionInclude,
        });
    }

    /**
     * Create a new training session
     */
    async create(data: Prisma.TrainingSessionCreateInput): Promise<TrainingSessionWithRelations> {
        return prisma.trainingSession.create({
            data,
            include: trainingSessionInclude,
        });
    }

    /**
     * Update training session
     */
    async update(id: string, data: Prisma.TrainingSessionUpdateInput): Promise<TrainingSessionWithRelations> {
        return prisma.trainingSession.update({
            where: { id },
            data,
            include: trainingSessionInclude,
        });
    }

    /**
     * Delete training session
     */
    async delete(id: string): Promise<TrainingSession> {
        return prisma.trainingSession.delete({
            where: { id },
        });
    }

    /**
     * Find all training sessions for a user with filters and pagination
     */
    async findAllByUser(
        userId: string,
        query: QueryTrainingSessionsDto = {}
    ): Promise<{
        data: TrainingSessionWithRelations[];
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
        const where: Prisma.TrainingSessionWhereInput = { userId };

        if (query.exerciseId) {
            where.exerciseId = query.exerciseId;
        }

        if (query.gymId) {
            where.gymId = query.gymId;
        }

        if (query.challengeId) {
            where.challengeId = query.challengeId;
        }

        if (query.startDate || query.endDate) {
            where.date = {};
            if (query.startDate) {
                where.date.gte = new Date(query.startDate);
            }
            if (query.endDate) {
                where.date.lte = new Date(query.endDate);
            }
        }

        const [data, total] = await Promise.all([
            prisma.trainingSession.findMany({
                where,
                skip,
                take: limit,
                orderBy: { date: 'desc' },
                include: trainingSessionInclude,
            }),
            prisma.trainingSession.count({ where }),
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
     * Get user statistics
     */
    async getUserStats(userId: string): Promise<{
        totalSessions: number;
        totalDuration: number;
        totalCalories: number;
        totalRepetitions: number;
        sessionsThisWeek: number;
        sessionsThisMonth: number;
        favoriteExercise: { id: string; name: string; count: number } | null;
        recentSessions: TrainingSessionWithRelations[];
    }> {
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // Get all sessions for aggregations
        const allSessions = await prisma.trainingSession.findMany({
            where: { userId },
        });

        // Calculate basic stats
        const totalSessions = allSessions.length;
        const totalDuration = allSessions.reduce((sum, s) => sum + s.duration, 0);
        const totalCalories = allSessions.reduce((sum, s) => sum + (s.caloriesBurned || 0), 0);
        const totalRepetitions = allSessions.reduce((sum, s) => sum + (s.repetitions || 0), 0);

        // Sessions this week
        const sessionsThisWeek = await prisma.trainingSession.count({
            where: {
                userId,
                date: { gte: startOfWeek },
            },
        });

        // Sessions this month
        const sessionsThisMonth = await prisma.trainingSession.count({
            where: {
                userId,
                date: { gte: startOfMonth },
            },
        });

        // Favorite exercise (most used)
        const exerciseCounts = await prisma.trainingSession.groupBy({
            by: ['exerciseId'],
            where: { userId },
            _count: { exerciseId: true },
            orderBy: { _count: { exerciseId: 'desc' } },
            take: 1,
        });

        let favoriteExercise: { id: string; name: string; count: number } | null = null;
        if (exerciseCounts.length > 0) {
            const exercise = await prisma.exercise.findUnique({
                where: { id: exerciseCounts[0].exerciseId },
                select: { id: true, name: true },
            });
            if (exercise) {
                favoriteExercise = {
                    id: exercise.id,
                    name: exercise.name,
                    count: exerciseCounts[0]._count.exerciseId,
                };
            }
        }

        // Recent sessions (last 5)
        const recentSessions = await prisma.trainingSession.findMany({
            where: { userId },
            take: 5,
            orderBy: { date: 'desc' },
            include: trainingSessionInclude,
        });

        return {
            totalSessions,
            totalDuration,
            totalCalories,
            totalRepetitions,
            sessionsThisWeek,
            sessionsThisMonth,
            favoriteExercise,
            recentSessions,
        };
    }

    /**
     * Get challenge progress for a user
     */
    async getChallengeProgress(challengeId: string, userId: string): Promise<{
        challenge: {
            id: string;
            title: string;
            objectiveType: string;
            objectiveValue: number;
        };
        sessions: TrainingSessionWithRelations[];
        totalDuration: number;
        totalRepetitions: number;
        sessionsCount: number;
    } | null> {
        // Get challenge details
        const challenge = await prisma.challenge.findUnique({
            where: { id: challengeId },
            select: {
                id: true,
                title: true,
                objectiveType: true,
                objectiveValue: true,
            },
        });

        if (!challenge) {
            return null;
        }

        // Get user's sessions for this challenge
        const sessions = await prisma.trainingSession.findMany({
            where: {
                userId,
                challengeId,
            },
            orderBy: { date: 'desc' },
            include: trainingSessionInclude,
        });

        const totalDuration = sessions.reduce((sum, s) => sum + s.duration, 0);
        const totalRepetitions = sessions.reduce((sum, s) => sum + (s.repetitions || 0), 0);
        const sessionsCount = sessions.length;

        return {
            challenge,
            sessions,
            totalDuration,
            totalRepetitions,
            sessionsCount,
        };
    }
}

export const trainingSessionRepository = new TrainingSessionRepository();
