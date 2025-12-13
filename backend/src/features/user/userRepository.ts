import { User, Prisma, $Enums } from "@/config/client";
import prisma from "@/config/prisma";

class UserRepository {
    constructor() { }

    /**
     * Find user by email
     * @param email - The email to search for
     * @returns The user or null
     */
    async findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { email }
        });
    }

    /**
     * Find user by ID
     * @param id - The user ID to search for
     * @returns The user or null
     */
    async findById(id: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { id }
        });
    }

    /**
     * Create a new user
     * @param data - The user data to create
     * @returns The created user
     */
    async create(data: Prisma.UserCreateInput): Promise<User> {
        return prisma.user.create({
            data,
        });
    }

    /**
     * Update a user
     * @param id - The user ID to update
     * @param data - The data to update
     * @returns The updated user
     */
    async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
        return prisma.user.update({
            where: { id },
            data,
        });
    }

    /**
     * Delete a user (soft delete)
     * @param id - The user ID to delete
     * @returns The deleted user
     */
    async delete(id: string): Promise<User> {
        return prisma.user.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }

    /**
     * Get all users with pagination
     * @param page - The page number
     * @param limit - The number of items per page
     * @param search - Search query
     * @param role - Filter by role
     * @returns The users and pagination info
     */
    async findAll(options?: {
        page?: number;
        limit?: number;
        search?: string;
        role?: $Enums.Role;
    }): Promise<{ users: User[]; total: number }> {
        const page = options?.page || 1;
        const limit = options?.limit || 10;
        const skip = (page - 1) * limit;

        const where: Prisma.UserWhereInput = {
            deletedAt: null,
        };

        if (options?.search) {
            where.OR = [
                { email: { contains: options.search } },
                { firstName: { contains: options.search } },
                { lastName: { contains: options.search } },
            ];
        }

        if (options?.role) {
            where.role = options.role;
        }

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.user.count({ where }),
        ]);

        return { users, total };
    }
}

export const userRepository = new UserRepository();
