import { api } from '@/api/interceptor';
import { ApiResponse } from '@/types';
import { UserDto, LoginDto, RegisterDto } from '@/types';
import Cookies from 'js-cookie';

class AuthService {
    /**
     * Register a new user
     */
    public async register(data: RegisterDto): Promise<ApiResponse<any>> {
        const response = await api.fetchRequest('/api/auth/register', 'POST', data);
        
        // Backend returns raw { accessToken, refreshToken } on success for register too
        if (response && response.accessToken) {
             return {
                 status: 200, // or 201
                 message: 'Registration successful',
                 data: response,
                 timestamp: new Date().toISOString()
             };
        }
        return response;
    }

    /**
     * Login user
     */
    public async login(data: LoginDto): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> {
        const response = await api.fetchRequest('/api/auth/login', 'POST', data);
        
        // Backend returns raw { accessToken, refreshToken } but we expect ApiResponse
        if (response && response.accessToken) {
            Cookies.set('accessToken', response.accessToken);
            return {
                status: 200,
                message: 'Login successful',
                data: response,
                timestamp: new Date().toISOString()
            };
        }
        
        return response;
    }

    /**
     * Get current authenticated user
     */
    public async getCurrentUser(): Promise<ApiResponse<UserDto> | null> {
        try {
            return await api.fetchRequest('/api/auth/me', 'GET', null, true);
        } catch (error) {
            console.warn('Failed to get current user - might not be logged in', error);
            return null;
        }
    }

    /**
     * Logout user
     */
    public async logout(): Promise<ApiResponse<void>> {
        try {
            return await api.fetchRequest('/api/auth/logout', 'POST', null, true);
        } catch (error) {
            console.error('Logout failed', error);
            return { message: 'Logout failed', status: 500, data: undefined, timestamp: new Date().toISOString() };
        }
    }

    /**
     * Initiate Google OAuth login
     */
    public initiateGoogleLogin(): void {
        const backendUrl = api.getUrl();
        window.location.href = `${backendUrl}/api/auth/google/callback`; // Usually starts flow, check backend route
    }
}

export const authService = new AuthService();
