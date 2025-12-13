import { authRepository, authService } from "@/features/auth";
import { userRepository } from "@/features/user";
import { authTransform } from "@/features/auth/authTransform";
import { ApiResponse } from "@/types";
import { asyncHandler } from "@/utils";
import { jsonResponse, authResponse } from "@/utils/jsonResponse";
import { logger } from "@/utils/logger";
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import {
    CurrentUserResponseDto,
    GoogleProfileDto,
    MessageResponseDto,
    SessionResponseDto,
    UserDto,
    IdParams,
    idSchema,
    RegisterDto,
    LoginDto,
    registerSchema,
    loginSchema,
    SuccessAuthResponseDto
} from "@shared/dto";
import { AuthProviderEnum, CivilityEnum } from "@shared/enums";

class AuthController {
    private logger = logger.child({
        module: '[AUTH][CONTROLLER]',
    });

    /**
     * Get current authenticated user
     */
    public getCurrentUser = asyncHandler<unknown, unknown, unknown, UserDto>({
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<UserDto | void> | void> => {
            const sessionToken = request.cookies.session; // Better Auth uses cookies

            if (!sessionToken) {
                return jsonResponse(reply, 'Non authentifié', undefined, 401);
            }

            const user = await authRepository.getCurrentUser(sessionToken);

            if (!user) {
                return jsonResponse(reply, 'Session invalide', undefined, 401);
            }

            const userDto = authTransform.toUserDto(user);
            return jsonResponse(reply, 'Utilisateur récupéré', userDto, 200);
        },
    });

    /**
     * Get user sessions
     */
    public getMySessions = asyncHandler<unknown, unknown, unknown, SessionResponseDto[]>({
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<SessionResponseDto[] | void> | void> => {
            const sessionToken = request.cookies.session;

            if (!sessionToken) {
                return jsonResponse(reply, 'Non authentifié', undefined, 401);
            }

            const user = await authRepository.getCurrentUser(sessionToken);

            if (!user) {
                return jsonResponse(reply, 'Session invalide', undefined, 401);
            }

            const sessions = await authRepository.getUserSessions(user.id);
            const sessionDtos = authTransform.toSessionDtoArray(sessions, false); // Don't include tokens for security

            return jsonResponse(reply, 'Sessions récupérées', sessionDtos, 200);
        },
    });

    /**
     * Revoke a session
     */
    public revokeSession = asyncHandler<unknown, unknown, IdParams, MessageResponseDto>({
        paramsSchema: idSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<MessageResponseDto | void> | void> => {
            const { id } = request.params;

            await authRepository.revokeSession(id);

            const response: MessageResponseDto = { message: 'Session révoquée' };
            return jsonResponse(reply, 'Session révoquée', response, 200);
        },
    });

    /**
     * Register a new user
     */
    public register = asyncHandler<RegisterDto, unknown, unknown, SuccessAuthResponseDto>({
        bodySchema: registerSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<SuccessAuthResponseDto | void> | void> => {
            const existingUser = await userRepository.findByEmail(request.body.email);

            if (existingUser) {
                return jsonResponse(reply, 'Utilisateur déjà existant', undefined, 409);
            }

            const hashedPassword = await bcrypt.hash(request.body.password, 10);

            // Extract data from request body, omitting confirmPassword and other non-user fields
            const {
                confirmPassword: _confirmPassword,
                terms: _terms,
                privacy: _privacy,
                rememberMe: _rememberMe,
                ...userData
            } = request.body;

            const createdUser = await userRepository.create({
                email: userData.email,
                password: hashedPassword,
                firstName: userData.firstName,
                lastName: userData.lastName,
                phone: userData.phone || null,
                civility: (userData.civility as any) || null,
                birthDate: userData.birthDate
                    ? typeof userData.birthDate === 'string'
                        ? new Date(userData.birthDate)
                        : userData.birthDate
                    : null,
            });

            // Generate JWT tokens
            const tokens = await authService.generateTokens(createdUser, request);

            if (!tokens?.accessToken?.token || !tokens?.refreshToken?.token) {
                return jsonResponse(reply, 'Erreur lors de la génération des tokens', undefined, 500);
            }

            return authResponse(reply, tokens.accessToken.token, tokens.refreshToken.token);
        },
    });

    /**
     * Login user
     */
    public login = asyncHandler<LoginDto, unknown, unknown, SuccessAuthResponseDto>({
        bodySchema: loginSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<SuccessAuthResponseDto | void> | void> => {
            const user = await userRepository.findByEmail(request.body.email);

            if (!user) {
                return jsonResponse(reply, 'Identifiants invalides', undefined, 401);
            }

            // Validate password
            const isPasswordValid = await bcrypt.compare(request.body.password, user.password);

            if (!isPasswordValid) {
                return jsonResponse(reply, 'Identifiants invalides', undefined, 401);
            }

            // Generate JWT tokens
            const tokens = await authService.generateTokens(user, request);

            if (!tokens?.accessToken?.token || !tokens?.refreshToken?.token) {
                return jsonResponse(reply, 'Erreur lors de la génération des tokens', undefined, 500);
            }

            this.logger.info(
                {
                    msg: 'Utilisateur connecté',
                    action: 'login',
                    status: 'success',
                    timestamp: Date.now(),
                },
                'Utilisateur connecté'
            );

            return authResponse(reply, tokens.accessToken.token, tokens.refreshToken.token);
        },
    });

    /**
     * Logout - revokes current session
     */
    public logout = asyncHandler<unknown, unknown, unknown, MessageResponseDto>({
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<MessageResponseDto | void> | void> => {
            const sessionToken = request.cookies.session;

            if (!sessionToken) {
                return jsonResponse(reply, 'No active session', undefined, 401);
            }

            // Find and delete session
            await authRepository.revokeSessionByToken(sessionToken);

            // Clear cookie
            reply.clearCookie('session', { path: '/' });

            const response: MessageResponseDto = { message: 'Logged out successfully' };
            return jsonResponse(reply, 'Logged out successfully', response, 200);
        },
    });

    /**
     * Google OAuth callback handler
     */
    public handleGoogleCallback = asyncHandler<unknown, unknown, unknown, void>({
        logger: this.logger,
        handler: async (request: any, reply): Promise<ApiResponse<void> | void> => {
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
                    return jsonResponse(reply, 'Failed to authenticate with Google', undefined, 500);
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

                // Generate secure random session token (64 characters)
                const sessionToken = crypto.randomBytes(32).toString('hex');

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
