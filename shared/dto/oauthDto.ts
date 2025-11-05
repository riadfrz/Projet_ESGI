import { z } from 'zod';
import { Serialize } from '../types/Serialize';

// ============================================================================
// OAuth Profiles
// ============================================================================

export const googleProfileSchema = z.object({
    id: z.string().min(1),
    email: z.string().email(),
    name: z.string().min(1),
    picture: z.string().url().optional(),
    verified_email: z.boolean(),
});

export type GoogleProfileSchema = z.infer<typeof googleProfileSchema>;
export type GoogleProfileDto = Serialize<GoogleProfileSchema>;

// ============================================================================
// OAuth Tokens
// ============================================================================

export const oauthTokenSchema = z.object({
    access_token: z.string().min(1),
    refresh_token: z.string().optional(),
    id_token: z.string().optional(),
    expires_in: z.number().optional(),
    scope: z.string().optional(),
    token_type: z.string().optional(),
});

export type OAuthTokenSchema = z.infer<typeof oauthTokenSchema>;
export type OAuthTokenDto = Serialize<OAuthTokenSchema>;

// ============================================================================
// OAuth Callback Query
// ============================================================================

export const oauthCallbackQuerySchema = z.object({
    code: z.string().min(1),
    state: z.string().optional(),
});

export type OAuthCallbackQuerySchema = z.infer<typeof oauthCallbackQuerySchema>;
export type OAuthCallbackQueryDto = Serialize<OAuthCallbackQuerySchema>;

// ============================================================================
// OAuth Repository Params
// ============================================================================

// Base user fields for OAuth upsert
export const upsertUserFromOAuthParamsSchema = z.object({
    email: z.string().email(),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
});

export type UpsertUserFromOAuthParamsSchema = z.infer<typeof upsertUserFromOAuthParamsSchema>;
export type UpsertUserFromOAuthParamsDto = Serialize<UpsertUserFromOAuthParamsSchema>;

export const upsertOAuthAccountParamsSchema = z.object({
    userId: z.string().uuid(),
    accountId: z.string().min(1),
    providerId: z.string().min(1),
    accessToken: z.string().optional(),
    refreshToken: z.string().optional(),
    idToken: z.string().optional(),
    accessTokenExpiresAt: z.date().optional().nullable(),
    scope: z.string().optional(),
});

export type UpsertOAuthAccountParamsSchema = z.infer<typeof upsertOAuthAccountParamsSchema>;
export type UpsertOAuthAccountParamsDto = Serialize<UpsertOAuthAccountParamsSchema>;
