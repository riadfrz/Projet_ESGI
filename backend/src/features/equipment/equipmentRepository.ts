import { GymEquipment, Prisma } from '@/config/client';
import prisma from '@/config/prisma';
import { QueryEquipmentsDto } from '@shared/dto';

class EquipmentRepository {
    async findById(id: string): Promise<GymEquipment | null> {
        return prisma.gymEquipment.findUnique({
            where: { id },
        });
    }

    async delete(id: string): Promise<GymEquipment> {
        return prisma.gymEquipment.delete({
            where: { id },
        });
    }

    async create(data: Prisma.GymEquipmentCreateInput): Promise<GymEquipment> {
        return prisma.gymEquipment.create({
            data,
        });
    }

    async update(id: string, data: Prisma.GymEquipmentUpdateInput): Promise<GymEquipment> {
        return prisma.gymEquipment.update({
            where: { id },
            data,
        });
    }

    async findAll(
        query: QueryEquipmentsDto = {}
    ): Promise<{
        data: GymEquipment[];
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
        const where: Prisma.GymEquipmentWhereInput = {};

        if (query.gymId) {
            where.gymId = query.gymId;
        }

        if (query.search) {
            where.name = {
                contains: query.search,
            };
        }

        const [data, total] = await Promise.all([
            prisma.gymEquipment.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.gymEquipment.count({ where }),
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

    async findOne(filters: Prisma.GymEquipmentWhereInput): Promise<GymEquipment | null> {
        return prisma.gymEquipment.findFirst({
            where: filters,
        });
    }
}

export const equipmentRepository = new EquipmentRepository();
