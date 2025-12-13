import { api } from '@/api/interceptor';
import { ApiResponse } from '@/types';
import { 
    CreateExerciseDto, 
    UpdateExerciseDto, 
    QueryExercisesDto, 
    ExerciseDto,
    ExerciseWithMusclesDto
} from '@shared/dto';

class ExerciseService {
    public async getAllExercises(query?: QueryExercisesDto): Promise<ApiResponse<ExerciseDto[]>> {
        const queryString = query ? '?' + new URLSearchParams(query as any).toString() : '';
        return api.fetchRequest(`/api/exercises${queryString}`, 'GET');
    }

    public async getExerciseById(id: string): Promise<ApiResponse<ExerciseWithMusclesDto>> {
        return api.fetchRequest(`/api/exercises/${id}`, 'GET');
    }

    public async createExercise(data: CreateExerciseDto): Promise<ApiResponse<ExerciseDto>> {
        return api.fetchRequest('/api/exercises', 'POST', data, true);
    }

    public async updateExercise(id: string, data: UpdateExerciseDto): Promise<ApiResponse<ExerciseDto>> {
        return api.fetchRequest(`/api/exercises/${id}`, 'PUT', data, true);
    }

    public async deleteExercise(id: string): Promise<ApiResponse<void>> {
        return api.fetchRequest(`/api/exercises/${id}`, 'DELETE', null, true);
    }
}

export const exerciseService = new ExerciseService();
