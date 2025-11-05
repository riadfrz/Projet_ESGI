import { Serialize } from '@shared/types/Serialize';
import { z } from 'zod';
import { Difficulty } from '@shared/enums';

// ============================================================================
// Base Exercise Fields
// ============================================================================

const baseExerciseFieldsSchema = z.object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    description: z.string().optional(),
    difficulty: z.nativeEnum(Difficulty).default(Difficulty.BEGINNER),
});

// ============================================================================
// Exercise Response DTO
// ============================================================================

export const exerciseSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable().optional(),
    difficulty: z.nativeEnum(Difficulty),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type ExerciseSchema = z.infer<typeof exerciseSchema>;
export type ExerciseDto = Serialize<ExerciseSchema>;

// ============================================================================
// Exercise with Muscles Response DTO
// ============================================================================

export const muscleInfoSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable().optional(),
});

export type MuscleInfoSchema = z.infer<typeof muscleInfoSchema>;
export type MuscleInfoDto = Serialize<MuscleInfoSchema>;

export const exerciseWithMusclesSchema = exerciseSchema.extend({
    muscles: z.array(muscleInfoSchema).optional(),
});

export type ExerciseWithMusclesSchema = z.infer<typeof exerciseWithMusclesSchema>;
export type ExerciseWithMusclesDto = Serialize<ExerciseWithMusclesSchema>;

// ============================================================================
// Create Exercise DTO
// ============================================================================

export const createExerciseSchema = baseExerciseFieldsSchema.extend({
    muscleIds: z.array(z.string()).optional(),
});

export type CreateExerciseSchema = z.infer<typeof createExerciseSchema>;
export type CreateExerciseDto = Serialize<CreateExerciseSchema>;

// ============================================================================
// Update Exercise DTO
// ============================================================================

export const updateExerciseSchema = baseExerciseFieldsSchema.partial().extend({
    muscleIds: z.array(z.string()).optional(),
});

export type UpdateExerciseSchema = z.infer<typeof updateExerciseSchema>;
export type UpdateExerciseDto = Serialize<UpdateExerciseSchema>;

// ============================================================================
// Query Exercises DTO (for filtering/pagination)
// ============================================================================

export const queryExercisesSchema = z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    difficulty: z.nativeEnum(Difficulty).optional(),
    search: z.string().optional(),
    muscleId: z.string().optional(),
});

export type QueryExercisesSchema = z.infer<typeof queryExercisesSchema>;
export type QueryExercisesDto = Serialize<QueryExercisesSchema>;
