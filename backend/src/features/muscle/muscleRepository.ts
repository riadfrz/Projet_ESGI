import { Muscle, Prisma } from '@/config/client';
import prisma from '@/config/prisma';
import { QueryMusclesDto } from '@shared/dto';

class MuscleRepository {
    async findById(id: string): Promise<Muscle | null> {
        return prisma.muscle.findUnique({
            where: { id },
        });
    }

    async findByName(name: string): Promise<Muscle | null> {
        return prisma.muscle.findUnique({
            where: { name },
        });
    }

    async delete(id: string): Promise<Muscle> {
        return prisma.muscle.delete({
            where: { id },
        });
    }

    async create(data: Prisma.MuscleCreateInput): Promise<Muscle> {
        return prisma.muscle.create({
            data,
        });
    }

    async update(id: string, data: Prisma.MuscleUpdateInput): Promise<Muscle> {
        return prisma.muscle.update({
            where: { id },
            data,
        });
    }

    async findAll(
        query: QueryMusclesDto = {}
    ): Promise<{
        data: Muscle[];
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
        const where: Prisma.MuscleWhereInput = {};

        if (query.search) {
            where.OR = [
                {
                    name: {
                        contains: query.search,
                    },
                },
                {
                    description: {
                        contains: query.search,
                    },
                },
            ];
        }

        const [data, total] = await Promise.all([
            prisma.muscle.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.muscle.count({ where }),
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

    async findOne(filters: Prisma.MuscleWhereInput): Promise<Muscle | null> {
        return prisma.muscle.findFirst({
            where: filters,
        });
    }
}

export const muscleRepository = new MuscleRepository();
