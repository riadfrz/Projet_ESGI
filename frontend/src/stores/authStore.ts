import { UserDto } from '@shared/dto';
import { create } from 'zustand';

interface AuthState {
    user: UserDto | null;
    isAuthenticated: boolean;
    setUser: (user: UserDto | null) => void;
    setIsAuthenticated: (value: boolean) => void;
    logout: () => void;
}

/**
 * Authentication store using Zustand
 * Manages user state and authentication status
 * 
 * Note: This app uses HTTP-only cookies for session management,
 * so we don't store tokens in the client-side store
 */
export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,

    setUser: (user) => set({ user }),
    
    setIsAuthenticated: (value) => set({ isAuthenticated: value }),
    
    logout: () =>
        set({
            user: null,
            isAuthenticated: false,
        }),
}));
