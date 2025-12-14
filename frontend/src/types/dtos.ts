import { UserRole } from '@shared/enums';
export { UserRole };

export interface UserDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    points: number;
    phone?: string | null;
    birthDate?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface RegisterDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: UserRole;
    // Specific fields
    gymName?: string;
    address?: string;
    secretCode?: string;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface SessionResponseDto {
    id: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    ipAddress?: string;
    userAgent?: string;
}
