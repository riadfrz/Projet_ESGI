import { tokenRepository } from '@/features/token';
import { parseUserAgent, logger } from '@/utils';
import { FastifyReply, FastifyRequest } from 'fastify';
import { sign, verify } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { Token, User } from '@/config/client';

const JWT_SECRET = process.env.JWT_SECRET!;
const RESET_TOKEN_EXPIRATION_HOURS = 2;

class AuthService {
    private logger = logger.child({
        module: '[AUTH][SERVICE]',
    });

    constructor() {}

    /**
     * Generate a token for a user
     * @param user - The user to generate the token for
     * @param type - The type of token to generate
     * @param request - The Fastify request
     * @returns The generated token
     */
    async generateToken(
        user: User,
        type: 'access' | 'refresh',
        request: FastifyRequest
    ): Promise<Token | null> {
        const rawUserAgent = request.headers['user-agent'] || '';
        const parsedUserAgent = parseUserAgent(rawUserAgent);

        const expiresIn = type === 'access' ? '24h' : '7d';
        
        // Create JWT payload (exclude sensitive data like password)
        const tokenPayload = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
        };
        
        const jwtToken = sign(tokenPayload, JWT_SECRET, {
            expiresIn,
        });

        if (!user.id) {
            return null;
        }

        const token = await tokenRepository.create({
            deviceName:
                parsedUserAgent.device.model || parsedUserAgent.browser.name || 'Unknown device',
            deviceIp: request.ip,
            userAgent: rawUserAgent,
            browserName: parsedUserAgent.browser.name,
            browserVersion: parsedUserAgent.browser.version,
            osName: parsedUserAgent.os.name,
            osVersion: parsedUserAgent.os.version,
            deviceType: parsedUserAgent.device.type,
            deviceVendor: parsedUserAgent.device.vendor,
            deviceModel: parsedUserAgent.device.model,
            token: jwtToken,
            type: type === 'access' ? 'access_token' : 'refresh_token',
            scopes: JSON.stringify(['read', 'write']),
            user: {
                connect: {
                    id: user.id,
                },
            },
            expiresAt:
                type === 'access'
                    ? new Date(Date.now() + 24 * 60 * 60 * 1000)
                    : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        return token;
    }

    /**
     * Generate access and refresh tokens for a user
     * @param user - The user to generate tokens for
     * @param request - The Fastify request
     * @returns The generated tokens
     */
    async generateTokens(
        user: User,
        request: FastifyRequest
    ): Promise<{ accessToken: Token; refreshToken: Token } | null> {
        if (!user.id) return null;

        const accessToken = await this.generateToken(user, 'access', request);
        const refreshToken = await this.generateToken(user, 'refresh', request);

        if (!accessToken || !refreshToken) {
            return null;
        }

        return {
            accessToken,
            refreshToken,
        };
    }

    /**
     * Check if a user is logging in from a new device
     * @param user - The user to check
     * @param request - The Fastify request
     * @returns true if the user is on a new device, false otherwise
     */
    async isNewDevice(user: User, request: FastifyRequest): Promise<boolean> {
        const ip = request.ip;
        const userAgent = request.headers['user-agent'] || '';

        // Get all tokens for the user
        const tokens = await tokenRepository.findAllByUserId(user.id);

        // If the user has no tokens, it's definitely a new device
        if (tokens.length === 0) {
            return true;
        }

        // Check if the user already has a token with this IP and user-agent
        const existingDevice = tokens.some(
            (token) => token.deviceIp === ip && token.userAgent === userAgent
        );

        // If no token matches the current device, it's a new device
        return !existingDevice;
    }

    /**
     * Verify a token
     * @param request - The Fastify request
     * @param reply - The Fastify reply
     * @returns The decoded user or null if the token is invalid
     */
    async verifyToken(request: FastifyRequest, reply: FastifyReply): Promise<Partial<User> | null> {
        try {
            const authorization = request.headers.authorization;
            const token = authorization?.split(' ')[1];
            if (!token) {
                reply.status(401).send({ message: 'Invalid token' });
                return null;
            }
            const decoded = verify(token, JWT_SECRET) as Partial<User>;
            return decoded;
        } catch (error) {
            this.logger.error({ error }, 'Error verifying token');
            reply.status(401).send({ message: 'Invalid token' });
            return null;
        }
    }

    /**
     * Find a token by its token string
     * @param token - The token to find
     * @returns The token or null if not found
     */
    async findByToken(token: string): Promise<Token | null> {
        return tokenRepository.findByToken(token);
    }

    /**
     * Delete a token by its ID
     * @param id - The ID of the token to delete
     * @returns The deleted token or null if not found
     */
    async deleteToken(id: string): Promise<Token | null> {
        return tokenRepository.delete(id);
    }

    /**
     * Generate a password reset token for a user
     * @param userId - The user's ID
     * @param ip - The user's IP address
     * @returns The reset token
     */
    async generatePasswordResetToken(userId: string, ip: string): Promise<string> {
        // Delete old reset tokens
        await tokenRepository.deleteByUserAndType(userId, 'reset_password');

        const expiresIn = RESET_TOKEN_EXPIRATION_HOURS * 60 * 60; // in seconds

        // Generate JWT token
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

        // Store token metadata
        await tokenRepository.create({
            token,
            user: {
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

    /**
     * Generate an invitation token
     * @param email - The email to invite
     * @param deviceIp - The device IP
     * @param senderId - The sender's user ID
     * @param deviceName - The device name
     * @returns The invitation token
     */
    async generateInvitationToken(
        email: string,
        deviceIp: string,
        senderId: string,
        deviceName: string
    ): Promise<Token> {
        await tokenRepository.deleteByUserAndType(senderId, 'invitation');

        const tempToken = uuidv4();
        const expiresAt = new Date();
        expiresAt.setFullYear(expiresAt.getFullYear() + 100); // Never expires
        
        const token = await tokenRepository.create({
            token: tempToken,
            user: {
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
