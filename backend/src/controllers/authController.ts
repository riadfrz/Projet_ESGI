import { authRepository } from "@/repositories";
import { asyncHandler } from "@/utils";
import { jsonResponse } from "@/utils/jsonResponse";
import { logger } from "@/utils/logger";
import jwt from 'jsonwebtoken';
import { GoogleProfileDto } from "@shared/dto/authDto";
import { AuthProviderEnum } from "@shared/enums";

class AuthController {
    private logger = logger.child({
        module: '[AUTH][CONTROLLER]',
    });

    /**
     * Get current authenticated user
     */
    public getCurrentUser = asyncHandler({
        logger: this.logger,
        handler: async (request, reply) => {
            const sessionToken = request.cookies.session; // Better Auth uses cookies

            if (!sessionToken) {
                return jsonResponse(reply, 'Non authentifié', null, 401);
            }

            const user = await authRepository.getCurrentUser(sessionToken);

            if (!user) {
                return jsonResponse(reply, 'Session invalide', null, 401);
            }

            return jsonResponse(reply, 'Utilisateur récupéré', user, 200);
        },
    });

    /**
     * Get user sessions
     */
    public getMySessions = asyncHandler({
        logger: this.logger,
        handler: async (request, reply) => {
            const sessionToken = request.cookies.session;

            if (!sessionToken) {
                return jsonResponse(reply, 'Non authentifié', null, 401);
            }

            const user = await authRepository.getCurrentUser(sessionToken);

            if (!user) {
                return jsonResponse(reply, 'Session invalide', null, 401);
            }

            const sessions = await authRepository.getUserSessions(user.id);

            return jsonResponse(reply, 'Sessions récupérées', sessions, 200);
        },
    });

    /**
     * Revoke a session
     */
    public revokeSession = asyncHandler({
        logger: this.logger,
        handler: async (request, reply) => {
            const { sessionId } = request.params as { sessionId: string };

            await authRepository.revokeSession(sessionId);

            return jsonResponse(reply, 'Session révoquée', null, 200);
        },
    });

    /**
     * Google OAuth callback handler
     */
    public handleGoogleCallback = asyncHandler({
        logger: this.logger,
        handler: async (request: any, reply) => {
            try {
                // Exchange authorization code for access token
                const { token } = await request.server.google.getAccessTokenFromAuthorizationCodeFlow(request);

                // Fetch user profile from Google
                const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                    headers: {
                        Authorization: `Bearer ${token.access_token}`,
                    },
                });

                if (!profileResponse.ok) {
                    this.logger.error('Failed to fetch Google profile');
                    return jsonResponse(reply, 'Failed to authenticate with Google', null, 500);
                }

                const profile = await profileResponse.json() as GoogleProfileDto;

                // Split the name into firstName and lastName
                const nameParts = profile.name.split(' ');
                const firstName = nameParts[0] || '';
                const lastName = nameParts.slice(1).join(' ') || '';

                // Upsert user in database using repository
                const user = await authRepository.upsertUserFromOAuth({
                    email: profile.email,
                    firstName,
                    lastName,
                });

                // Upsert Google account for the user using repository
                await authRepository.upsertOAuthAccount({
                    userId: user.id,
                    accountId: profile.id,
                    providerId: 'google',
                    accessToken: token.access_token,
                    refreshToken: token.refresh_token,
                    idToken: token.id_token,
                    accessTokenExpiresAt: token.expires_in
                        ? new Date(Date.now() + token.expires_in * 1000)
                        : null,
                    scope: token.scope,
                });

                // Create JWT session token
                const jwtSecret = process.env.JWT_SECRET || process.env.BETTER_AUTH_SECRET || 'fallback-secret';
                const sessionToken = jwt.sign(
                    {
                        userId: user.id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                    },
                    jwtSecret,
                    { expiresIn: '7d' }
                );

                // Create session in database using repository
                await authRepository.createSession({
                    userId: user.id,
                    token: sessionToken,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                    ipAddress: request.ip,
                    userAgent: request.headers['user-agent'],
                    authProvider: AuthProviderEnum.GOOGLE,
                });

                // Set secure HTTP-only cookie
                reply.setCookie('session', sessionToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
                    path: '/',
                });

                // Redirect to frontend
                const redirectUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
                return reply.redirect(`${redirectUrl}/auth/callback?success=true`);

            } catch (error) {
                this.logger.error({ error }, 'Google OAuth callback error');
                const redirectUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
                return reply.redirect(`${redirectUrl}/auth/callback?error=oauth_failed`);
            }
        },
    });
}

export const authController = new AuthController();
