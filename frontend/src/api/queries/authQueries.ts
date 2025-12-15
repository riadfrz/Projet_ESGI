import { authService } from '@/api/authServices';
import { useAuthStore } from '@/stores/authStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';

/**
 * Hook for fetching current user data
 */
export const useAutoLogin = () => {
    const { setUser, setIsAuthenticated } = useAuthStore();

    return useQuery({
        queryKey: ['autoLogin'],
        queryFn: async () => {
            try {
                // Session token is in HTTP-only cookie, backend will validate it
                const response = await authService.getCurrentUser();
                
                if (response?.data) {
                    setUser(response.data);
                    setIsAuthenticated(true);
                    console.log('Auto login successful:', response.data.email);
                    return true;
                }
                
                // No valid session
                handleLogout();
                return false;
            } catch (error) {
                console.error('Auto login failed:', error);
                handleLogout();
                return false;
            }
        },
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });
};

/**
 * Hook for fetching current user data
 */
export const useCurrentUser = () => {
    const { setUser } = useAuthStore();

    return useQuery({
        queryKey: ['currentUser'],
        queryFn: async () => {
            const response = await authService.getCurrentUser();
            if (response?.data) {
                setUser(response.data);
                return response.data;
            }
            return null;
        },
        retry: 1,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

/**
 * Hook for fetching user sessions
 */
export const useUserSessions = () => {
    return useQuery({
        queryKey: ['userSessions'],
        queryFn: async () => {
            const response = await authService.getSessions();
            return response.data;
        },
        retry: 1,
    });
};

/**
 * Hook for logout
 */
export const useLogout = () => {
    return useMutation({
        mutationFn: async () => {
            await authService.logout();
            handleLogout();
        },
        onSuccess: () => {
            console.log('Logout successful');
        },
        onError: (error: Error) => {
            console.error('Logout failed:', error.message);
            // Force logout on client even if backend fails
            handleLogout();
        },
    });
};

/**
 * Hook for deleting a specific session
 */
export const useDeleteSession = () => {
    return useMutation({
        mutationFn: async (sessionId: string) => {
            await authService.deleteSession(sessionId);
        },
        onSuccess: () => {
            console.log('Session deleted successfully');
        },
        onError: (error: Error) => {
            console.error('Failed to delete session:', error.message);
        },
    });
};

/**
 * Hook for initiating Google OAuth login
 */
export const useGoogleLogin = () => {
    return useMutation({
        mutationFn: async () => {
            authService.initiateGoogleLogin();
            // This will redirect, so no return needed
        },
    });
};

/**
 * Helper function to handle logout
 * Clears all auth state
 */
const handleLogout = () => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    useAuthStore.getState().logout();
};
