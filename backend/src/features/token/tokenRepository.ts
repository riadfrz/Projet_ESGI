import { Token, Prisma } from '@/config/client';
import prisma from '@/config/prisma';

class TokenRepository {
    constructor() {}

    /**
     * Create a new token
     */
    async create(data: Prisma.TokenCreateInput): Promise<Token> {
        return prisma.token.create({
            data,
        });
    }

    /**
     * Find token by token string
     */
    async findByToken(token: string): Promise<Token | null> {
        return prisma.token.findUnique({
            where: { token },
        });
    }

    /**
     * Find all tokens by user ID
     */
    async findAllByUserId(userId: string): Promise<Token[]> {
        return prisma.token.findMany({
            where: { userId },
        });
    }

    /**
     * Find all tokens by user ID and browser (user agent)
     */
    async findAllByUserIdAndBrowser(userId: string, userAgent?: string): Promise<Token[]> {
        return prisma.token.findMany({
            where: {
                userId,
                ...(userAgent && { userAgent }),
            },
        });
    }

    /**
     * Delete token by ID
     */
    async delete(id: string): Promise<Token> {
        return prisma.token.delete({
            where: { id },
        });
    }

    /**
     * Delete all tokens by user ID and type
     */
    async deleteByUserAndType(userId: string, type: string): Promise<Prisma.BatchPayload> {
        return prisma.token.deleteMany({
            where: {
                userId,
                type,
            },
        });
    }

    /**
     * Mark token as unavailable
     */
    async markAsUnavailable(id: string): Promise<Token> {
        return prisma.token.update({
            where: { id },
            data: { unavailableAt: new Date() },
        });
    }

    /**
     * Delete expired tokens
     */
    async deleteExpired(): Promise<Prisma.BatchPayload> {
        return prisma.token.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date(),
                },
            },
        });
    }
}

export const tokenRepository = new TokenRepository();
