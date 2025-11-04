```
import { isAuthenticated } from '@/middleware/auth';
import { createSwaggerSchema } from '@/utils/swaggerUtils';

import {
    loginSchema,
    querySessionsSchema,
    registerSchema,
    requestPasswordResetSchema,
    resetPasswordSchema,
    tokenSchema,
    updatePasswordSchema,
} from '@shared/dto';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';

import { authController } from '@/controllers/authController';

export async function authRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
    // Créer un nouvel utilisateur
    fastify.post('/register', {
        schema: createSwaggerSchema(
            'Crée un nouvel utilisateur.',
            [
                { message: 'Utilisateur créé avec succès', data: {}, status: 200 },
                { message: 'Utilisateur déjà existant', data: {}, status: 400 },
                { message: "Erreur lors de la création de l'utilisateur", data: {}, status: 500 },
            ],
            registerSchema.innerType(),
            false,
            null,
            ['Auth']
        ),
        handler: authController.createUser,
    });

    // Récupérer l'utilisateur via le token
    fastify.get('/me', {
        schema: createSwaggerSchema(
            "Récupère l'utilisateur via le token.",
            [
                { message: 'Utilisateur récupéré avec succès', data: {}, status: 200 },
                { message: 'Token invalide', data: {}, status: 401 },
            ],
            null,
            true,
            null,
            ['Auth']
        ),
        preHandler: [isAuthenticated],
        handler: authController.getCurrentUser,
    });

    fastify.post('/update-password', {
        schema: createSwaggerSchema(
            "Met à jour le mot de passe de l'utilisateur.",
            [
                { message: 'Mot de passe mis à jour avec succès', data: {}, status: 200 },
                { message: 'Mot de passe incorrect', data: {}, status: 401 },
                { message: 'Erreur lors de la mise à jour du mot de passe', data: {}, status: 500 },
            ],
            updatePasswordSchema,
            false,
            null,
            ['Auth']
        ),
        preHandler: [isAuthenticated],
        handler: authController.updatePassword,
    });

    fastify.post('/refresh_token', {
        schema: createSwaggerSchema(
            "Refresh l'access token de l'utilisateur.",
            [
                { message: 'Token rafraîchi avec succès', data: [], status: 200 },
                { message: 'Token invalide', data: [], status: 401 },
            ],
            tokenSchema,
            false,
            null,
            ['Auth']
        ),
        handler: authController.refreshToken,
    });
    // Login
    fastify.post('/login', {
        schema: createSwaggerSchema(
            "Connexion à l'application.",
            [
                {
                    message: 'Connexion réussie',
                    data: {
                        accessToken: 'string',
                        refreshToken: 'string',
                    },
                    status: 200,
                },
                { message: 'Identifiants invalides', data: {}, status: 401 },
                { message: 'Erreur lors de la connexion', data: {}, status: 500 },
            ],
            loginSchema,
            false,
            null,
            ['Auth']
        ),
        handler: authController.login,
    });

    // Route pour demander une réinitialisation de mot de passe
    fastify.post('/forgot-password', {
        schema: createSwaggerSchema(
            'Demande une réinitialisation de mot de passe.',
            [
                { message: 'Réinitialisation de mot de passe demandée', data: {}, status: 200 },
                { message: 'Erreur de validation', data: {}, status: 400 },
                {
                    message: 'Erreur lors de la demande de réinitialisation de mot de passe',
                    data: {},
                    status: 500,
                },
            ],
            requestPasswordResetSchema,
            false,
            null,
            ['Auth']
        ),
        handler: authController.requestPasswordReset,
    });

    // Route pour réinitialiser le mot de passe
    fastify.post('/reset-password', {
        schema: createSwaggerSchema(
            'Réinitialise le mot de passe.',
            [
                { message: 'Mot de passe réinitialisé avec succès', data: {}, status: 200 },
                { message: 'Erreur de validation', data: {}, status: 400 },
                {
                    message: 'Erreur lors de la réinitialisation du mot de passe',
                    data: {},
                    status: 500,
                },
            ],
            resetPasswordSchema.innerType(),
            false,
            null,
            ['Auth']
        ),
        handler: authController.resetPassword,
    });

    fastify.get('/sessions', {
        schema: createSwaggerSchema(
            "Récupère les sessions de l'utilisateur.",
            [
                { message: 'Sessions récupérées avec succès', data: {}, status: 200 },
                { message: 'Utilisateur non autorisé', data: {}, status: 403 },
                { message: 'Erreur lors de la récupération des sessions', data: {}, status: 500 },
            ],
            null,
            true,
            querySessionsSchema,
            ['Auth']
        ),
        preHandler: [isAuthenticated],
        handler: authController.getMySessions,
    });
}
```


```
authDto.ts
import { z } from 'zod';
import { CivilityEnum } from "../enums";
import { Serialize } from '../types/Serialize';

export const registerSchema = z
    .object({
        email: z.string().min(1, "L'email est requis").email("Format d'email invalide"),
        terms: z.coerce.boolean().refine((data) => data === true, {
            message: "Vous devez accepter les conditions d'utilisation",
            path: ['terms'],
        }),
        privacy: z.coerce.boolean().refine((data) => data === true, {
            message: 'Vous devez accepter la politique de confidentialité',
            path: ['privacy'],
        }),
        rememberMe: z.coerce.boolean().optional(),
        acceptNewsletter: z.coerce.boolean().optional(),
        password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
        confirmPassword: z.string().min(1, 'La confirmation du mot de passe est requise'),
        firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
        lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
        phone: z.string().optional().nullable(),
        civility: z.nativeEnum(CivilityEnum).optional().nullable(),
        birthDate: z.coerce.date().optional().nullable(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Les mots de passe ne correspondent pas',
        path: ['confirmPassword'],
    });
export type RegisterSchema = z.infer<typeof registerSchema>;
export type RegisterDto = Serialize<RegisterSchema>;

export const loginSchema = z.object({
    email: z.string().min(1, "L'email est requis").email("Format d'email invalide"),
    password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
    rememberMe: z.boolean().optional(),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type LoginDto = Serialize<LoginSchema>;

export const logoutSchema = z.object({
    token: z.string().min(1),
});

export type LogoutSchema = z.infer<typeof logoutSchema>;
export type LogoutDto = Serialize<LogoutSchema>;

export const requestPasswordResetSchema = z.object({
    email: z.string().email(),
});

export type RequestPasswordResetSchema = z.infer<typeof requestPasswordResetSchema>;
export type RequestPasswordResetDto = Serialize<RequestPasswordResetSchema>;

export const resetPasswordSchema = z
    .object({
        currentPassword: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
        newPassword: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
        confirmPassword: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
        token: z.string().min(1),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Les mots de passe ne correspondent pas',
        path: ['confirmPassword'],
    });

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
export type ResetPasswordDto = Serialize<ResetPasswordSchema>;

export const updatePasswordSchema = z.object({
    currentPassword: z
        .string()
        .min(6)
        .max(255, { message: 'Le mot de passe doit contenir au moins 6 caractères' }),
    newPassword: z
        .string()
        .min(6)
        .max(255, { message: 'Le mot de passe doit contenir au moins 6 caractères' }),
    confirmPassword: z
        .string()
        .min(6)
        .max(255, { message: 'Le mot de passe doit contenir au moins 6 caractères' }),
});

export type UpdatePasswordSchema = z.infer<typeof updatePasswordSchema>;
export type UpdatePasswordDto = Serialize<UpdatePasswordSchema>;

export const tokenSchema = z.object({
    token: z.string().min(1),
});

export type TokenSchema = z.infer<typeof tokenSchema>;
export type TokenDto = Serialize<TokenSchema>;

export const successAuthResponseSchema = z.object({
    accessToken: z.string().min(1),
    refreshToken: z.string().min(1),
});

export type SuccessAuthResponseSchema = z.infer<typeof successAuthResponseSchema>;
export type SuccessAuthResponseDto = Serialize<SuccessAuthResponseSchema>;

export const userResponseSchema = z.object({
    id: z.string().min(1),
    email: z.string().email(),
    firstName: z.string().min(2).max(255),
    lastName: z.string().min(2).max(255),
});

export type UserResponseSchema = z.infer<typeof userResponseSchema>;
export type UserResponseDto = Serialize<UserResponseSchema>;

export const querySessionsSchema = z.object({
    userId: z.string().min(1),
});

export type QuerySessionsSchema = z.infer<typeof querySessionsSchema>;
export type QuerySessionsDto = Serialize<QuerySessionsSchema>;
```

```
authController.ts
import { tokenRepository, userRepository } from '@/repositories';
import { authService, mailerService, userService } from '@/services';
import { getLocationFromIp, parseUserAgent } from '@/utils';
import { asyncHandler } from '@/utils/asyncHandler';
import { authResponse, jsonResponse } from '@/utils/jsonResponse';
import { logger } from '@/utils/logger';
import { render } from '@react-email/components';
import {
    LoginDto,
    QuerySessionsDto,
    RegisterDto,
    RequestPasswordResetDto,
    ResetPasswordDto,
    TokenDto,
    UpdatePasswordDto,
    UserDto,
    UserRole,
    UserSchema,
    loginSchema,
    querySessionsSchema,
    registerSchema,
    requestPasswordResetSchema,
    resetPasswordSchema,
    tokenSchema,
    updatePasswordSchema
} from '@shared/dto';
import { PasswordResetEmail } from '@template-emails/emails/account/password-reset';
import { FailedLoginAttempt } from '@template-emails/emails/security/failedLoginAttempt';
import { NewDeviceLogin } from '@template-emails/emails/security/newDeviceLogin';
import bcrypt from 'bcryptjs';
import { verify } from 'jsonwebtoken';

import { Role } from '@/types/userTypes';
import { CivilityEnum } from '@shared/enums';

class AuthController {
    private logger = logger.child({
        module: '[CFR][AUTH][CONTROLLER]',
    });

    constructor() { }

    public createUser = asyncHandler<RegisterDto, unknown, unknown, UserDto>({
        bodySchema: registerSchema,
        logger: this.logger,
        handler: async (request, reply) => {
            const existingUser = await userRepository.findByEmail(request.body.email);

            if (existingUser) {
                return jsonResponse(reply, 'Utilisateur déjà existant', {}, 400);
            }

            const hashedPassword = await bcrypt.hash(request.body.password, 10);

            // Extract data from request body, omitting confirmPassword
            const { confirmPassword, terms, privacy, rememberMe, ...userData } = request.body;

            const createdUser = await userRepository.create({
                ...userData,
                password: hashedPassword,
                acceptNewsletter: userData.acceptNewsletter ?? false,
                roles: ['ROLE_USER'] as Role[],
                phone: userData.phone || '',
                civility: userData.civility || CivilityEnum.Mr,
                birthDate: typeof userData.birthDate === 'string' ? userData.birthDate : new Date().toISOString(),
            });

            const tokens = await authService.generateTokens(createdUser, request);

            if (!tokens?.accessToken?.token || !tokens?.refreshToken?.token) {
                return jsonResponse(reply, 'Erreur lors de la génération des tokens', {}, 500);
            }

            return authResponse(reply, tokens?.accessToken?.token, tokens?.refreshToken?.token);
        },
    });

    public login = asyncHandler<LoginDto, unknown, unknown, TokenDto[]>({
        bodySchema: loginSchema,
        logger: this.logger,
        handler: async (request, reply) => {
            const user = await userRepository.findByEmail(request.body.email);

            if (!user) {
                return jsonResponse(reply, 'Identifiants invalides', {}, 401);
            }

            const isPasswordValid = await bcrypt.compare(request.body.password, user.password);

            const isNewDevice = await authService.isNewDevice(user, request);

            const parsedUserAgent = parseUserAgent(request.headers['user-agent'] as string);
            const location = await getLocationFromIp(request.ip);

            if (!isPasswordValid) {
                if (isNewDevice) {
                    mailerService.sendEmail(
                        user.email,
                        'Failed Login Attempt',
                        await render(
                            FailedLoginAttempt({
                                name: user.firstName,
                                attemptDate: new Date().toLocaleString(),
                                ipAddress: request.ip,
                                location:
                                    location?.city || location?.country
                                        ? `${location?.city || ''}, ${location?.region || ''}, ${location?.country || ''}`
                                        : 'Non disponible',
                                deviceInfo: `${parsedUserAgent.device.model || 'Unknown device'}, ${parsedUserAgent.os.name} ${parsedUserAgent.os.version}, ${parsedUserAgent.browser.name} ${parsedUserAgent.browser.version}, ${request.ip}`,
                            })
                        )
                    );
                }
                return jsonResponse(reply, 'Identifiants invalides', {}, 401);
            }

            await userRepository.update(user.id, { updatedAt: new Date() });

            const tokens = await authService.generateTokens(user, request);

            if (!tokens?.accessToken?.token || !tokens?.refreshToken?.token) {
                return jsonResponse(reply, 'Erreur lors de la génération des tokens', {}, 500);
            }
            //check if is a new device
            if (isNewDevice) {
                try {
                    mailerService.sendEmail(
                        user.email,
                        'New Device Login',
                        await render(
                            NewDeviceLogin({
                                name: user.firstName,
                                deviceName: `${parsedUserAgent.device.model || 'Unknown device'}, ${parsedUserAgent.os.name} ${parsedUserAgent.os.version}, ${parsedUserAgent.browser.name} ${parsedUserAgent.browser.version}`,
                                loginDate: new Date().toLocaleString('fr-FR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                }),
                                location:
                                    location?.city || location?.country
                                        ? `${location?.city || ''}, ${location?.region || ''}, ${location?.country || ''}`
                                        : 'Non disponible',
                                deviceId: parsedUserAgent.raw.slice(0, 20),
                            })
                        )
                    );
                } catch (error) {
                    console.log('\n\n error', error);
                    this.logger.error({
                        msg: "Erreur lors de l'envoi de l'email de nouveau appareil",
                        error: error,
                    });
                }
            }

            this.logger.info({
                msg: 'Utilisateur connecté',
                action: 'login',
                status: 'success',
                timestamp: Date.now(),
                deviceInfo: request.headers['user-agent']
                    ? {
                        browser: parsedUserAgent.browser.name,
                        os: parsedUserAgent.os.name,
                        isMobile: parsedUserAgent.device.type === 'mobile',
                    }
                    : 'Unknown device',
            });

            return authResponse(reply, tokens?.accessToken?.token, tokens?.refreshToken?.token);
        },
    });

    public updatePassword = asyncHandler<UpdatePasswordDto, unknown, unknown, UserDto>({
        bodySchema: updatePasswordSchema,
        logger: this.logger,
        handler: async (request, reply) => {
            const { currentPassword, newPassword } = request.body;

            console.log('\n\n currentPassword', currentPassword);
            console.log('\n\n newPassword', newPassword);

            const existingUser = await userRepository.findById(request.user.id);

            if (!existingUser || !existingUser.id) {
                return jsonResponse(reply, 'Utilisateur non trouvé', {}, 404);
            }

            if (existingUser.id !== request.user.id) {
                return jsonResponse(reply, 'Utilisateur non autorisé', {}, 403);
            }

            const isPasswordValid = await bcrypt.compare(currentPassword, existingUser.password);

            console.log('\n\n isPasswordValid', isPasswordValid);

            if (!isPasswordValid) {
                return jsonResponse(reply, 'Mot de passe incorrect', {}, 401);
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await userRepository.update(existingUser.id, { password: hashedPassword });

            return jsonResponse(reply, 'Mot de passe mis à jour avec succès', {}, 200);
        },
    });

    public refreshToken = asyncHandler<TokenDto, unknown, unknown, TokenDto[]>({
        bodySchema: tokenSchema,
        logger: this.logger,
        handler: async (request, reply) => {
            const body = request.body as { token: string };
            const token = body.token;
            const decoded = verify(token, process.env.JWT_SECRET as string) as UserSchema;

            const foundToken = await tokenRepository.findByToken(token);

            if (!foundToken || foundToken.unvailableAt) {
                return jsonResponse(reply, 'Token invalide', null, 401);
            }

            const user = await userRepository.findById(decoded.id);

            if (!user) {
                return jsonResponse(reply, 'Utilisateur non trouvé', null, 404);
            }

            const newTokens = await authService.generateTokens(user, request);

            if (!newTokens?.accessToken?.token || !newTokens?.refreshToken?.token) {
                return jsonResponse(reply, 'Erreur lors de la génération des tokens', {}, 500);
            }

            return authResponse(
                reply,
                newTokens?.accessToken?.token,
                newTokens?.refreshToken?.token
            );
        },
    });

    public requestPasswordReset = asyncHandler<RequestPasswordResetDto, unknown, unknown, UserDto>({
        bodySchema: requestPasswordResetSchema,
        logger: this.logger,
        handler: async (request, reply) => {
            const user = await userRepository.findByEmail(request.body.email);

            if (!user || !user.id) {
                return jsonResponse(reply, 'Identifiants invalides', {}, 401);
            }

            const token = await authService.generatePasswordResetToken(user.id, request.ip);

            const email = await render(
                PasswordResetEmail({
                    name: user.firstName,
                    resetUrl: `${process.env.FRONTEND_URL}/reset-password?token=${token}`,
                })
            );

            await mailerService.sendEmail(user.email, 'Mot de passe oublié', email);

            return jsonResponse(reply, 'Mot de passe oublié', {}, 200);
        },
    });

    public resetPassword = asyncHandler<ResetPasswordDto, unknown, unknown, UserDto>({
        bodySchema: resetPasswordSchema,
        logger: this.logger,
        handler: async (request, reply) => {
            const { token, currentPassword, newPassword } = request.body;
            console.log('\n\n token', token);

            const resetToken = await authService.findByToken(token);

            if (
                !resetToken ||
                resetToken.type !== 'reset_password' ||
                new Date() > resetToken.expiresAt
            ) {
                return jsonResponse(reply, 'Token invalide ou expiré', {}, 400);
            }

            const user = await userRepository.findById(resetToken.ownedById as string);
            if (!user) {
                return jsonResponse(reply, 'Utilisateur non trouvé', {}, 404);
            }

            const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordValid) {
                return jsonResponse(reply, 'Mot de passe actuel incorrect', {}, 400);
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await userService.updatePassword(resetToken.ownedById as string, hashedPassword);

            await authService.deleteToken(resetToken.id);

            return jsonResponse(reply, 'Mot de passe réinitialisé avec succès', {}, 200);
        },
    });

    public getCurrentUser = asyncHandler<unknown, unknown, unknown, UserDto>({
        logger: this.logger,
        handler: async (request, reply) => {
            if (!request.user?.id) {
                return jsonResponse(reply, 'Utilisateur non authentifié', null, 401);
            }

            const user = await userRepository.findById(request.user.id);
            if (!user) {
                return jsonResponse(reply, 'Utilisateur non trouvé', null, 404);
            }

            const token = request.headers.authorization?.split(' ')[1];
            const foundedToken = await tokenRepository.findByToken(token as string);

            if (!token || foundedToken?.unvailableAt) {
                return jsonResponse(reply, 'Token invalide', null, 401);
            }

            return jsonResponse(reply, 'Utilisateur récupéré avec succès', user, 200);
        },
    });

    public getMySessions = asyncHandler<unknown, QuerySessionsDto, unknown, TokenDto[]>({
        querySchema: querySessionsSchema,
        logger: this.logger,
        handler: async (request, reply) => {
            if (!request.user?.id) {
                return jsonResponse(reply, 'Utilisateur non authentifié', null, 401);
            }

            if (
                request.query.userId !== request.user.id &&
                !request.user.roles?.includes(UserRole.Admin)
            ) {
                return jsonResponse(reply, 'Utilisateur non autorisé', null, 403);
            }

            const tokens = await tokenRepository.findAllByUserIdAndBrowser(request.query.userId);
            return jsonResponse(reply, 'Sessions récupérées avec succès', tokens, 200);
        },
    });
}

export const authController = new AuthController();
```

```
authServie.ts
import { tokenRepository } from '@/repositories/tokenRepository';
import { jsonResponse } from '@/utils/jsonResponse';
import { getLocationFromIp } from '@/utils/locationFromIp';
import { parseUserAgent } from '@/utils/userAgentParser';

import { FastifyReply, FastifyRequest } from 'fastify';
import { sign, verify } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import { Token, User } from '@/config/client';

const JWT_SECRET = process.env.JWT_SECRET!;
const RESET_TOKEN_EXPIRATION_HOURS = 2;

class AuthService {
    constructor() {}

    /**
     * Génère un token d'accès pour un utilisateur
     * @param user - L'utilisateur à générer le token
     * @param type - Le type de token à générer
     * @param request - La requête Fastify
     * @returns Le token d'accès généré
     */
    async generateToken(
        user: User,
        type: 'access' | 'refresh',
        request: FastifyRequest
    ): Promise<Token | null> {
        const rawUserAgent = request.headers['user-agent'] || '';
        const parsedUserAgent = parseUserAgent(rawUserAgent);
        const location = await getLocationFromIp(request.ip);

        const expiresIn = type === 'access' ? '24h' : '7d';
        const tokenPayload = sign(user, process.env.JWT_SECRET as string, {
            expiresIn,
        });

        if (!user.id) {
            return null;
        }

        const token = await tokenRepository.create({
            deviceName:
                parsedUserAgent.device.model || parsedUserAgent.browser.name || 'Unknown device',
            deviceIp: location?.ip || '',
            userAgent: rawUserAgent,
            browserName: parsedUserAgent.browser.name,
            browserVersion: parsedUserAgent.browser.version,
            osName: parsedUserAgent.os.name,
            osVersion: parsedUserAgent.os.version,
            deviceType: parsedUserAgent.device.type,
            deviceVendor: parsedUserAgent.device.vendor,
            deviceModel: parsedUserAgent.device.model,
            locationCity: location?.city,
            locationCountry: location?.country,
            locationLat: location?.latitude,
            locationLon: location?.longitude,
            token: tokenPayload,
            type: type === 'access' ? 'access_token' : 'refresh_token',
            scopes: JSON.stringify(['read', 'write']),
            owner: {
                connect: {
                    id: user.id,
                },
            },
            expiresAt:
                type === 'access'
                    ? new Date(Date.now() + 24 * 60 * 60 * 1000)
                    : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return token;
    }

    /**
     * Génère un token pour un utilisateur
     * @param user - L'utilisateur à générer le token
     * @param request - La requête Fastify
     * @returns Le token généré
     */
    async generateTokens(
        user: User,
        request: FastifyRequest
    ): Promise<{ accessToken: Token; refreshToken: Token } | null> {
        if (!user.id) return null;

        const accessToken = await this.generateToken(user, 'access', request);
        const refreshToken = await this.generateToken(user, 'refresh', request);

        return {
            accessToken: accessToken as Token,
            refreshToken: refreshToken as Token,
        };
    }

    /**
     *
     * Vérifie si un utilisateur est connecté avec un nouveau device
     *
     * @param user - L'utilisateur à vérifier
     * @param request - La requête Fastify
     * @returns true si l'utilisateur est connecté avec un nouveau device, false sinon
     */
    async isNewDevice(user: User, request: FastifyRequest): Promise<boolean> {
        const ip = request.ip;
        const userAgent = request.headers['user-agent'] || '';

        // Récupérer tous les tokens de l'utilisateur
        const tokens = await tokenRepository.findAllByUserId(user.id);

        // Si l'utilisateur n'a pas de tokens, c'est forcément un nouvel appareil
        if (tokens.length === 0) {
            return true;
        }

        // Vérifier si l'utilisateur a déjà un token avec cette IP et ce user-agent
        const existingDevice = tokens.some(
            (token) => token.deviceIp === ip && token.userAgent === userAgent
        );

        // Si aucun token ne correspond à l'appareil actuel, c'est un nouvel appareil
        return !existingDevice;
    }

    /**
     * Verify a token
     * @param request - The Fastify request
     * @param reply - The Fastify reply
     * @returns The decoded token or null if the token is invalid
     */
    async verifyToken(request: FastifyRequest, reply: FastifyReply): Promise<User | null> {
        try {
            const authorization = request.headers.authorization;
            const token = authorization?.split(' ')[1];
            if (!token) {
                jsonResponse(reply, 'Invalid token', {}, 401);
                return null;
            }
            const decoded = verify(token, process.env.JWT_SECRET as string) as User;
            return decoded;
        } catch (error) {
            jsonResponse(reply, 'Invalid token', {}, 401);
            return null;
        }
    }

    /**
     * Trouve un token par son token
     * @param token - Le token à trouver
     * @returns Le token trouvé ou null si aucun token n'est trouvé
     */
    async findByToken(token: string): Promise<Token | null> {
        return tokenRepository.findByToken(token);
    }

    /**
     * Supprime un token par son id
     * @param id - L'id du token à supprimer
     * @returns Le token supprimé ou null si aucun token n'est trouvé
     */
    async deleteToken(id: string): Promise<Token | null> {
        return tokenRepository.delete(id);
    }

    /**
     * Génère un token de réinitialisation de mot de passe pour un utilisateur
     * @param userId - L'id de l'utilisateur
     * @param ip - L'ip de l'utilisateur
     * @returns Le token de réinitialisation de mot de passe
     */
    async generatePasswordResetToken(userId: string, ip: string): Promise<string> {
        // Supprime les anciens tokens de reset
        await tokenRepository.deleteByUserAndType(userId, 'reset_password');

        const expiresIn = RESET_TOKEN_EXPIRATION_HOURS * 60 * 60; // en secondes

        // Génère le token JWT
        const token = sign(
            {
                sub: userId,
                scope: 'reset',
            },
            JWT_SECRET,
            {
                expiresIn,
            }
        );

        const expiresAt = new Date(Date.now() + expiresIn * 1000);

        // Stocke les métadonnées (et potentiellement pour invalidation)
        await tokenRepository.create({
            token: token,
            owner: {
                connect: {
                    id: userId,
                },
            },
            type: 'reset_password',
            scopes: 'reset',
            deviceName: 'Password Reset',
            deviceIp: ip,
            expiresAt,
        });

        return token;
    }

    async generateInvitationToken(
        email: string,
        deviceIp: string,
        senderId: string,
        deviceName: string
    ): Promise<Token> {
        await tokenRepository.deleteByUserAndType(senderId, 'invitation');

        const tempToken = uuidv4();
        const expiresAt = new Date();
        expiresAt.setFullYear(expiresAt.getFullYear() + 100); // Never expires (set to 100 years in the future)
        const token = await tokenRepository.create({
            token: tempToken,
            owner: {
                connect: {
                    id: senderId,
                },
            },
            type: 'invitation',
            scopes: 'invitation',
            deviceName,
            deviceIp,
            expiresAt,
        });

        return token;
    }
}

export const authService = new AuthService();
```


```
userTransform
import { BasicUserDto, RestrictedUserDto, UserDto, UserRole } from '@shared/dto';

import { User } from '@/config/client';
import { BasicUser } from '@/types';

class UserTransform {
    public toUserDto(user: User): UserDto {
        return {
            ...user,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
            roles: user.roles as UserRole[],
        };
    }

    public toRestrictedUserDto(user: User): RestrictedUserDto {
        return {
            ...user,
            roles: user.roles as UserRole[],
        };
    }

    public toBasicUserDto(user: BasicUser): BasicUserDto {
        return {
            ...user,
        };
    }
}

export const userTransform = new UserTransform();
```

```tokenRepository.ts
import { Prisma, PrismaClient, Token } from '@/config/client';
import prisma from '@/config/prisma';

class TokenRepository {
    protected modelClient: PrismaClient['token'];

    constructor() {
        this.modelClient = prisma.token;
    }

    /**
     * Trouve un token par son token
     * @param token - Le token à trouver
     * @returns Le token trouvé ou null si aucun token n'est trouvé
     */
    async findByToken(token: string): Promise<Token | null> {
        return this.findOne({ token });
    }

    /**
     * Supprime un token par son id
     * @param id - L'id du token à supprimer
     * @returns Le token supprimé ou null si aucun token n'est trouvé
     */
    async deleteByUserAndType(userId: string, type: string): Promise<{ count: number }> {
        return this.deleteMany({ ownedById: userId, type });
    }

    /**
     * Récupère tous les tokens d'un utilisateur
     * @param userId - L'id de l'utilisateur à récupérer
     * @returns Les tokens de l'utilisateur
     */
    async findAllByUserId(userId: string): Promise<Token[]> {
        return this.modelClient.findMany({
            where: {
                ownedById: userId,
            },
        });
    }

    /**
     * Je veux récupérer les tokens les plus récents pour chaque Browser
     * @param data - Les données du token à créer
     * @returns Le token créé
     */
    async findAllByUserIdAndBrowser(userId: string): Promise<Token[]> {
        return this.modelClient.findMany({
            where: {
                ownedById: userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
            distinct: ['browserName'],
        });
    }

    async create(data: Prisma.TokenCreateInput): Promise<Token> {
        return this.modelClient.create({
            data,
        });
    }

    /**
     * Trouve un token par des critères spécifiques
     * @param filters - Les critères de recherche
     * @returns Le token trouvé ou null si aucun token n'est trouvé
     */
    async findOne(filters: Prisma.TokenWhereInput): Promise<Token | null> {
        return this.modelClient.findFirst({ where: filters });
    }

    /**
     * Supprime plusieurs tokens selon des critères
     * @param filters - Les critères de suppression
     * @returns Le nombre de tokens supprimés
     */
    async deleteMany(filters: Prisma.TokenWhereInput): Promise<{ count: number }> {
        const result = await this.modelClient.deleteMany({
            where: filters
        });
        return { count: result.count };
    }

    /**
     * Supprime un token par son id
     * @param id - L'id du token à supprimer
     * @returns Le token supprimé
     */
    async delete(id: string): Promise<Token> {
        return this.modelClient.delete({
            where: { id }
        });
    }
}

export const tokenRepository = new TokenRepository();
```