/// <reference path="../types/fastify-rewrite.d.ts" />
import { FastifyInstance } from "fastify";
import authRoutes from "./authRoutes";
import gymRoutes from "./gymRoutes";
import equipmentRoutes from "./equipmentRoutes";

export async function registerRoutes(app: FastifyInstance): Promise<void> {
    // Register other route files here
    app.register(authRoutes, { prefix: '/api/auth' });
    app.register(gymRoutes, { prefix: '/api/gyms' });
    app.register(equipmentRoutes, { prefix: '/api/equipments' });
}
