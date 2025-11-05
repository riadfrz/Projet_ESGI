import { UserDto, SessionResponseDto } from '@shared/dto';
import { UserRole, CivilityEnum, AuthProviderEnum } from '@shared/enums';

// Define the Prisma enums and types
type PrismaRole = 'CLIENT' | 'GYM_OWNER' | 'ADMIN';
type PrismaCivility = 'MR' | 'MRS' | 'OTHER';
type PrismaAuthProvider = 'GOOGLE' | 'APPLE' | 'MAGIC_LINK' | 'EMAIL_PASSWORD';

interface PrismaUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    civility: PrismaCivility | null;
    birthDate: Date | null;
    role: PrismaRole;
    points: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

interface PrismaSession {
    id: string;
    userId: string;
    expiresAt: Date;
    token: string;
    createdAt: Date;
    updatedAt: Date;
    ipAddress: string | null;
    userAgent: string | null;
    authProvider: PrismaAuthProvider;
}

class AuthTransform {
    /**
     * Convert Prisma Role to UserRole enum
     */
    private convertRole(role: PrismaRole): UserRole {
        const roleMap: Record<PrismaRole, UserRole> = {
            CLIENT: UserRole.CLIENT,
            GYM_OWNER: UserRole.GYM_OWNER,
            ADMIN: UserRole.ADMIN,
        };
        return roleMap[role];
    }

    /**
     * Convert Prisma Civility to CivilityEnum
     */
    private convertCivility(civility: PrismaCivility | null): CivilityEnum | null {
        if (!civility) return null;
        const civilityMap: Record<PrismaCivility, CivilityEnum> = {
            MR: CivilityEnum.MR,
            MRS: CivilityEnum.MRS,
            OTHER: CivilityEnum.OTHER,
        };
        return civilityMap[civility];
    }

    /**
     * Convert Prisma AuthProvider to AuthProviderEnum
     */
    private convertAuthProvider(provider: PrismaAuthProvider): AuthProviderEnum {
        const providerMap: Record<PrismaAuthProvider, AuthProviderEnum> = {
            GOOGLE: AuthProviderEnum.GOOGLE,
            APPLE: AuthProviderEnum.APPLE,
            MAGIC_LINK: AuthProviderEnum.MAGIC_LINK,
            EMAIL_PASSWORD: AuthProviderEnum.EMAIL_PASSWORD,
        };
        return providerMap[provider];
    }

    /**
     * Transform Prisma User to UserDto
     */
    public toUserDto(user: PrismaUser): UserDto {
        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            civility: this.convertCivility(user.civility),
            birthDate: user.birthDate?.toISOString() ?? null,
            role: this.convertRole(user.role),
            points: user.points,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
            deletedAt: user.deletedAt?.toISOString() ?? null,
        };
    }

    /**
     * Transform Prisma Session to SessionResponseDto
     */
    public toSessionDto(session: PrismaSession, includeToken: boolean = false): SessionResponseDto {
        return {
            id: session.id,
            userId: session.userId,
            expiresAt: session.expiresAt.toISOString(),
            token: includeToken ? session.token : undefined,
            createdAt: session.createdAt.toISOString(),
            updatedAt: session.updatedAt.toISOString(),
            ipAddress: session.ipAddress,
            userAgent: session.userAgent,
            authProvider: this.convertAuthProvider(session.authProvider),
        };
    }

    /**
     * Transform array of Prisma Sessions to SessionResponseDto array
     */
    public toSessionDtoArray(sessions: PrismaSession[], includeToken: boolean = false): SessionResponseDto[] {
        return sessions.map(session => this.toSessionDto(session, includeToken));
    }
}

export const authTransform = new AuthTransform();
