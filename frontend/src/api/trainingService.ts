import { api } from '@/api/interceptor';
import { ApiResponse } from '@/types';
import { 
    CreateTrainingSessionDto, 
    UpdateTrainingSessionDto, 
    QueryTrainingSessionsDto, 
    TrainingSessionDto,
    TrainingSessionWithDetailsDto,
    TrainingStatsDto
} from '@shared/dto';

class TrainingService {
    public async getAllSessions(query?: QueryTrainingSessionsDto): Promise<ApiResponse<TrainingSessionDto[]>> {
        const queryString = query ? '?' + new URLSearchParams(query as any).toString() : '';
        return api.fetchRequest(`/api/training-sessions${queryString}`, 'GET', null, true);
    }

    public async getStats(): Promise<ApiResponse<TrainingStatsDto>> {
        return api.fetchRequest('/api/training-sessions/stats', 'GET', null, true);
    }

    public async getSessionById(id: string): Promise<ApiResponse<TrainingSessionWithDetailsDto>> {
        return api.fetchRequest(`/api/training-sessions/${id}`, 'GET', null, true);
    }

    public async createSession(data: CreateTrainingSessionDto): Promise<ApiResponse<TrainingSessionDto>> {
        return api.fetchRequest('/api/training-sessions', 'POST', data, true);
    }

    public async updateSession(id: string, data: UpdateTrainingSessionDto): Promise<ApiResponse<TrainingSessionDto>> {
        return api.fetchRequest(`/api/training-sessions/${id}`, 'PUT', data, true);
    }

    public async deleteSession(id: string): Promise<ApiResponse<void>> {
        return api.fetchRequest(`/api/training-sessions/${id}`, 'DELETE', null, true);
    }
}

export const trainingService = new TrainingService();
