import { useAuthStore } from '@/stores/authStore';
import { authService } from '@/api/authServices';
import { LoginDto, RegisterDto } from '@/types';

export const useAuth = () => {
    const store = useAuthStore();

    const login = async (data: LoginDto) => {
        const response = await authService.login(data);
        if (response && response.data && response.data.accessToken) {
            await store.checkAuth();
        }
        return response;
    };

    const register = async (data: RegisterDto) => {
        const response = await authService.register(data);
        // Register usually returns tokens too in this app, or at least success status
        if (response && response.status === 200) {
             // If backend auto-logins after register, we can checkAuth. 
             // If not, we might need to redirect to login (handled in component).
             // But if it returns tokens (as suggested by authService comment), we update.
             if (response.data && response.data.accessToken) {
                await store.checkAuth();
             }
        }
        return response;
    };

    return {
        ...store,
        login,
        register
    };
};
