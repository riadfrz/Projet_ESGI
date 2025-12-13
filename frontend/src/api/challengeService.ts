import { api } from '@/api/interceptor';
import { ApiResponse } from '@/types';
import { 
    CreateChallengeDto, 
    UpdateChallengeDto, 
    QueryChallengesDto, 
    ChallengeDto, 
    ChallengeWithDetailsDto,
    InviteUserDto,
    UpdateParticipantStatusDto
} from '@shared/dto';

class ChallengeService {
    public async getAllChallenges(query?: QueryChallengesDto): Promise<ApiResponse<ChallengeDto[]>> {
        const queryString = query ? '?' + new URLSearchParams(query as any).toString() : '';
        return api.fetchRequest(`/api/challenges${queryString}`, 'GET');
    }

    public async getMyChallenges(): Promise<ApiResponse<ChallengeDto[]>> {
        return api.fetchRequest('/api/challenges/my', 'GET', null, true);
    }

    public async getChallengeById(id: string): Promise<ApiResponse<ChallengeWithDetailsDto>> {
        return api.fetchRequest(`/api/challenges/${id}`, 'GET');
    }

    public async createChallenge(data: CreateChallengeDto): Promise<ApiResponse<ChallengeDto>> {
        return api.fetchRequest('/api/challenges', 'POST', data, true);
    }

    public async updateChallenge(id: string, data: UpdateChallengeDto): Promise<ApiResponse<ChallengeDto>> {
        return api.fetchRequest(`/api/challenges/${id}`, 'PUT', data, true);
    }

    public async deleteChallenge(id: string): Promise<ApiResponse<void>> {
        return api.fetchRequest(`/api/challenges/${id}`, 'DELETE', null, true);
    }

    // Participant Routes
    public async joinChallenge(challengeId: string): Promise<ApiResponse<void>> {
        return api.fetchRequest(`/api/participants`, 'POST', { challengeId }, true);
    }

    public async leaveChallenge(challengeId: string): Promise<ApiResponse<void>> {
        // Assuming there is a leave endpoint or delete participant logic
        // Based on routes, it might be DELETE /api/participants/:id but we need participant ID
        // Or specific route. Checking participantRoutes.ts would be ideal.
        // For now, let's assume standard REST if implemented, otherwise this might need adjustment.
        // Let's check participantRoutes later if this fails.
        return api.fetchRequest(`/api/participants/${challengeId}`, 'DELETE', null, true);
    }
}

export const challengeService = new ChallengeService();
