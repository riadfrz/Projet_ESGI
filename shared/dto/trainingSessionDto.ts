import { Serialize } from '@shared/types/Serialize';
import { z } from 'zod';

// ============================================================================
// Base Training Session Schema
// ============================================================================

export const baseTrainingSessionSchema = z.object({
    challengeId: z.string().optional(),
    gymId: z.string().optional(),
    exerciseId: z.string().min(1, "L'exercice est requis"),
    duration: z.number().int().positive("La durée doit être positive"),
    caloriesBurned: z.number().positive().optional(),
    repetitions: z.number().int().positive().optional(),
    notes: z.string().optional(),
    date: z.string().datetime(),
});

export type BaseTrainingSessionSchema = z.infer<typeof baseTrainingSessionSchema>;
export type BaseTrainingSessionDto = Serialize<BaseTrainingSessionSchema>;

// ============================================================================
// Training Session Response DTO
// ============================================================================

export const trainingSessionSchema = baseTrainingSessionSchema.extend({
    id: z.string(),
    userId: z.string(),
    challengeId: z.string().nullable().optional(),
    gymId: z.string().nullable().optional(),
    caloriesBurned: z.number().nullable().optional(),
    repetitions: z.number().nullable().optional(),
    notes: z.string().nullable().optional(),
    createdAt: z.string(),
});

export type TrainingSessionSchema = z.infer<typeof trainingSessionSchema>;
export type TrainingSessionDto = Serialize<TrainingSessionSchema>;

// ============================================================================
// Training Session with Details Response DTO
// ============================================================================

export const trainingExerciseInfoSchema = z.object({
    id: z.string(),
    name: z.string(),
    difficulty: z.string(),
});

export const trainingGymInfoSchema = z.object({
    id: z.string(),
    name: z.string(),
});

export const trainingChallengeInfoSchema = z.object({
    id: z.string(),
    title: z.string(),
});

export const trainingSessionWithDetailsSchema = trainingSessionSchema.extend({
    exercise: trainingExerciseInfoSchema,
    gym: trainingGymInfoSchema.nullable().optional(),
    challenge: trainingChallengeInfoSchema.nullable().optional(),
});

export type TrainingSessionWithDetailsSchema = z.infer<typeof trainingSessionWithDetailsSchema>;
export type TrainingSessionWithDetailsDto = Serialize<TrainingSessionWithDetailsSchema>;

// ============================================================================
// Create Training Session DTO
// ============================================================================

export const createTrainingSessionSchema = baseTrainingSessionSchema;

export type CreateTrainingSessionSchema = z.infer<typeof createTrainingSessionSchema>;
export type CreateTrainingSessionDto = Serialize<CreateTrainingSessionSchema>;

// ============================================================================
// Update Training Session DTO
// ============================================================================

export const updateTrainingSessionSchema = baseTrainingSessionSchema.partial();

export type UpdateTrainingSessionSchema = z.infer<typeof updateTrainingSessionSchema>;
export type UpdateTrainingSessionDto = Serialize<UpdateTrainingSessionSchema>;

// ============================================================================
// Query Training Sessions DTO
// ============================================================================

export const queryTrainingSessionsSchema = z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    exerciseId: z.string().optional(),
    gymId: z.string().optional(),
    challengeId: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
});

export type QueryTrainingSessionsSchema = z.infer<typeof queryTrainingSessionsSchema>;
export type QueryTrainingSessionsDto = Serialize<QueryTrainingSessionsSchema>;

// ============================================================================
// Training Stats DTO
// ============================================================================

export const trainingStatsSchema = z.object({
    totalSessions: z.number(),
    totalDuration: z.number(),
    totalCalories: z.number(),
    totalRepetitions: z.number(),
    averageDuration: z.number(),
    averageCalories: z.number(),
    sessionsThisWeek: z.number(),
    sessionsThisMonth: z.number(),
    favoriteExercise: z.object({
        id: z.string(),
        name: z.string(),
        count: z.number(),
    }).nullable().optional(),
    recentSessions: z.array(trainingSessionWithDetailsSchema),
});

export type TrainingStatsSchema = z.infer<typeof trainingStatsSchema>;
export type TrainingStatsDto = Serialize<TrainingStatsSchema>;

// ============================================================================
// Challenge Progress DTO
// ============================================================================

export const challengeProgressSchema = z.object({
    challengeId: z.string(),
    challengeTitle: z.string(),
    objectiveType: z.string(),
    objectiveValue: z.number(),
    currentProgress: z.number(),
    progressPercentage: z.number(),
    sessionsCount: z.number(),
    totalDuration: z.number(),
    totalRepetitions: z.number(),
    isCompleted: z.boolean(),
    sessions: z.array(trainingSessionWithDetailsSchema),
});

export type ChallengeProgressSchema = z.infer<typeof challengeProgressSchema>;
export type ChallengeProgressDto = Serialize<ChallengeProgressSchema>;
