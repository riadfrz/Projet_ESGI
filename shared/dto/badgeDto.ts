import { Serialize } from '@shared/types/Serialize';
import { z } from 'zod';
import { BadgeRuleType } from '@shared/enums';

// ============================================================================
// Base Badge Schema
// ============================================================================

export const baseBadgeSchema = z.object({
    name: z.string().min(1, "Le nom est requis"),
    description: z.string().optional(),
    icon: z.string().optional(),
    ruleType: z.nativeEnum(BadgeRuleType, {
        message: "Type de règle invalide",
    }),
    ruleValue: z.number().positive("La valeur de la règle doit être positive"),
    points: z.number().int().min(0, "Les points doivent être >= 0").default(0),
});

export type BaseBadgeSchema = z.infer<typeof baseBadgeSchema>;
export type BaseBadgeDto = Serialize<BaseBadgeSchema>;

// ============================================================================
// Badge Response DTO
// ============================================================================

export const badgeSchema = baseBadgeSchema.extend({
    id: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type BadgeSchema = z.infer<typeof badgeSchema>;
export type BadgeDto = Serialize<BadgeSchema>;

// ============================================================================
// Create Badge DTO (Admin)
// ============================================================================

export const createBadgeSchema = baseBadgeSchema;

export type CreateBadgeSchema = z.infer<typeof createBadgeSchema>;
export type CreateBadgeDto = Serialize<CreateBadgeSchema>;

// ============================================================================
// Update Badge DTO (Admin)
// ============================================================================

export const updateBadgeSchema = baseBadgeSchema.partial();

export type UpdateBadgeSchema = z.infer<typeof updateBadgeSchema>;
export type UpdateBadgeDto = Serialize<UpdateBadgeSchema>;

// ============================================================================
// Query Badges DTO
// ============================================================================

export const queryBadgesSchema = z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    ruleType: z.string().optional(), // Can filter by rule type
    search: z.string().optional(),    // Search in name/description
});

export type QueryBadgesSchema = z.infer<typeof queryBadgesSchema>;
export type QueryBadgesDto = Serialize<QueryBadgesSchema>;

// ============================================================================
// User Badge Response DTO
// ============================================================================

export const userBadgeSchema = z.object({
    id: z.string(),
    userId: z.string(),
    badgeId: z.string(),
    earnedAt: z.string(),
    badge: badgeSchema,
});

export type UserBadgeSchema = z.infer<typeof userBadgeSchema>;
export type UserBadgeDto = Serialize<UserBadgeSchema>;

// ============================================================================
// User Badge Summary DTO (without full user object)
// ============================================================================

export const userBadgeSummarySchema = z.object({
    totalBadges: z.number(),
    totalPoints: z.number(),
    badges: z.array(userBadgeSchema),
});

export type UserBadgeSummarySchema = z.infer<typeof userBadgeSummarySchema>;
export type UserBadgeSummaryDto = Serialize<UserBadgeSummarySchema>;

// ============================================================================
// Badge Check Result DTO (for cron job)
// ============================================================================

export const badgeCheckResultSchema = z.object({
    userId: z.string(),
    newBadges: z.array(badgeSchema),
    totalChecked: z.number(),
});

export type BadgeCheckResultSchema = z.infer<typeof badgeCheckResultSchema>;
export type BadgeCheckResultDto = Serialize<BadgeCheckResultSchema>;
