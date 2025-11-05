import { Serialize } from '@shared/types/Serialize';
import { z } from 'zod';

// ============================================================================
// Base Equipment Fields
// ============================================================================

const baseEquipmentFieldsSchema = z.object({
    name: z.string().min(2, "Le nom de l'équipement doit contenir au moins 2 caractères"),
    quantity: z.number().int().positive("La quantité doit être positive").default(1),
});

// ============================================================================
// Equipment Response DTO
// ============================================================================

export const equipmentSchema = baseEquipmentFieldsSchema.extend({
    id: z.string(),
    gymId: z.string(),
    createdAt: z.string(),
});

export type EquipmentSchema = z.infer<typeof equipmentSchema>;
export type EquipmentDto = Serialize<EquipmentSchema>;

// ============================================================================
// Create Equipment DTO
// ============================================================================

export const createEquipmentSchema = baseEquipmentFieldsSchema.extend({
    gymId: z.string().min(1, "L'ID de la salle est requis"),
});

export type CreateEquipmentSchema = z.infer<typeof createEquipmentSchema>;
export type CreateEquipmentDto = Serialize<CreateEquipmentSchema>;

// ============================================================================
// Update Equipment DTO
// ============================================================================

export const updateEquipmentSchema = baseEquipmentFieldsSchema.partial();

export type UpdateEquipmentSchema = z.infer<typeof updateEquipmentSchema>;
export type UpdateEquipmentDto = Serialize<UpdateEquipmentSchema>;

// ============================================================================
// Query Equipments DTO (for filtering/pagination)
// ============================================================================

export const queryEquipmentsSchema = z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    gymId: z.string().optional(),
    search: z.string().optional(),
});

export type QueryEquipmentsSchema = z.infer<typeof queryEquipmentsSchema>;
export type QueryEquipmentsDto = Serialize<QueryEquipmentsSchema>;
