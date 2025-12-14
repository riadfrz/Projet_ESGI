import { api } from '@/api/interceptor';
import { ApiResponse } from '@/types';
import { 
    UserDto, 
    UpdateUserDto, 
    QueryUsersDto,
    UserBadgeDto,
    UserStatsDto
} from '@shared/dto';

class UserService {
    // Get current user profile
    public async getProfile(): Promise<ApiResponse<UserDto>> {
        return api.fetchRequest('/api/auth/me', 'GET', null, true);
    }

    // Update user profile
    public async updateProfile(data: UpdateUserDto): Promise<ApiResponse<UserDto>> {
        return api.fetchRequest('/api/users/me', 'PATCH', data, true);
    }

    // Get user badges
    public async getMyBadges(): Promise<ApiResponse<UserBadgeDto[]>> {
        return api.fetchRequest('/api/users/me/badges', 'GET', null, true);
    }

    // Get user stats (history)
    public async getMyStats(): Promise<ApiResponse<UserStatsDto>> {
        return api.fetchRequest('/api/training-sessions/stats', 'GET', null, true);
    }

    // ADMIN: Get all users
    public async getAllUsers(query?: QueryUsersDto): Promise<ApiResponse<UserDto[]>> {
        const queryString = query ? '?' + new URLSearchParams(query as any).toString() : '';
        return api.fetchRequest(`/api/users${queryString}`, 'GET', null, true);
    }

    // ADMIN: Update user
    public async updateUser(id: string, data: UpdateUserDto): Promise<ApiResponse<UserDto>> {
        return api.fetchRequest(`/api/users/${id}`, 'PATCH', data, true);
    }

    // ADMIN: Delete user
    public async deleteUser(id: string): Promise<ApiResponse<void>> {
        return api.fetchRequest(`/api/users/${id}`, 'DELETE', null, true);
    }
}

export const userService = new UserService();
