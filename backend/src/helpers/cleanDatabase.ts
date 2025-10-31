import prisma from '@/config/prisma';

export async function cleanDatabase() {
    console.log('🧹 Cleaning database...');

    try {
        // Supprimer d'abord les relations de lecture de messages
        await prisma.user.deleteMany();

        console.log('✅ Database cleaned successfully');
    } catch (error) {
        console.error('❌ Error in cleanup process:', error);
        throw error;
    }
}
