import prisma from '@/config/prisma';
import { QueryLeaderboardDto } from '@shared/dto';

// Types for raw query results
interface UserWithBadgePoints {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    totalPoints: number;
    totalBadges: number;
}

interface UserWithChallenges {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    challengesCompleted: number;
    challengesCreated: number;
}

interface UserWithCalories {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    totalCalories: number;
    totalSessions: number;
}

interface UserWithMonthlySessions {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    sessionsThisMonth: number;
    caloriesThisMonth: number;
    durationThisMonth: number;
}

class LeaderboardRepository {
    // ========================================================================
    // Global Leaderboard (Badge Points)
    // ========================================================================

    async getGlobalLeaderboard(limit: number = 50) {
        // Get users with their badge points
        const users = await prisma.user.findMany({
            include: {
                userBadges: {
                    include: {
                        badge: true,
                    },
                },
                trainingSessions: {
                    select: { id: true },
                },
            },
        });

        // Calculate total points and badges for each user
        const leaderboard = users.map(user => {
            const totalPoints = user.userBadges.reduce((sum, ub) => sum + ub.badge.points, 0);
            const totalBadges = user.userBadges.length;
            const totalSessions = user.trainingSessions.length;

            return {
                userId: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                totalPoints,
                totalBadges,
                totalSessions,
                score: totalPoints, // Score is total points for global leaderboard
            };
        });

        // Sort by total points descending
        leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);

        // Add rank
        const rankedLeaderboard = leaderboard.slice(0, limit).map((entry, index) => ({
            ...entry,
            rank: index + 1,
        }));

        return rankedLeaderboard;
    }

    async getUserGlobalRank(userId: string): Promise<number | null> {
        const leaderboard = await this.getGlobalLeaderboard(10000); // Get all users
        const userEntry = leaderboard.find(entry => entry.userId === userId);
        return userEntry?.rank || null;
    }

    // ========================================================================
    // Challenge Leaderboard
    // ========================================================================

    async getChallengeLeaderboard(limit: number = 50) {
        const users = await prisma.user.findMany({
            include: {
                challengeParticipants: {
                    select: {
                        status: true,
                    },
                },
                createdChallenges: {
                    select: { id: true },
                },
            },
        });

        const leaderboard = users.map(user => {
            const challengesCompleted = user.challengeParticipants.filter(
                (cp: { status: string }) => cp.status === 'COMPLETED'
            ).length;
            const challengesCreated = user.createdChallenges.length;

            return {
                userId: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                challengesCompleted,
                challengesCreated,
                score: challengesCompleted, // Score is completed challenges
            };
        });

        // Sort by completed challenges descending
        leaderboard.sort((a, b) => b.challengesCompleted - a.challengesCompleted);

        const rankedLeaderboard = leaderboard.slice(0, limit).map((entry, index) => ({
            ...entry,
            rank: index + 1,
        }));

        return rankedLeaderboard;
    }

    async getUserChallengeRank(userId: string): Promise<number | null> {
        const leaderboard = await this.getChallengeLeaderboard(10000);
        const userEntry = leaderboard.find(entry => entry.userId === userId);
        return userEntry?.rank || null;
    }

    // ========================================================================
    // Calorie Leaderboard
    // ========================================================================

    async getCalorieLeaderboard(limit: number = 50) {
        const users = await prisma.user.findMany({
            include: {
                trainingSessions: {
                    select: {
                        caloriesBurned: true,
                    },
                },
            },
        });

        const leaderboard = users.map(user => {
            const totalCalories = user.trainingSessions.reduce(
                (sum, session) => sum + (session.caloriesBurned || 0),
                0
            );
            const totalSessions = user.trainingSessions.length;
            const averageCaloriesPerSession = totalSessions > 0 ? totalCalories / totalSessions : 0;

            return {
                userId: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                totalCalories,
                totalSessions,
                averageCaloriesPerSession: Math.round(averageCaloriesPerSession),
                score: totalCalories, // Score is total calories
            };
        });

        // Sort by total calories descending
        leaderboard.sort((a, b) => b.totalCalories - a.totalCalories);

        const rankedLeaderboard = leaderboard.slice(0, limit).map((entry, index) => ({
            ...entry,
            rank: index + 1,
        }));

        return rankedLeaderboard;
    }

    async getUserCalorieRank(userId: string): Promise<number | null> {
        const leaderboard = await this.getCalorieLeaderboard(10000);
        const userEntry = leaderboard.find(entry => entry.userId === userId);
        return userEntry?.rank || null;
    }

    // ========================================================================
    // Monthly Leaderboard
    // ========================================================================

    async getMonthlyLeaderboard(month?: string, year?: string, limit: number = 50) {
        // Determine the month to query
        const now = new Date();
        const targetYear = year ? parseInt(year) : now.getFullYear();
        const targetMonth = month ? parseInt(month) : now.getMonth() + 1;

        // Calculate start and end dates for the month
        const startDate = new Date(targetYear, targetMonth - 1, 1);
        const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59, 999);

        const users = await prisma.user.findMany({
            include: {
                trainingSessions: {
                    where: {
                        date: {
                            gte: startDate,
                            lte: endDate,
                        },
                    },
                    select: {
                        caloriesBurned: true,
                        duration: true,
                    },
                },
            },
        });

        const leaderboard = users.map(user => {
            const sessionsThisMonth = user.trainingSessions.length;
            const caloriesThisMonth = user.trainingSessions.reduce(
                (sum, session) => sum + (session.caloriesBurned || 0),
                0
            );
            const durationThisMonth = user.trainingSessions.reduce(
                (sum, session) => sum + session.duration,
                0
            );

            return {
                userId: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                sessionsThisMonth,
                caloriesThisMonth,
                durationThisMonth,
                score: sessionsThisMonth, // Score is number of sessions this month
            };
        });

        // Sort by sessions this month descending
        leaderboard.sort((a, b) => b.sessionsThisMonth - a.sessionsThisMonth);

        const rankedLeaderboard = leaderboard.slice(0, limit).map((entry, index) => ({
            ...entry,
            rank: index + 1,
        }));

        return rankedLeaderboard;
    }

    // ========================================================================
    // User Stats
    // ========================================================================

    async getUserStats(userId: string) {
        // Fetch user with all related data
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                trainingSessions: {
                    include: {
                        exercise: true,
                    },
                },
                userBadges: {
                    include: {
                        badge: true,
                    },
                },
                challengeParticipants: {
                    select: {
                        status: true,
                    },
                },
                createdChallenges: {
                    select: { id: true },
                },
            },
        });

        if (!user) {
            return null;
        }

        // Calculate training stats
        const totalSessions = user.trainingSessions.length;
        const totalDuration = user.trainingSessions.reduce((sum: number, s) => sum + s.duration, 0);
        const totalCalories = user.trainingSessions.reduce((sum: number, s) => sum + (s.caloriesBurned || 0), 0);
        const totalRepetitions = user.trainingSessions.reduce((sum: number, s) => sum + (s.repetitions || 0), 0);
        const averageDuration = totalSessions > 0 ? Math.round(totalDuration / totalSessions) : 0;
        const averageCalories = totalSessions > 0 ? Math.round(totalCalories / totalSessions) : 0;

        // Calculate time-based stats
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfYear = new Date(now.getFullYear(), 0, 1);

        const sessionsThisWeek = user.trainingSessions.filter((s) => new Date(s.date) >= startOfWeek).length;
        const sessionsThisMonth = user.trainingSessions.filter((s) => new Date(s.date) >= startOfMonth).length;
        const sessionsThisYear = user.trainingSessions.filter((s) => new Date(s.date) >= startOfYear).length;

        // Calculate challenge stats
        const challengesCompleted = user.challengeParticipants.filter((cp: { status: string }) => cp.status === 'COMPLETED').length;
        const challengesCreated = user.createdChallenges.length;
        const challengesParticipating = user.challengeParticipants.filter((cp: { status: string }) => cp.status === 'PARTICIPATING').length;

        // Calculate badge stats
        const totalBadges = user.userBadges.length;
        const totalPoints = user.userBadges.reduce((sum: number, ub) => sum + ub.badge.points, 0);

        // Get rankings
        const [globalRank, challengeRank, calorieRank] = await Promise.all([
            this.getUserGlobalRank(userId),
            this.getUserChallengeRank(userId),
            this.getUserCalorieRank(userId),
        ]);

        // Find favorite exercise
        const exerciseCounts = user.trainingSessions.reduce((acc, session) => {
            const exerciseId = session.exerciseId;
            if (!acc[exerciseId]) {
                acc[exerciseId] = {
                    id: exerciseId,
                    name: session.exercise.name,
                    count: 0,
                };
            }
            acc[exerciseId].count++;
            return acc;
        }, {} as Record<string, { id: string; name: string; count: number }>);

        const favoriteExercise = Object.values(exerciseCounts).sort((a, b) => b.count - a.count)[0] || null;

        // Calculate training streak
        const trainingStreak = await this.calculateTrainingStreak(userId);

        return {
            userId: user.id,
            totalSessions,
            totalDuration,
            totalCalories,
            totalRepetitions,
            averageDuration,
            averageCalories,
            sessionsThisWeek,
            sessionsThisMonth,
            sessionsThisYear,
            challengesCompleted,
            challengesCreated,
            challengesParticipating,
            totalBadges,
            totalPoints,
            globalRank,
            challengeRank,
            calorieRank,
            favoriteExercise,
            trainingStreak,
        };
    }

    private async calculateTrainingStreak(userId: string): Promise<number> {
        const sessions = await prisma.trainingSession.findMany({
            where: { userId },
            select: { date: true },
            orderBy: { date: 'desc' },
        });

        if (sessions.length === 0) return 0;

        let streak = 1;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const lastSession = new Date(sessions[0].date);
        lastSession.setHours(0, 0, 0, 0);

        const daysDiff = Math.floor((today.getTime() - lastSession.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDiff > 1) return 0;

        for (let i = 1; i < sessions.length; i++) {
            const currentDate = new Date(sessions[i - 1].date);
            const previousDate = new Date(sessions[i].date);
            currentDate.setHours(0, 0, 0, 0);
            previousDate.setHours(0, 0, 0, 0);

            const diff = Math.floor((currentDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24));

            if (diff === 1) {
                streak++;
            } else if (diff > 1) {
                break;
            }
        }

        return streak;
    }
}

export const leaderboardRepository = new LeaderboardRepository();
