import { api } from '@/api/interceptor';
import { ApiResponse } from '@/types';
import { 
    GlobalLeaderboardEntryDto,
    ChallengeLeaderboardEntryDto,
    CalorieLeaderboardEntryDto,
    MonthlyLeaderboardEntryDto
} from '@shared/dto';

class LeaderboardService {
    public async getGlobalLeaderboard(): Promise<ApiResponse<GlobalLeaderboardEntryDto[]>> {
        return api.fetchRequest('/api/leaderboard', 'GET');
    }

    public async getChallengeLeaderboard(): Promise<ApiResponse<ChallengeLeaderboardEntryDto[]>> {
        return api.fetchRequest('/api/leaderboard/challenges', 'GET');
    }

    public async getCalorieLeaderboard(): Promise<ApiResponse<CalorieLeaderboardEntryDto[]>> {
        return api.fetchRequest('/api/leaderboard/calories', 'GET');
    }

    public async getMonthlyLeaderboard(): Promise<ApiResponse<MonthlyLeaderboardEntryDto[]>> {
        return api.fetchRequest('/api/leaderboard/monthly', 'GET');
    }
}

export const leaderboardService = new LeaderboardService();
