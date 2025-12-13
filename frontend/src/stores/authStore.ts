import { UserDto } from '@/types';
import { create } from 'zustand';
import { authService } from '@/api/authServices';
import { parseJwt } from '@/utils/jwt';
import Cookies from 'js-cookie';

interface AuthState {
    user: UserDto | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setUser: (user: UserDto | null) => void;
    setIsAuthenticated: (value: boolean) => void;
    checkAuth: () => Promise<void>;
    logout: () => void;
}

/**
 * Authentication store using Zustand
 * Manages user state and authentication status
 */
export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true, // Start loading by default to check session

    setUser: (user) => set({ user }),
    
    setIsAuthenticated: (value) => set({ isAuthenticated: value }),
    


    checkAuth: async () => {
        set({ isLoading: true });
        try {
            const token = Cookies.get('accessToken');
            if (token) {
                const decoded = parseJwt(token);
                if (decoded) {
                    // Map JWT payload to UserDto
                    // JWT often uses 'sub' for id, but backend implementation puts 'id' directly.
                    // We need to handle potential expiration check here if not handled by interceptor logic
                    if (decoded.exp * 1000 < Date.now()) {
                        throw new Error('Token expired');
                    }
                    
                    const user: UserDto = {
                        id: decoded.id,
                        email: decoded.email,
                        firstName: decoded.firstName,
                        lastName: decoded.lastName,
                        role: decoded.role,
                        points: 0, // Not in JWT, default to 0 or fetch separately if possible
                        createdAt: '', // Missing in JWT
                        updatedAt: ''  // Missing in JWT
                    };
                    set({ user, isAuthenticated: true });
                } else {
                    set({ user: null, isAuthenticated: false });
                }
            } else {
                // Should we try /me as fallback? 
                // Given the issue, let's rely on token for now.
                set({ user: null, isAuthenticated: false });
            }
        } catch (error) {
            console.warn('Auth check failed', error);
            Cookies.remove('accessToken'); // Cleanup bad token
            set({ user: null, isAuthenticated: false });
        } finally {
            set({ isLoading: false });
        }
    },
    
    logout: () => {
        authService.logout(); // Fire and forget
        set({
            user: null,
            isAuthenticated: false,
        });
    }
}));
