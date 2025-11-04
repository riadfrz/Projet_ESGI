import { z } from 'zod';
import { AuthProviderEnum } from '../enums';
import { Serialize } from '../types/Serialize';
import { basicUserSchema } from './userDto';

// ============================================================================
// Base Schemas
// ============================================================================

// Base user fields (without id) for creation/update
export const userFieldsSchema = z.object({
    email: z.string().email(),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
});

// Base OAuth token schema
export const baseOAuthTokenSchema = z.object({
    access_token: z.string().min(1),
    refresh_token: z.string().optional(),
    id_token: z.string().optional(),
});

// Base session info schema
export const baseSessionInfoSchema = z.object({
    userId: z.string().uuid(),
    expiresAt: z.date(),
});

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

export const oauthTokenSchema = baseOAuthTokenSchema.extend({
    expires_in: z.number().optional(),
    scope: z.string().optional(),
    token_type: z.string().optional(),
});

export type OAuthTokenSchema = z.infer<typeof oauthTokenSchema>;
export type OAuthTokenDto = Serialize<OAuthTokenSchema>;

// ============================================================================
// Repository Params
// ============================================================================

export const upsertUserFromOAuthParamsSchema = userFieldsSchema;

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

export const createSessionParamsSchema = baseSessionInfoSchema.extend({
    token: z.string().min(1),
    ipAddress: z.string().optional(),
    userAgent: z.string().optional(),
    authProvider: z.nativeEnum(AuthProviderEnum),
});

export type CreateSessionParamsSchema = z.infer<typeof createSessionParamsSchema>;
export type CreateSessionParamsDto = Serialize<CreateSessionParamsSchema>;

// ============================================================================
// Responses
// ============================================================================

export const sessionResponseSchema = baseSessionInfoSchema.extend({
    id: z.string().min(1),
    createdAt: z.date(),
    ipAddress: z.string().optional(),
    userAgent: z.string().optional(),
    authProvider: z.nativeEnum(AuthProviderEnum),
});

export type SessionResponseSchema = z.infer<typeof sessionResponseSchema>;
export type SessionResponseDto = Serialize<SessionResponseSchema>;

export const currentUserResponseSchema = basicUserSchema.extend({
    role: z.string(),
    createdAt: z.date(),
});

export type CurrentUserResponseSchema = z.infer<typeof currentUserResponseSchema>;
export type CurrentUserResponseDto = Serialize<CurrentUserResponseSchema>;

// ============================================================================
// Request Params
// ============================================================================

export const revokeSessionSchema = z.object({
    sessionId: z.string().min(1),
});

export type RevokeSessionSchema = z.infer<typeof revokeSessionSchema>;
export type RevokeSessionDto = Serialize<RevokeSessionSchema>;

export const oauthCallbackQuerySchema = z.object({
    code: z.string().min(1),
    state: z.string().optional(),
});

export type OAuthCallbackQuerySchema = z.infer<typeof oauthCallbackQuerySchema>;
export type OAuthCallbackQueryDto = Serialize<OAuthCallbackQuerySchema>;
