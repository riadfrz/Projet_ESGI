import { Serialize } from '@shared/types/Serialize';
import { z } from 'zod';

// ============================================================================
// Base Muscle Fields
// ============================================================================

const baseMuscleFieldsSchema = z.object({
    name: z.string().min(2, "Le nom du muscle doit contenir au moins 2 caractères"),
    description: z.string().optional(),
    identifier: z.string().min(2, "L'identifiant du muscle doit contenir au moins 2 caractères"),
});

// ============================================================================
// Muscle Response DTO
// ============================================================================

export const muscleSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable().optional(),
    identifier: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type MuscleSchema = z.infer<typeof muscleSchema>;
export type MuscleDto = Serialize<MuscleSchema>;

// ============================================================================
// Create Muscle DTO
// ============================================================================

export const createMuscleSchema = baseMuscleFieldsSchema;

export type CreateMuscleSchema = z.infer<typeof createMuscleSchema>;
export type CreateMuscleDto = Serialize<CreateMuscleSchema>;

// ============================================================================
// Update Muscle DTO
// ============================================================================

export const updateMuscleSchema = baseMuscleFieldsSchema.partial();

export type UpdateMuscleSchema = z.infer<typeof updateMuscleSchema>;
export type UpdateMuscleDto = Serialize<UpdateMuscleSchema>;

// ============================================================================
// Query Muscles DTO (for filtering/pagination)
// ============================================================================

export const queryMusclesSchema = z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional(),
});

export type QueryMusclesSchema = z.infer<typeof queryMusclesSchema>;
export type QueryMusclesDto = Serialize<QueryMusclesSchema>;
