import { api } from '@/api/interceptor';
import { ApiResponse } from '@/types';
import { 
    MuscleDto, 
    CreateMuscleDto, 
    UpdateMuscleDto, 
    QueryMusclesDto,
    PaginatedResponse
} from '@shared/dto';

class MuscleService {
    public async getAllMuscles(query?: QueryMusclesDto): Promise<ApiResponse<PaginatedResponse<MuscleDto>>> {
        const queryString = query ? '?' + new URLSearchParams(query as any).toString() : '';
        return api.fetchRequest(`/api/muscles${queryString}`, 'GET');
    }

    public async createMuscle(data: CreateMuscleDto): Promise<ApiResponse<MuscleDto>> {
        return api.fetchRequest('/api/muscles', 'POST', data, true);
    }

    public async updateMuscle(id: string, data: UpdateMuscleDto): Promise<ApiResponse<MuscleDto>> {
        return api.fetchRequest(`/api/muscles/${id}`, 'PUT', data, true);
    }

    public async deleteMuscle(id: string): Promise<ApiResponse<void>> {
        return api.fetchRequest(`/api/muscles/${id}`, 'DELETE', null, true);
    }
}

export const muscleService = new MuscleService();
