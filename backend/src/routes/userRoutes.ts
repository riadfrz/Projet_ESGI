import { FastifyInstance } from "fastify";
import { userController } from "@/features/user";
import { isAuthenticated } from "@/middleware/authenticate";
import { createSwaggerSchema } from "@/utils/swaggerUtils";
import { 
    queryUsersSchema, 
    updateUserSchema, 
    idSchema 
} from "@shared/dto";

export default async function userRoutes(app: FastifyInstance) {
    // Get all users (Admin only ideally, but we'll use isAuthenticated for now)
    app.get('/', {
        preHandler: [isAuthenticated],
        schema: createSwaggerSchema(
            "Récupérer tous les utilisateurs",
            [
                { message: 'Utilisateurs récupérés', data: {}, status: 200 },
                { message: 'Non authentifié', data: {}, status: 401 },
            ],
            null, // No body schema for GET
            true,
            queryUsersSchema, // Pass query schema as the 5th argument
            ['Users']
        ),
        handler: userController.getAllUsers,
    });

    // Get user by ID
    app.get('/:id', {
        preHandler: [isAuthenticated],
        schema: createSwaggerSchema(
            "Récupérer un utilisateur par ID",
            [
                { message: 'Utilisateur récupéré', data: {}, status: 200 },
                { message: 'Utilisateur non trouvé', data: {}, status: 404 },
            ],
            null,
            true,
            idSchema, // Params schema for GET by ID (handled as query/params in this utility)
            ['Users']
        ),
        handler: userController.getUserById,
    });

    // Update user (Self or Admin)
    app.patch('/:id', {
        preHandler: [isAuthenticated],
        schema: createSwaggerSchema(
            "Mettre à jour un utilisateur",
            [
                { message: 'Utilisateur mis à jour', data: {}, status: 200 },
                { message: 'Utilisateur non trouvé', data: {}, status: 404 },
            ],
            updateUserSchema,
            true,
            idSchema,
            ['Users']
        ),
        handler: userController.updateUser,
    });

    // Delete user (Admin)
    app.delete('/:id', {
        preHandler: [isAuthenticated],
        schema: createSwaggerSchema(
            "Supprimer un utilisateur",
            [
                { message: 'Utilisateur supprimé', data: {}, status: 200 },
                { message: 'Utilisateur non trouvé', data: {}, status: 404 },
            ],
            null,
            true,
            idSchema,
            ['Users']
        ),
        handler: userController.deleteUser,
    });

    // Update current user profile
    app.patch('/me', {
        preHandler: [isAuthenticated],
        schema: createSwaggerSchema(
            "Mettre à jour mon profil",
            [
                { message: 'Profil mis à jour', data: {}, status: 200 },
            ],
            updateUserSchema,
            true,
            null,
            ['Users']
        ),
        handler: async (req, res) => {
            // Helper to reuse updateUser logic but force ID to current user
            if (!req.user) return res.status(401).send({ message: 'Non authentifié' });
            req.params = { id: req.user.id };
            return userController.updateUser(req as any, res);
        },
    });
}
