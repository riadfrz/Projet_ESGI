import { api } from '@/api/interceptor';
import { ApiResponse } from '@/types';
import { 
    BadgeDto, 
    CreateBadgeDto, 
    UpdateBadgeDto, 
    QueryBadgesDto,
    PaginatedResponseDto 
} from '@shared/dto';

class BadgeService {
    public async getAllBadges(query?: QueryBadgesDto): Promise<ApiResponse<PaginatedResponseDto<BadgeDto>>> {
        const queryString = query ? '?' + new URLSearchParams(query as any).toString() : '';
        return api.fetchRequest(`/api/badges${queryString}`, 'GET');
    }

    public async getBadgeById(id: string): Promise<ApiResponse<BadgeDto>> {
        return api.fetchRequest(`/api/badges/${id}`, 'GET');
    }

    public async createBadge(data: CreateBadgeDto): Promise<ApiResponse<BadgeDto>> {
        return api.fetchRequest('/api/badges', 'POST', data, true);
    }

    public async updateBadge(id: string, data: UpdateBadgeDto): Promise<ApiResponse<BadgeDto>> {
        return api.fetchRequest(`/api/badges/${id}`, 'PUT', data, true);
    }

    public async deleteBadge(id: string): Promise<ApiResponse<void>> {
        return api.fetchRequest(`/api/badges/${id}`, 'DELETE', null, true);
    }

    public async checkBadges(): Promise<ApiResponse<any>> {
        return api.fetchRequest('/api/badges/check', 'POST', null, true);
    }
}

export const badgeService = new BadgeService();
