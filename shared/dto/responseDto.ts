import { z } from 'zod';
import { Serialize } from '../types/Serialize';

// ============================================================================
// Message Response
// ============================================================================

export const messageResponseSchema = z.object({
    message: z.string(),
});

export type MessageResponseSchema = z.infer<typeof messageResponseSchema>;
export type MessageResponseDto = Serialize<MessageResponseSchema>;

// ============================================================================
// Success Response
// ============================================================================

export const successResponseSchema = z.object({
    success: z.boolean(),
    message: z.string().optional(),
});

export type SuccessResponseSchema = z.infer<typeof successResponseSchema>;
export type SuccessResponseDto = Serialize<SuccessResponseSchema>;
