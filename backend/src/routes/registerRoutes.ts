/// <reference path="../types/fastify-rewrite.d.ts" />
import { FastifyInstance } from "fastify";
import authRoutes from "./authRoutes";
import gymRoutes from "./gymRoutes";
import equipmentRoutes from "./equipmentRoutes";
import exerciseRoutes from "./exerciseRoutes";
import muscleRoutes from "./muscleRoutes";
import challengeRoutes from "./challengeRoutes";
import participantRoutes from "./participantRoutes";
import trainingSessionRoutes from "./trainingSessionRoutes";
import badgeRoutes from "./badgeRoutes";
import userBadgeRoutes from "./userBadgeRoutes";

export async function registerRoutes(app: FastifyInstance): Promise<void> {
    // Register other route files here
    app.register(authRoutes, { prefix: '/api/auth' });
    app.register(gymRoutes, { prefix: '/api/gyms' });
    app.register(equipmentRoutes, { prefix: '/api/equipments' });
    app.register(exerciseRoutes, { prefix: '/api/exercises' });
    app.register(muscleRoutes, { prefix: '/api/muscles' });
    app.register(challengeRoutes, { prefix: '/api/challenges' });
    app.register(participantRoutes, { prefix: '/api/challenges' });
    app.register(trainingSessionRoutes, { prefix: '/api/training-sessions' });
    app.register(badgeRoutes, { prefix: '/api/badges' });
    app.register(userBadgeRoutes, { prefix: '/api/users' });
}
