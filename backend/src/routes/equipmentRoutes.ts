import { FastifyInstance } from "fastify";
import { equipmentController } from "@/features/equipment";
import { createSwaggerSchema } from "@/utils/swaggerUtils";

export default async function equipmentRoutes(app: FastifyInstance) {
    // Create equipment
    app.post('/', {
        schema: createSwaggerSchema(
            "Créer un nouvel équipement pour une salle",
            [
                { message: 'Équipement créé avec succès', data: {}, status: 201 },
                { message: 'Salle de sport introuvable', data: {}, status: 404 },
                { message: 'Données invalides', data: {}, status: 400 },
            ],
            null,
            true,
            null,
            ['Equipments']
        ),
        handler: equipmentController.createEquipment,
    });

    // Get all equipments with filters and pagination
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

    // Get equipment by ID
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

    // Update equipment
    app.put('/:id', {
        schema: createSwaggerSchema(
            "Mettre à jour un équipement",
            [
                { message: 'Équipement mis à jour', data: {}, status: 200 },
                { message: 'Équipement introuvable', data: {}, status: 404 },
                { message: 'Non autorisé', data: {}, status: 403 },
            ],
            null,
            true,
            null,
            ['Equipments']
        ),
        handler: equipmentController.updateEquipment,
    });

    // Delete equipment
    app.delete('/:id', {
        schema: createSwaggerSchema(
            "Supprimer un équipement",
            [
                { message: 'Équipement supprimé', data: {}, status: 200 },
                { message: 'Équipement introuvable', data: {}, status: 404 },
                { message: 'Non autorisé', data: {}, status: 403 },
            ],
            null,
            true,
            null,
            ['Equipments']
        ),
        handler: equipmentController.deleteEquipment,
    });
}
