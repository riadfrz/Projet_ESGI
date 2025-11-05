import { Exercise, Prisma } from '@/config/client';
import prisma from '@/config/prisma';
import { QueryExercisesDto } from '@shared/dto';
import { ExerciseWithMuscles } from './exerciseTransform';

// Define include object for consistent use across methods
const exerciseInclude = {
    exerciseMuscles: {
        include: {
            muscle: true,
        },
    },
};

class ExerciseRepository {
    async findById(id: string): Promise<ExerciseWithMuscles | null> {
        return prisma.exercise.findUnique({
            where: { id },
            include: exerciseInclude,
        });
    }

    async delete(id: string): Promise<Exercise> {
        return prisma.exercise.delete({
            where: { id },
        });
    }

    async create(data: Prisma.ExerciseCreateInput): Promise<ExerciseWithMuscles> {
        return prisma.exercise.create({
            data,
            include: exerciseInclude,
        });
    }

    async update(id: string, data: Prisma.ExerciseUpdateInput): Promise<ExerciseWithMuscles> {
        return prisma.exercise.update({
            where: { id },
            data,
            include: exerciseInclude,
        });
    }

    async findAll(
        query: QueryExercisesDto = {}
    ): Promise<{
        data: ExerciseWithMuscles[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
            nextPage: number;
            previousPage: number;
            perPage: number;
        };
    }> {
        // Convert string parameters to appropriate types
        const page = query.page ? parseInt(query.page, 10) : 1;
        const limit = query.limit ? parseInt(query.limit, 10) : 10;
        const skip = (page - 1) * limit;

        // Build where clause
        const where: Prisma.ExerciseWhereInput = {};

        if (query.difficulty) {
            where.difficulty = query.difficulty;
        }

        if (query.muscleId) {
            where.exerciseMuscles = {
                some: {
                    muscleId: query.muscleId,
                },
            };
        }

        if (query.search) {
            where.OR = [
                { name: { contains: query.search } },
                { description: { contains: query.search } },
            ];
        }

        const [data, total] = await Promise.all([
            prisma.exercise.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: exerciseInclude,
            }),
            prisma.exercise.count({ where }),
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            data,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems: total,
                nextPage: page < totalPages ? page + 1 : 0,
                previousPage: page > 1 ? page - 1 : 0,
                perPage: limit,
            },
        };
    }

    async findOne(filters: Prisma.ExerciseWhereInput): Promise<ExerciseWithMuscles | null> {
        return prisma.exercise.findFirst({
            where: filters,
            include: exerciseInclude,
        });
    }

    /**
     * Update exercise muscles (replace all muscle associations)
     */
    async updateExerciseMuscles(exerciseId: string, muscleIds: string[]): Promise<void> {
        // Delete existing associations
        await prisma.exerciseMuscle.deleteMany({
            where: { exerciseId },
        });

        // Create new associations
        if (muscleIds.length > 0) {
            await prisma.exerciseMuscle.createMany({
                data: muscleIds.map(muscleId => ({
                    exerciseId,
                    muscleId,
                })),
            });
        }
    }
}

export const exerciseRepository = new ExerciseRepository();
