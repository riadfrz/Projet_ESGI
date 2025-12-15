import { api } from '@/api/interceptor';
import { ApiResponse } from '@/types';
import { 
    CreateGymDto, 
    UpdateGymDto, 
    QueryGymsDto, 
    GymDto, 
    UpdateGymStatusDto,
    PaginatedResponse 
} from '@shared/dto';

class GymService {
    public async getAllGyms(query?: QueryGymsDto): Promise<ApiResponse<PaginatedResponse<GymDto>>> {
        const queryString = query ? '?' + new URLSearchParams(query as any).toString() : '';
        return api.fetchRequest(`/api/gyms${queryString}`, 'GET');
    }

    public async getGymById(id: string): Promise<ApiResponse<GymDto>> {
        return api.fetchRequest(`/api/gyms/${id}`, 'GET');
    }

    public async createGym(data: CreateGymDto): Promise<ApiResponse<GymDto>> {
        return api.fetchRequest('/api/gyms', 'POST', data, true);
    }

    public async updateGym(id: string, data: UpdateGymDto): Promise<ApiResponse<GymDto>> {
        return api.fetchRequest(`/api/gyms/${id}`, 'PUT', data, true);
    }

    public async updateGymStatus(id: string, data: UpdateGymStatusDto): Promise<ApiResponse<GymDto>> {
        return api.fetchRequest(`/api/gyms/${id}/status`, 'PATCH', data, true);
    }

    public async deleteGym(id: string): Promise<ApiResponse<void>> {
        return api.fetchRequest(`/api/gyms/${id}`, 'DELETE', null, true);
    }
}

export const gymService = new GymService();
