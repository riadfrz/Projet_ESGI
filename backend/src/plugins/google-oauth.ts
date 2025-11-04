import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import oauthPlugin from '@fastify/oauth2';

async function googleOAuthPlugin(app: FastifyInstance) {
    app.register(oauthPlugin, {
        name: 'google',
        scope: ['profile', 'email'],
        credentials: {
            client: {
                id: process.env.GOOGLE_CLIENT_ID as string,
                secret: process.env.GOOGLE_CLIENT_SECRET as string,
            },
            auth: oauthPlugin.GOOGLE_CONFIGURATION,
        },
        startRedirectPath: '/api/auth/google',
        callbackUri: 'http://localhost:3000/api/auth/google/callback',
    });
}

export default fp(googleOAuthPlugin);
