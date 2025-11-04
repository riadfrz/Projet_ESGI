import 'fastify';

declare module 'fastify' {
    interface FastifyRequest {
        cookies: {
            [cookieName: string]: string | undefined;
        };
    }
}
