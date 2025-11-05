import { Gym, Prisma } from '@/config/client';
import prisma from '@/config/prisma';
import { QueryGymsDto } from '@shared/dto';

// Define include object for consistent use across methods
const gymInclude = {
    owner: true,
};

class GymRepository {
    async findById(id: string): Promise<Gym | null> {
        return prisma.gym.findUnique({
            where: { id },
            include: gymInclude,
        });
    }

    async delete(id: string): Promise<Gym> {
        return prisma.gym.delete({
            where: { id },
        });
    }

    async create(data: Prisma.GymCreateInput): Promise<Gym> {
        return prisma.gym.create({
            data,
            include: gymInclude,
        });
    }

    async update(id: string, data: Prisma.GymUpdateInput): Promise<Gym> {
        return prisma.gym.update({
            where: { id },
            data,
            include: gymInclude,
        });
    }

    async findAll(
        query: QueryGymsDto = {}
    ): Promise<{
        data: Gym[];
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
        const where: Prisma.GymWhereInput = {};

        if (query.status) {
            where.status = query.status;
        }

        if (query.city) {
            where.city = {
                contains: query.city,
            };
        }

        if (query.ownerId) {
            where.ownerId = query.ownerId;
        }

        if (query.search) {
            where.OR = [
                { name: { contains: query.search } },
                { address: { contains: query.search } },
                { city: { contains: query.search } },
            ];
        }

        const [data, total] = await Promise.all([
            prisma.gym.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: gymInclude,
            }),
            prisma.gym.count({ where }),
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

    async findOne(filters: Prisma.GymWhereInput): Promise<Gym | null> {
        return prisma.gym.findFirst({
            where: filters,
            include: gymInclude,
        });
    }
}

export const gymRepository = new GymRepository();
