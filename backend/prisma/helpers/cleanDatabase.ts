import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function cleanDatabase() {
    // Fonction utilitaire pour supprimer en toute sécurité
    async function safeDelete(callback: () => Promise<any>, entityName: string) {
        try {
            await callback();
        } catch (error: any) {
            if (error.code === 'P2021') {
                console.log(`Table pour ${entityName} n'existe pas encore, ignorée`);
            } else {
                console.error(`Erreur lors de la suppression de ${entityName}:`, error);
            }
        }
    }

    // await safeDelete(() => prisma.user.deleteMany(), 'User');

    console.log('Database cleaned successfully');
}
