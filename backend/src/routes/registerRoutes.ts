/// <reference path="../types/fastify-rewrite.d.ts" />
import { FastifyInstance } from "fastify";
import authRoutes from "./authRoutes";

export async function registerRoutes(app: FastifyInstance): Promise<void> {
    // Register other route files here
    app.register(authRoutes, { prefix: '/api/auth' });
}
