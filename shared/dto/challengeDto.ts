import { Serialize } from '@shared/types/Serialize';
import { z } from 'zod';
import { ChallengeDifficulty, ChallengeStatus, ParticipantStatus, ChallengeType } from '@shared/enums';

// ============================================================================
// Base Challenge Fields
// ============================================================================

const baseChallengeFieldsSchema = z.object({
    title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
    description: z.string().optional(),
    gymId: z.string().optional(),
    duration: z.number().int().positive("La durée doit être positive"),
    difficulty: z.nativeEnum(ChallengeDifficulty).default(ChallengeDifficulty.MEDIUM),
    objectiveType: z.nativeEnum(ChallengeType),
    objectiveValue: z.number().positive("La valeur objective doit être positive"),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    maxParticipants: z.number().int().positive().optional(),
    isPublic: z.boolean().default(true),
    exerciseIds: z.array(z.string()).optional(),
});

// ============================================================================
// Challenge Response DTO
// ============================================================================

export const challengeSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().nullable().optional(),
    createdBy: z.string(),
    gymId: z.string().nullable().optional(),
    duration: z.number(),
    difficulty: z.nativeEnum(ChallengeDifficulty),
    objectiveType: z.string(),
    objectiveValue: z.number(),
    startDate: z.string(),
    endDate: z.string(),
    status: z.nativeEnum(ChallengeStatus),
    maxParticipants: z.number().nullable().optional(),
    isPublic: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type ChallengeSchema = z.infer<typeof challengeSchema>;
export type ChallengeDto = Serialize<ChallengeSchema>;

// ============================================================================
// Challenge with Details Response DTO
// ============================================================================

export const participantInfoSchema = z.object({
    id: z.string(),
    userId: z.string(),
    userName: z.string(),
    status: z.nativeEnum(ParticipantStatus),
    progress: z.number(),
    joinedAt: z.string(),
    completedAt: z.string().nullable().optional(),
});

export type ParticipantInfoSchema = z.infer<typeof participantInfoSchema>;
export type ParticipantInfoDto = Serialize<ParticipantInfoSchema>;

export const exerciseInfoSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable().optional(),
});

export type ExerciseInfoSchema = z.infer<typeof exerciseInfoSchema>;
export type ExerciseInfoDto = Serialize<ExerciseInfoSchema>;

export const creatorInfoSchema = z.object({
    id: z.string(),
    email: z.string(),
    firstName: z.string().nullable().optional(),
    lastName: z.string().nullable().optional(),
});

export type CreatorInfoSchema = z.infer<typeof creatorInfoSchema>;
export type CreatorInfoDto = Serialize<CreatorInfoSchema>;

export const gymInfoSchema = z.object({
    id: z.string(),
    name: z.string(),
});

export type GymInfoSchema = z.infer<typeof gymInfoSchema>;
export type GymInfoDto = Serialize<GymInfoSchema>;

export const challengeWithDetailsSchema = challengeSchema.extend({
    creator: creatorInfoSchema.optional(),
    gym: gymInfoSchema.nullable().optional(),
    exercises: z.array(exerciseInfoSchema).optional(),
    participants: z.array(participantInfoSchema).optional(),
    participantCount: z.number().optional(),
});

export type ChallengeWithDetailsSchema = z.infer<typeof challengeWithDetailsSchema>;
export type ChallengeWithDetailsDto = Serialize<ChallengeWithDetailsSchema>;

// ============================================================================
// Create Challenge DTO
// ============================================================================

export const createChallengeSchema = baseChallengeFieldsSchema;

export type CreateChallengeSchema = z.infer<typeof createChallengeSchema>;
export type CreateChallengeDto = Serialize<CreateChallengeSchema>;

// ============================================================================
// Update Challenge DTO
// ============================================================================

export const updateChallengeSchema = baseChallengeFieldsSchema.partial();

export type UpdateChallengeSchema = z.infer<typeof updateChallengeSchema>;
export type UpdateChallengeDto = Serialize<UpdateChallengeSchema>;

// ============================================================================
// Query Challenges DTO (for filtering/pagination)
// ============================================================================

export const queryChallengesSchema = z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    difficulty: z.nativeEnum(ChallengeDifficulty).optional(),
    status: z.nativeEnum(ChallengeStatus).optional(),
    objectiveType: z.nativeEnum(ChallengeType).optional(),
    gymId: z.string().optional(),
    search: z.string().optional(),
    isPublic: z.string().optional(),
    minDuration: z.string().optional(),
    maxDuration: z.string().optional(),
});

export type QueryChallengesSchema = z.infer<typeof queryChallengesSchema>;
export type QueryChallengesDto = Serialize<QueryChallengesSchema>;

// ============================================================================
// Invite User to Challenge DTO
// ============================================================================

export const inviteUserSchema = z.object({
    userIds: z.array(z.string()).min(1, "Au moins un utilisateur doit être invité"),
});

export type InviteUserSchema = z.infer<typeof inviteUserSchema>;
export type InviteUserDto = Serialize<InviteUserSchema>;

// ============================================================================
// Update Participant Status DTO
// ============================================================================

export const updateParticipantStatusSchema = z.object({
    status: z.nativeEnum(ParticipantStatus),
    progress: z.number().min(0).max(100).optional(),
});

export type UpdateParticipantStatusSchema = z.infer<typeof updateParticipantStatusSchema>;
export type UpdateParticipantStatusDto = Serialize<UpdateParticipantStatusSchema>;

// ============================================================================
// Participant Response DTO
// ============================================================================

export const challengeParticipantSchema = z.object({
    id: z.string(),
    challengeId: z.string(),
    userId: z.string(),
    status: z.nativeEnum(ParticipantStatus),
    progress: z.number(),
    joinedAt: z.string(),
    completedAt: z.string().nullable().optional(),
});

export type ChallengeParticipantSchema = z.infer<typeof challengeParticipantSchema>;
export type ChallengeParticipantDto = Serialize<ChallengeParticipantSchema>;

// ============================================================================
// Participant with User Info DTO
// ============================================================================

export const participantWithUserSchema = challengeParticipantSchema.extend({
    user: z.object({
        id: z.string(),
        email: z.string(),
        firstName: z.string().nullable().optional(),
        lastName: z.string().nullable().optional(),
    }),
});

export type ParticipantWithUserSchema = z.infer<typeof participantWithUserSchema>;
export type ParticipantWithUserDto = Serialize<ParticipantWithUserSchema>;

// ============================================================================
// Participant Params DTO
// ============================================================================

export const participantParamsSchema = z.object({
    id: z.string().min(1, "L'id du défi est requis"),
    userId: z.string().min(1, "L'id de l'utilisateur est requis"),
});

export type ParticipantParamsSchema = z.infer<typeof participantParamsSchema>;
export type ParticipantParams = Serialize<ParticipantParamsSchema>;
