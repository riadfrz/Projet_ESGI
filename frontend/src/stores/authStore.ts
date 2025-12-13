import { UserDto } from '@/types';
import { create } from 'zustand';
import { authService } from '@/api/authServices';
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
            if (!token) {
                set({ user: null, isAuthenticated: false });
                set({ isLoading: false });
                return;
            }

            const response = await authService.getCurrentUser();
            if (response && response.data) {
                set({ user: response.data, isAuthenticated: true });
            } else {
                // If token exists but /me fails, maybe token is invalid
                set({ user: null, isAuthenticated: false });
                Cookies.remove('accessToken');
            }
        } catch (error) {
            console.warn('Auth check failed', error);
            Cookies.remove('accessToken');
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
