import { Exercise } from '@/config/client';
import { transformDateToString } from '@/utils';
import { ExerciseDto, ExerciseWithMusclesDto, MuscleInfoDto } from '@shared/dto';
import { Difficulty } from '@shared/enums';

// Type for Exercise with muscles relation
export type ExerciseWithMuscles = Exercise & {
    exerciseMuscles?: Array<{
        isPrimary: boolean;
        muscle: {
            id: string;
            name: string;
            description: string | null;
            identifier: string;
        };
    }>;
};

class ExerciseTransform {
    /**
     * Transform Prisma Exercise to ExerciseDto
     */
    public toExerciseDto(exercise: Exercise): ExerciseDto {
        const exerciseDate = transformDateToString(exercise);
        return {
            ...exerciseDate,
            difficulty: exerciseDate.difficulty as Difficulty,
        };
    }

    /**
     * Transform array of Prisma Exercises to ExerciseDto array
     */
    public toExerciseDtoArray(exercises: Exercise[]): ExerciseDto[] {
        return exercises.map(exercise => this.toExerciseDto(exercise));
    }

    /**
     * Transform Prisma Exercise with Muscles to ExerciseWithMusclesDto
     */
    public toExerciseWithMusclesDto(exercise: ExerciseWithMuscles): ExerciseWithMusclesDto {
        const exerciseDate = transformDateToString(exercise);

        const muscles: MuscleInfoDto[] | undefined = exercise.exerciseMuscles?.map(em => ({
            id: em.muscle.id,
            name: em.muscle.name,
            description: em.muscle.description,
            identifier: em.muscle.identifier,
            isPrimary: em.isPrimary,
        }));

        return {
            ...exerciseDate,
            difficulty: exerciseDate.difficulty as Difficulty,
            muscles,
        };
    }

    /**
     * Transform array of Prisma Exercises with Muscles to ExerciseWithMusclesDto array
     */
    public toExerciseWithMusclesDtoArray(exercises: ExerciseWithMuscles[]): ExerciseWithMusclesDto[] {
        return exercises.map(exercise => this.toExerciseWithMusclesDto(exercise));
    }
}

export const exerciseTransform = new ExerciseTransform();
