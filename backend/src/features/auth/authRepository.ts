import { User, $Enums } from "@/config/client";
import prisma from "@/config/prisma";
import { 
    UpsertUserFromOAuthParamsDto, 
    UpsertOAuthAccountParamsDto, 
    CreateSessionParamsDto 
} from "@shared/dto";

class AuthRepository {
    constructor() { }

    /**
     * Get current user from session
     */
    async getCurrentUser(sessionToken: string): Promise<User | null> {
        const session = await prisma.session.findUnique({
            where: { token: sessionToken },
            include: { user: true }
        });

        if (!session || session.expiresAt < new Date()) {
            return null;
        }

        return session.user;
    }

    /**
     * Get all user sessions
     */
    async getUserSessions(userId: string) {
        return prisma.session.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
    }

    /**
     * Revoke a session
     */
    async revokeSession(sessionId: string) {
        return prisma.session.delete({
            where: { id: sessionId }
        });
    }

    /**
     * Check if user is authenticated
     */
    async isAuthenticated(sessionToken: string | undefined): Promise<boolean> {
        if (!sessionToken) return false;

        const session = await prisma.session.findUnique({
            where: { token: sessionToken }
        });

        return session !== null && session.expiresAt > new Date();
    }

    /**
     * Upsert user from OAuth provider
     */
    async upsertUserFromOAuth(params: UpsertUserFromOAuthParamsDto): Promise<User> {
        return prisma.user.upsert({
            where: { email: params.email },
            update: {
                firstName: params.firstName,
                lastName: params.lastName,
            },
            create: {
                email: params.email,
                firstName: params.firstName,
                lastName: params.lastName,
            },
        });
    }

    /**
     * Upsert OAuth account for a user
     */
    async upsertOAuthAccount(params: UpsertOAuthAccountParamsDto) {
        return prisma.account.upsert({
            where: {
                providerId_accountId: {
                    providerId: params.providerId,
                    accountId: params.accountId,
                },
            },
            update: {
                accessToken: params.accessToken,
                refreshToken: params.refreshToken,
                idToken: params.idToken,
                accessTokenExpiresAt: params.accessTokenExpiresAt ? new Date(params.accessTokenExpiresAt) : null,
                scope: params.scope,
            },
            create: {
                userId: params.userId,
                accountId: params.accountId,
                providerId: params.providerId,
                accessToken: params.accessToken,
                refreshToken: params.refreshToken,
                idToken: params.idToken,
                accessTokenExpiresAt: params.accessTokenExpiresAt ? new Date(params.accessTokenExpiresAt) : null,
                scope: params.scope,
            },
        });
    }

    /**
     * Create a new session
     */
    async createSession(params: CreateSessionParamsDto) {
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        
        return prisma.session.create({
            data: {
                id: sessionId,
                userId: params.userId,
                token: params.token,
                expiresAt: new Date(params.expiresAt),
                ipAddress: params.ipAddress,
                userAgent: params.userAgent,
                authProvider: params.authProvider as $Enums.AuthProvider,
            },
        });
    }
}

export const authRepository = new AuthRepository();
