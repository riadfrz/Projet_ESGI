import {
    GlobalLeaderboardEntryDto,
    ChallengeLeaderboardEntryDto,
    CalorieLeaderboardEntryDto,
    MonthlyLeaderboardEntryDto,
    UserStatsDto,
} from '@shared/dto';

class LeaderboardTransform {
    /**
     * Transform to GlobalLeaderboardEntryDto
     */
    toGlobalLeaderboardEntry(entry: any): GlobalLeaderboardEntryDto {
        return {
            userId: entry.userId,
            email: entry.email,
            firstName: entry.firstName || undefined,
            lastName: entry.lastName || undefined,
            rank: entry.rank,
            score: entry.score,
            totalPoints: entry.totalPoints,
            totalBadges: entry.totalBadges,
            totalSessions: entry.totalSessions,
        };
    }

    /**
     * Transform to ChallengeLeaderboardEntryDto
     */
    toChallengeLeaderboardEntry(entry: any): ChallengeLeaderboardEntryDto {
        return {
            userId: entry.userId,
            email: entry.email,
            firstName: entry.firstName || undefined,
            lastName: entry.lastName || undefined,
            rank: entry.rank,
            score: entry.score,
            challengesCompleted: entry.challengesCompleted,
            challengesCreated: entry.challengesCreated,
        };
    }

    /**
     * Transform to CalorieLeaderboardEntryDto
     */
    toCalorieLeaderboardEntry(entry: any): CalorieLeaderboardEntryDto {
        return {
            userId: entry.userId,
            email: entry.email,
            firstName: entry.firstName || undefined,
            lastName: entry.lastName || undefined,
            rank: entry.rank,
            score: entry.score,
            totalCalories: entry.totalCalories,
            totalSessions: entry.totalSessions,
            averageCaloriesPerSession: entry.averageCaloriesPerSession,
        };
    }

    /**
     * Transform to MonthlyLeaderboardEntryDto
     */
    toMonthlyLeaderboardEntry(entry: any): MonthlyLeaderboardEntryDto {
        return {
            userId: entry.userId,
            email: entry.email,
            firstName: entry.firstName || undefined,
            lastName: entry.lastName || undefined,
            rank: entry.rank,
            score: entry.score,
            sessionsThisMonth: entry.sessionsThisMonth,
            caloriesThisMonth: entry.caloriesThisMonth,
            durationThisMonth: entry.durationThisMonth,
        };
    }

    /**
     * Transform to UserStatsDto
     */
    toUserStatsDto(stats: any): UserStatsDto {
        return {
            userId: stats.userId,
            totalSessions: stats.totalSessions,
            totalDuration: stats.totalDuration,
            totalCalories: stats.totalCalories,
            totalRepetitions: stats.totalRepetitions,
            averageDuration: stats.averageDuration,
            averageCalories: stats.averageCalories,
            sessionsThisWeek: stats.sessionsThisWeek,
            sessionsThisMonth: stats.sessionsThisMonth,
            sessionsThisYear: stats.sessionsThisYear,
            challengesCompleted: stats.challengesCompleted,
            challengesCreated: stats.challengesCreated,
            challengesParticipating: stats.challengesParticipating,
            totalBadges: stats.totalBadges,
            totalPoints: stats.totalPoints,
            globalRank: stats.globalRank || undefined,
            challengeRank: stats.challengeRank || undefined,
            calorieRank: stats.calorieRank || undefined,
            favoriteExercise: stats.favoriteExercise || undefined,
            trainingStreak: stats.trainingStreak,
        };
    }
}

export const leaderboardTransform = new LeaderboardTransform();
