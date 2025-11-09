import { TrainingSession } from '@/config/client';
import { transformDateToString } from '@/utils';
import { 
    TrainingSessionDto, 
    TrainingSessionWithDetailsDto,
} from '@shared/dto';
import { Difficulty } from '@shared/enums';

// Type for TrainingSession with relations
export type TrainingSessionWithRelations = TrainingSession & {
    exercise: {
        id: string;
        name: string;
        difficulty: string;
    };
    gym?: {
        id: string;
        name: string;
    } | null;
    challenge?: {
        id: string;
        title: string;
    } | null;
};

class TrainingSessionTransform {
    /**
     * Transform Prisma TrainingSession to TrainingSessionDto
     */
    public toTrainingSessionDto(session: TrainingSession): TrainingSessionDto {
        const sessionDate = transformDateToString(session);
        return sessionDate;
    }

    /**
     * Transform array of Prisma TrainingSessions to TrainingSessionDto array
     */
    public toTrainingSessionDtoArray(sessions: TrainingSession[]): TrainingSessionDto[] {
        return sessions.map(session => this.toTrainingSessionDto(session));
    }

    /**
     * Transform Prisma TrainingSession with Relations to TrainingSessionWithDetailsDto
     */
    public toTrainingSessionWithDetailsDto(session: TrainingSessionWithRelations): TrainingSessionWithDetailsDto {
        const sessionDate = transformDateToString(session);

        return {
            ...sessionDate,
            exercise: {
                id: session.exercise.id,
                name: session.exercise.name,
                difficulty: session.exercise.difficulty as Difficulty,
            },
            gym: session.gym ? {
                id: session.gym.id,
                name: session.gym.name,
            } : session.gym === null ? null : undefined,
            challenge: session.challenge ? {
                id: session.challenge.id,
                title: session.challenge.title,
            } : session.challenge === null ? null : undefined,
        };
    }

    /**
     * Transform array of Prisma TrainingSessions with Relations to TrainingSessionWithDetailsDto array
     */
    public toTrainingSessionWithDetailsDtoArray(sessions: TrainingSessionWithRelations[]): TrainingSessionWithDetailsDto[] {
        return sessions.map(session => this.toTrainingSessionWithDetailsDto(session));
    }
}

export const trainingSessionTransform = new TrainingSessionTransform();
