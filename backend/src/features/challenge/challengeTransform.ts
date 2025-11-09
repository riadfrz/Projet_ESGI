import { Challenge, ChallengeParticipant } from '@/config/client';
import { transformDateToString } from '@/utils';
import { 
    ChallengeDto, 
    ChallengeWithDetailsDto, 
    ParticipantInfoDto,
    ExerciseInfoDto,
    CreatorInfoDto,
    GymInfoDto,
    ChallengeParticipantDto,
    ParticipantWithUserDto
} from '@shared/dto';
import { ChallengeDifficulty, ChallengeStatus, ParticipantStatus } from '@shared/enums';

// Type for Challenge with relations
export type ChallengeWithRelations = Challenge & {
    creator?: {
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
    };
    gym?: {
        id: string;
        name: string;
    } | null;
    challengeExercises?: Array<{
        exercise: {
            id: string;
            name: string;
            description: string | null;
        };
    }>;
    challengeParticipants?: Array<{
        id: string;
        userId: string;
        status: string;
        progress: number;
        joinedAt: Date;
        completedAt: Date | null;
        user: {
            id: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
        };
    }>;
    _count?: {
        challengeParticipants: number;
    };
};

// Type for ChallengeParticipant with relations
export type ChallengeParticipantWithUser = ChallengeParticipant & {
    user: {
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
    };
};

class ChallengeTransform {
    /**
     * Transform Prisma Challenge to ChallengeDto
     */
    public toChallengeDto(challenge: Challenge): ChallengeDto {
        const challengeDate = transformDateToString(challenge);
        return {
            ...challengeDate,
            difficulty: challengeDate.difficulty as ChallengeDifficulty,
            status: challengeDate.status as ChallengeStatus,
        };
    }

    /**
     * Transform array of Prisma Challenges to ChallengeDto array
     */
    public toChallengeDtoArray(challenges: Challenge[]): ChallengeDto[] {
        return challenges.map(challenge => this.toChallengeDto(challenge));
    }

    /**
     * Transform Prisma Challenge with Relations to ChallengeWithDetailsDto
     */
    public toChallengeWithDetailsDto(challenge: ChallengeWithRelations): ChallengeWithDetailsDto {
        const challengeDate = transformDateToString(challenge);

        const creator: CreatorInfoDto | undefined = challenge.creator
            ? {
                  id: challenge.creator.id,
                  email: challenge.creator.email,
                  firstName: challenge.creator.firstName,
                  lastName: challenge.creator.lastName,
              }
            : undefined;

        const gym: GymInfoDto | null | undefined = challenge.gym
            ? {
                  id: challenge.gym.id,
                  name: challenge.gym.name,
              }
            : challenge.gym === null ? null : undefined;

        const exercises: ExerciseInfoDto[] | undefined = challenge.challengeExercises?.map(ce => ({
            id: ce.exercise.id,
            name: ce.exercise.name,
            description: ce.exercise.description,
        }));

        const participants: ParticipantInfoDto[] | undefined = challenge.challengeParticipants?.map(cp => ({
            id: cp.id,
            userId: cp.userId,
            userName: `${cp.user.firstName || ''} ${cp.user.lastName || ''}`.trim() || cp.user.email,
            status: cp.status as ParticipantStatus,
            progress: cp.progress,
            joinedAt: cp.joinedAt.toISOString(),
            completedAt: cp.completedAt?.toISOString() ?? null,
        }));

        const participantCount = challenge._count?.challengeParticipants;

        return {
            ...challengeDate,
            difficulty: challengeDate.difficulty as ChallengeDifficulty,
            status: challengeDate.status as ChallengeStatus,
            creator,
            gym,
            exercises,
            participants,
            participantCount,
        };
    }

    /**
     * Transform array of Prisma Challenges with Relations to ChallengeWithDetailsDto array
     */
    public toChallengeWithDetailsDtoArray(challenges: ChallengeWithRelations[]): ChallengeWithDetailsDto[] {
        return challenges.map(challenge => this.toChallengeWithDetailsDto(challenge));
    }

    /**
     * Transform Prisma ChallengeParticipant to ChallengeParticipantDto
     */
    public toChallengeParticipantDto(participant: ChallengeParticipant): ChallengeParticipantDto {
        const participantDate = transformDateToString(participant);
        return {
            ...participantDate,
            status: participantDate.status as ParticipantStatus,
        };
    }

    /**
     * Transform Prisma ChallengeParticipant with User to ParticipantWithUserDto
     */
    public toParticipantWithUserDto(participant: ChallengeParticipantWithUser): ParticipantWithUserDto {
        const participantDate = transformDateToString(participant);
        return {
            ...participantDate,
            status: participantDate.status as ParticipantStatus,
            user: {
                id: participant.user.id,
                email: participant.user.email,
                firstName: participant.user.firstName,
                lastName: participant.user.lastName,
            },
        };
    }

    /**
     * Transform array of Prisma ChallengeParticipants with User to ParticipantWithUserDto array
     */
    public toParticipantWithUserDtoArray(participants: ChallengeParticipantWithUser[]): ParticipantWithUserDto[] {
        return participants.map(participant => this.toParticipantWithUserDto(participant));
    }
}

export const challengeTransform = new ChallengeTransform();
