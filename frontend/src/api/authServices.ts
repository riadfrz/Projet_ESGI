import { api } from '@/api/interceptor';
import { ApiResponse } from '@/types';
import { UserDto, SessionResponseDto } from '@shared/dto';
import Cookies from 'js-cookie';

/**
 * Authentication service for handling all auth-related API calls
 */
class AuthService {
    /**
     * Development login (only for testing)
     * @param email - User email
     * @param role - Optional role (CLIENT, ADMIN, TRAINER)
     * @param firstName - Optional first name
     * @param lastName - Optional last name
     */
    public async devLogin(
        email: string,
        role?: string,
        firstName?: string,
        lastName?: string
    ): Promise<ApiResponse<UserDto>> {
        const response = await api.fetchRequest('/api/auth/dev-login', 'POST', {
            email,
            role,
            firstName,
            lastName,
        });

        // Note: Session token is set in HTTP-only cookie by backend
        return response;
    }

    /**
     * Get current authenticated user
     */
    public async getCurrentUser(): Promise<ApiResponse<UserDto> | null> {
        try {
            return await api.fetchRequest('/api/auth/me', 'GET', null, true);
        } catch (error) {
            console.error('Failed to get current user:', error);
            return null;
        }
    }

    /**
     * Get user sessions
     */
    public async getSessions(): Promise<ApiResponse<SessionResponseDto[]>> {
        return api.fetchRequest('/api/auth/sessions', 'GET', null, true);
    }

    /**
     * Logout user (invalidates current session)
     */
    public async logout(): Promise<ApiResponse<void>> {
        const response = await api.fetchRequest('/api/auth/logout', 'POST', null, true);
        
        // Clear any client-side tokens if they exist
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        
        return response;
    }

    /**
     * Delete a specific session by ID
     * @param sessionId - The ID of the session to delete
     */
    public async deleteSession(sessionId: string): Promise<ApiResponse<void>> {
        return api.fetchRequest(`/api/auth/sessions/${sessionId}`, 'DELETE', null, true);
    }

    /**
     * Initiate Google OAuth login
     * Redirects to Google OAuth page
     */
    public initiateGoogleLogin(): void {
        const backendUrl = api.getUrl();
        window.location.href = `${backendUrl}/api/auth/google`;
    }
}

export const authService = new AuthService();
