import { FastifyInstance } from "fastify";
import { equipmentController } from "@/features/equipment";
import { createSwaggerSchema } from "@/utils/swaggerUtils";
import { isAuthenticated } from "@/middleware/authenticate";
import { hasRole } from "@/middleware/authorize";
import { UserRole } from "@shared/enums/userEnum";

export default async function equipmentRoutes(app: FastifyInstance) {
    // Create equipment (GYM_OWNER for their gym, or ADMIN)
    app.post('/', {
        preHandler: [isAuthenticated, hasRole(UserRole.GYM_OWNER)],
        schema: createSwaggerSchema(
            "Créer un nouvel équipement pour une salle",
            [
                { message: 'Équipement créé avec succès', data: {}, status: 201 },
                { message: 'Salle de sport introuvable', data: {}, status: 404 },
                { message: 'Données invalides', data: {}, status: 400 },
                { message: 'Non authentifié', data: {}, status: 401 },
                { message: 'Accès refusé', data: {}, status: 403 },
            ],
            null,
            true,
            null,
            ['Equipments']
        ),
        handler: equipmentController.createEquipment,
    });

    // Get all equipments with filters and pagination (Public)
    app.get('/', {
        schema: createSwaggerSchema(
            "Récupérer tous les équipements",
            [
                { message: 'Équipements récupérés', data: {}, status: 200 },
            ],
            null,
            false,
            null,
            ['Equipments']
        ),
        handler: equipmentController.getAllEquipments,
    });

    // Get equipment by ID (Public)
    app.get('/:id', {
        schema: createSwaggerSchema(
            "Récupérer un équipement par ID",
            [
                { message: 'Équipement récupéré', data: {}, status: 200 },
                { message: 'Équipement introuvable', data: {}, status: 404 },
            ],
            null,
            false,
            null,
            ['Equipments']
        ),
        handler: equipmentController.getEquipmentById,
    });

    // Update equipment (GYM_OWNER for their gym's equipment, or ADMIN)
    app.put('/:id', {
        preHandler: [isAuthenticated, hasRole(UserRole.GYM_OWNER)],
        schema: createSwaggerSchema(
            "Mettre à jour un équipement",
            [
                { message: 'Équipement mis à jour', data: {}, status: 200 },
                { message: 'Équipement introuvable', data: {}, status: 404 },
                { message: 'Non autorisé', data: {}, status: 403 },
                { message: 'Non authentifié', data: {}, status: 401 },
            ],
            null,
            true,
            null,
            ['Equipments']
        ),
        handler: equipmentController.updateEquipment,
    });

    // Delete equipment (GYM_OWNER for their gym's equipment, or ADMIN)
    app.delete('/:id', {
        preHandler: [isAuthenticated, hasRole(UserRole.GYM_OWNER)],
        schema: createSwaggerSchema(
            "Supprimer un équipement",
            [
                { message: 'Équipement supprimé', data: {}, status: 200 },
                { message: 'Équipement introuvable', data: {}, status: 404 },
                { message: 'Non autorisé', data: {}, status: 403 },
                { message: 'Non authentifié', data: {}, status: 401 },
            ],
            null,
            true,
            null,
            ['Equipments']
        ),
        handler: equipmentController.deleteEquipment,
    });
}
