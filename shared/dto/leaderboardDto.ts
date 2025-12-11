import { Serialize } from '@shared/types/Serialize';
import { z } from 'zod';

// ============================================================================
// Leaderboard Entry Schema (Base)
// ============================================================================

export const leaderboardEntrySchema = z.object({
    userId: z.string(),
    firstName: z.string().nullable().optional(),
    lastName: z.string().nullable().optional(),
    email: z.string(),
    rank: z.number(),
    score: z.number(),
});

export type LeaderboardEntrySchema = z.infer<typeof leaderboardEntrySchema>;
export type LeaderboardEntryDto = Serialize<LeaderboardEntrySchema>;

// ============================================================================
// Global Leaderboard Entry (Points-based)
// ============================================================================

export const globalLeaderboardEntrySchema = leaderboardEntrySchema.extend({
    totalPoints: z.number(),
    totalBadges: z.number(),
    totalSessions: z.number(),
});

export type GlobalLeaderboardEntrySchema = z.infer<typeof globalLeaderboardEntrySchema>;
export type GlobalLeaderboardEntryDto = Serialize<GlobalLeaderboardEntrySchema>;

// ============================================================================
// Challenge Leaderboard Entry
// ============================================================================

export const challengeLeaderboardEntrySchema = leaderboardEntrySchema.extend({
    challengesCompleted: z.number(),
    challengesCreated: z.number(),
});

export type ChallengeLeaderboardEntrySchema = z.infer<typeof challengeLeaderboardEntrySchema>;
export type ChallengeLeaderboardEntryDto = Serialize<ChallengeLeaderboardEntrySchema>;

// ============================================================================
// Calorie Leaderboard Entry
// ============================================================================

export const calorieLeaderboardEntrySchema = leaderboardEntrySchema.extend({
    totalCalories: z.number(),
    totalSessions: z.number(),
    averageCaloriesPerSession: z.number(),
});

export type CalorieLeaderboardEntrySchema = z.infer<typeof calorieLeaderboardEntrySchema>;
export type CalorieLeaderboardEntryDto = Serialize<CalorieLeaderboardEntrySchema>;

// ============================================================================
// Monthly Leaderboard Entry
// ============================================================================

export const monthlyLeaderboardEntrySchema = leaderboardEntrySchema.extend({
    sessionsThisMonth: z.number(),
    caloriesThisMonth: z.number(),
    durationThisMonth: z.number(),
});

export type MonthlyLeaderboardEntrySchema = z.infer<typeof monthlyLeaderboardEntrySchema>;
export type MonthlyLeaderboardEntryDto = Serialize<MonthlyLeaderboardEntrySchema>;

// ============================================================================
// Leaderboard Response
// ============================================================================

export const leaderboardResponseSchema = z.object({
    leaderboard: z.array(leaderboardEntrySchema),
    total: z.number(),
    currentUserRank: z.number().nullable().optional(),
});

export type LeaderboardResponseSchema = z.infer<typeof leaderboardResponseSchema>;
export type LeaderboardResponseDto = Serialize<LeaderboardResponseSchema>;

// ============================================================================
// User Stats Schema
// ============================================================================

export const userStatsSchema = z.object({
    userId: z.string(),
    // Training stats
    totalSessions: z.number(),
    totalDuration: z.number(),
    totalCalories: z.number(),
    totalRepetitions: z.number(),
    averageDuration: z.number(),
    averageCalories: z.number(),
    
    // Time-based stats
    sessionsThisWeek: z.number(),
    sessionsThisMonth: z.number(),
    sessionsThisYear: z.number(),
    
    // Challenge stats
    challengesCompleted: z.number(),
    challengesCreated: z.number(),
    challengesParticipating: z.number(),
    
    // Badge stats
    totalBadges: z.number(),
    totalPoints: z.number(),
    
    // Rankings
    globalRank: z.number().nullable().optional(),
    challengeRank: z.number().nullable().optional(),
    calorieRank: z.number().nullable().optional(),
    
    // Additional info
    favoriteExercise: z.object({
        id: z.string(),
        name: z.string(),
        count: z.number(),
    }).nullable().optional(),
    
    trainingStreak: z.number(),
});

export type UserStatsSchema = z.infer<typeof userStatsSchema>;
export type UserStatsDto = Serialize<UserStatsSchema>;

// ============================================================================
// Query Leaderboard DTO
// ============================================================================

export const queryLeaderboardSchema = z.object({
    limit: z.string().optional(),
    month: z.string().optional(), // For monthly leaderboard (YYYY-MM)
    year: z.string().optional(),  // For monthly leaderboard
});

export type QueryLeaderboardSchema = z.infer<typeof queryLeaderboardSchema>;
export type QueryLeaderboardDto = Serialize<QueryLeaderboardSchema>;
