import { api } from '@/api/interceptor';
import { ApiResponse } from '@/types';
import { 
    CreateChallengeDto, 
    UpdateChallengeDto, 
    QueryChallengesDto, 
    ChallengeDto, 
    ChallengeWithDetailsDto,
    InviteUserDto,
    UpdateParticipantStatusDto,
    PaginatedResponseDto
} from '@shared/dto';

class ChallengeService {
    public async getAllChallenges(query?: QueryChallengesDto): Promise<ApiResponse<PaginatedResponseDto<ChallengeDto>>> {
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
        return api.fetchRequest(`/api/challenges/${challengeId}/join`, 'POST', null, true);
    }

    public async leaveChallenge(challengeId: string): Promise<ApiResponse<void>> {
        return api.fetchRequest(`/api/challenges/${challengeId}/leave`, 'DELETE', null, true);
    }
}

export const challengeService = new ChallengeService();
