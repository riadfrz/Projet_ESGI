import { auth } from "@/config/auth";
import { FastifyRequest } from "fastify";

class AuthService {
    constructor() { }

    /**
     * Handle Better Auth request (converts Fastify to Web API Request)
     */
    async handleBetterAuthRequest(request: FastifyRequest): Promise<Response> {
        const url = new URL(
            request.url,
            process.env.BETTER_AUTH_URL || 'http://localhost:3000'
        );

        const webRequest = new Request(url, {
            method: request.method,
            headers: request.headers as any,
            body: ['POST', 'PUT', 'PATCH'].includes(request.method)
                ? JSON.stringify(request.body)
                : undefined,
        });

        return auth.handler(webRequest);
    }
}

export const authService = new AuthService();
