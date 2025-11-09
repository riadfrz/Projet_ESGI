import { FastifyInstance } from "fastify";
import { leaderboardController } from "@/features/leaderboard";
import { createSwaggerSchema } from "@/utils/swaggerUtils";

export default async function leaderboardRoutes(app: FastifyInstance) {
    // Get global leaderboard (Public)
    app.get('/', {
        schema: createSwaggerSchema(
            "Classement global par points de badges",
            [
                { message: 'Classement global récupéré', data: {}, status: 200 },
            ],
            null,
            false,
            null,
            ['Leaderboard']
        ),
        handler: leaderboardController.getGlobalLeaderboard,
    });

    // Get challenge leaderboard (Public)
    app.get('/challenges', {
        schema: createSwaggerSchema(
            "Classement par défis complétés",
            [
                { message: 'Classement par défis complétés récupéré', data: {}, status: 200 },
            ],
            null,
            false,
            null,
            ['Leaderboard']
        ),
        handler: leaderboardController.getChallengeLeaderboard,
    });

    // Get calorie leaderboard (Public)
    app.get('/calories', {
        schema: createSwaggerSchema(
            "Classement par calories brûlées",
            [
                { message: 'Classement par calories brûlées récupéré', data: {}, status: 200 },
            ],
            null,
            false,
            null,
            ['Leaderboard']
        ),
        handler: leaderboardController.getCalorieLeaderboard,
    });

    // Get monthly leaderboard (Public)
    app.get('/monthly', {
        schema: createSwaggerSchema(
            "Classement du mois par nombre de sessions",
            [
                { message: 'Classement du mois récupéré', data: {}, status: 200 },
            ],
            null,
            false,
            null,
            ['Leaderboard']
        ),
        handler: leaderboardController.getMonthlyLeaderboard,
    });
}
