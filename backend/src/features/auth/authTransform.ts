import { User, Session } from '@/config/client';
import { transformDateToString } from '@/utils';
import { UserDto, SessionResponseDto } from '@shared/dto';
import { UserRole, CivilityEnum, AuthProviderEnum } from '@shared/enums';

class AuthTransform {
    /**
     * Transform Prisma User to UserDto
     */
    public toUserDto(user: User): UserDto {
        const userDate = transformDateToString(user);
        return {
            ...userDate,
            role: userDate.role as UserRole,
            civility: userDate.civility as CivilityEnum | null,
        };
    }

    /**
     * Transform Prisma Session to SessionResponseDto
     */
    public toSessionDto(session: Session, includeToken: boolean = false): SessionResponseDto {
        const sessionDate = transformDateToString(session);
        return {
            ...sessionDate,
            token: includeToken ? session.token : undefined,
            authProvider: sessionDate.authProvider as AuthProviderEnum,
        };
    }

    /**
     * Transform array of Prisma Sessions to SessionResponseDto array
     */
    public toSessionDtoArray(sessions: Session[], includeToken: boolean = false): SessionResponseDto[] {
        return sessions.map(session => this.toSessionDto(session, includeToken));
    }
}

export const authTransform = new AuthTransform();
