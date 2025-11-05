import { Serialize } from '@shared/types/Serialize';
import { z } from 'zod';
import { GymStatus } from '@shared/enums';

// ============================================================================
// Base Gym Fields (for validation with constraints)
// ============================================================================

const baseGymFieldsSchema = z.object({
    name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    description: z.string().optional(),
    address: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
    city: z.string().min(2, 'La ville doit contenir au moins 2 caractères'),
    zipCode: z.string().min(2, 'Le code postal doit contenir au moins 2 caractères'),
    country: z.string().min(2, 'Le pays doit contenir au moins 2 caractères'),
    phone: z.string().optional(),
    email: z.string().email("Format d'email invalide").optional(),
    capacity: z.number().int().positive('La capacité doit être positive').optional(),
});

// ============================================================================
// Gym Response DTO
// ============================================================================

export const gymSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable().optional(),
    address: z.string(),
    city: z.string(),
    zipCode: z.string(),
    country: z.string(),
    phone: z.string().nullable().optional(),
    email: z.string().email().nullable().optional(),
    capacity: z.number().nullable().optional(),
    ownerId: z.string(),
    status: z.nativeEnum(GymStatus),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type GymSchema = z.infer<typeof gymSchema>;
export type GymDto = Serialize<GymSchema>;

// ============================================================================
// Create Gym DTO (for both ADMIN and GYM_OWNER)
// ============================================================================

export const createGymSchema = baseGymFieldsSchema.extend({
    ownerId: z.string().optional(), // Optional - will be set from auth context for GYM_OWNER
});

export type CreateGymSchema = z.infer<typeof createGymSchema>;
export type CreateGymDto = Serialize<CreateGymSchema>;

// ============================================================================
// Update Gym DTO
// ============================================================================

export const updateGymSchema = baseGymFieldsSchema.partial();

export type UpdateGymSchema = z.infer<typeof updateGymSchema>;
export type UpdateGymDto = Serialize<UpdateGymSchema>;

// ============================================================================
// Query Gyms DTO (for filtering/pagination)
// ============================================================================

export const queryGymsSchema = z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional(),
    status: z.nativeEnum(GymStatus).optional(),
    city: z.string().optional(),
    ownerId: z.string().optional(),
});

export type QueryGymsSchema = z.infer<typeof queryGymsSchema>;
export type QueryGymsDto = Serialize<QueryGymsSchema>;

// ============================================================================
// Approve/Reject Gym DTO (ADMIN only)
// ============================================================================

export const updateGymStatusSchema = z.object({
    status: z.nativeEnum(GymStatus),
});

export type UpdateGymStatusSchema = z.infer<typeof updateGymStatusSchema>;
export type UpdateGymStatusDto = Serialize<UpdateGymStatusSchema>;
