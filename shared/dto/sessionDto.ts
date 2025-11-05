import { z } from 'zod';
import { AuthProviderEnum } from '../enums';
import { Serialize } from '../types/Serialize';

// ============================================================================
// Session Response
// ============================================================================

export const sessionResponseSchema = z.object({
    id: z.string().min(1),
    userId: z.string().uuid(),
    expiresAt: z.string(),
    token: z.string().optional(), // Optional for security, usually not sent to client
    createdAt: z.string(),
    updatedAt: z.string(),
    ipAddress: z.string().nullable().optional(),
    userAgent: z.string().nullable().optional(),
    authProvider: z.nativeEnum(AuthProviderEnum),
});

export type SessionResponseSchema = z.infer<typeof sessionResponseSchema>;
export type SessionResponseDto = Serialize<SessionResponseSchema>;

// ============================================================================
// Session Array Response
// ============================================================================

export const sessionsResponseSchema = z.object({
    sessions: z.array(sessionResponseSchema),
});

export type SessionsResponseSchema = z.infer<typeof sessionsResponseSchema>;
export type SessionsResponseDto = Serialize<SessionsResponseSchema>;

// ============================================================================
// Create Session Params
// ============================================================================

export const createSessionParamsSchema = z.object({
    userId: z.string().uuid(),
    token: z.string().min(1),
    expiresAt: z.string(),
    ipAddress: z.string().optional(),
    userAgent: z.string().optional(),
    authProvider: z.nativeEnum(AuthProviderEnum),
});

export type CreateSessionParamsSchema = z.infer<typeof createSessionParamsSchema>;
export type CreateSessionParamsDto = Serialize<CreateSessionParamsSchema>;
