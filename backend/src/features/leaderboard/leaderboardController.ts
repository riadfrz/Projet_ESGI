import { asyncHandler } from '@/utils';
import { jsonResponse } from '@/utils/jsonResponse';
import { leaderboardRepository } from './leaderboardRepository';
import { leaderboardTransform } from './leaderboardTransform';
import {
    QueryLeaderboardDto,
    GlobalLeaderboardEntryDto,
    ChallengeLeaderboardEntryDto,
    CalorieLeaderboardEntryDto,
    MonthlyLeaderboardEntryDto,
    UserStatsDto,
    IdParams,
    queryLeaderboardSchema,
    idSchema,
} from '@shared/dto';

class LeaderboardController {
    /**
     * Get global leaderboard (by badge points)
     * GET /api/leaderboard
     */
    getGlobalLeaderboard = asyncHandler<unknown, QueryLeaderboardDto, unknown, GlobalLeaderboardEntryDto[]>({
        querySchema: queryLeaderboardSchema,
        handler: async (request, reply) => {
            const limit = parseInt(request.query.limit || '50');
            const leaderboard = await leaderboardRepository.getGlobalLeaderboard(limit);
            const leaderboardDtos = leaderboard.map(entry =>
                leaderboardTransform.toGlobalLeaderboardEntry(entry)
            );

            return jsonResponse(reply, 'Classement global récupéré', leaderboardDtos, 200);
        },
    });

    /**
     * Get challenge leaderboard (by challenges completed)
     * GET /api/leaderboard/challenges
     */
    getChallengeLeaderboard = asyncHandler<unknown, QueryLeaderboardDto, unknown, ChallengeLeaderboardEntryDto[]>({
        querySchema: queryLeaderboardSchema,
        handler: async (request, reply) => {
            const limit = parseInt(request.query.limit || '50');
            const leaderboard = await leaderboardRepository.getChallengeLeaderboard(limit);
            const leaderboardDtos = leaderboard.map(entry =>
                leaderboardTransform.toChallengeLeaderboardEntry(entry)
            );

            return jsonResponse(reply, 'Classement par défis complétés récupéré', leaderboardDtos, 200);
        },
    });

    /**
     * Get calorie leaderboard (by calories burned)
     * GET /api/leaderboard/calories
     */
    getCalorieLeaderboard = asyncHandler<unknown, QueryLeaderboardDto, unknown, CalorieLeaderboardEntryDto[]>({
        querySchema: queryLeaderboardSchema,
        handler: async (request, reply) => {
            const limit = parseInt(request.query.limit || '50');
            const leaderboard = await leaderboardRepository.getCalorieLeaderboard(limit);
            const leaderboardDtos = leaderboard.map(entry =>
                leaderboardTransform.toCalorieLeaderboardEntry(entry)
            );

            return jsonResponse(reply, 'Classement par calories brûlées récupéré', leaderboardDtos, 200);
        },
    });

    /**
     * Get monthly leaderboard (by sessions this month)
     * GET /api/leaderboard/monthly
     */
    getMonthlyLeaderboard = asyncHandler<unknown, QueryLeaderboardDto, unknown, MonthlyLeaderboardEntryDto[]>({
        querySchema: queryLeaderboardSchema,
        handler: async (request, reply) => {
            const limit = parseInt(request.query.limit || '50');
            const { month, year } = request.query;
            
            const leaderboard = await leaderboardRepository.getMonthlyLeaderboard(month, year, limit);
            const leaderboardDtos = leaderboard.map(entry =>
                leaderboardTransform.toMonthlyLeaderboardEntry(entry)
            );

            return jsonResponse(reply, 'Classement du mois récupéré', leaderboardDtos, 200);
        },
    });

    /**
     * Get user stats
     * GET /api/users/:id/stats
     */
    getUserStats = asyncHandler<unknown, unknown, IdParams, UserStatsDto>({
        paramsSchema: idSchema,
        handler: async (request, reply) => {
            const userId = request.params.id;
            const stats = await leaderboardRepository.getUserStats(userId);

            if (!stats) {
                return jsonResponse(reply, 'Utilisateur introuvable', undefined, 404);
            }

            const statsDto = leaderboardTransform.toUserStatsDto(stats);
            return jsonResponse(reply, 'Statistiques de l\'utilisateur récupérées', statsDto, 200);
        },
    });
}

export const leaderboardController = new LeaderboardController();
