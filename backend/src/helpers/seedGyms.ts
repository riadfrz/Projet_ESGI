import prisma from '../config/prisma';
import { GymStatus } from '@shared/enums';

export async function seedGyms() {
    console.log('🏢 Seeding gyms...');

    try {
        // Get users to assign as gym owners
        const gymOwners = await prisma.user.findMany({
            where: { role: 'GYM_OWNER' },
            take: 5,
        });

        if (gymOwners.length === 0) {
            console.log('⚠️  No gym owners found, skipping gym seeding');
            return [];
        }

        const gymsData = [
            {
                name: 'FitZone Paris Centre',
                description: 'Modern gym in the heart of Paris with state-of-the-art equipment',
                address: '123 Rue de Rivoli',
                city: 'Paris',
                zipCode: '75001',
                country: 'France',
                phone: '+33123456789',
                email: 'contact@fitzone-paris.com',
                capacity: 150,
                status: GymStatus.APPROVED,
                ownerId: gymOwners[0 % gymOwners.length].id,
            },
            {
                name: 'PowerGym Lyon',
                description: 'Specialized in strength training and bodybuilding',
                address: '45 Cours Gambetta',
                city: 'Lyon',
                zipCode: '69003',
                country: 'France',
                phone: '+33456789123',
                email: 'info@powergym-lyon.com',
                capacity: 100,
                status: GymStatus.APPROVED,
                ownerId: gymOwners[1 % gymOwners.length].id,
            },
            {
                name: 'Wellness Club Marseille',
                description: 'Complete fitness center with spa and wellness facilities',
                address: '78 Avenue du Prado',
                city: 'Marseille',
                zipCode: '13008',
                country: 'France',
                phone: '+33491234567',
                email: 'contact@wellness-marseille.com',
                capacity: 200,
                status: GymStatus.APPROVED,
                ownerId: gymOwners[2 % gymOwners.length].id,
            },
            {
                name: 'CrossFit Bordeaux',
                description: 'Dedicated CrossFit box with Olympic lifting platform',
                address: '12 Quai des Chartrons',
                city: 'Bordeaux',
                zipCode: '33000',
                country: 'France',
                phone: '+33556789012',
                email: 'hello@crossfit-bordeaux.com',
                capacity: 80,
                status: GymStatus.APPROVED,
                ownerId: gymOwners[3 % gymOwners.length].id,
            },
            {
                name: 'Yoga & Fitness Toulouse',
                description: 'Holistic approach combining yoga, pilates and traditional fitness',
                address: '56 Rue des Arts',
                city: 'Toulouse',
                zipCode: '31000',
                country: 'France',
                phone: '+33561234567',
                email: 'info@yoga-fitness-toulouse.com',
                capacity: 120,
                status: GymStatus.APPROVED,
                ownerId: gymOwners[4 % gymOwners.length].id,
            },
            {
                name: 'Iron Temple Nice',
                description: 'Old-school bodybuilding gym with vintage equipment',
                address: '89 Promenade des Anglais',
                city: 'Nice',
                zipCode: '06000',
                country: 'France',
                phone: '+33493456789',
                email: 'contact@irontemple-nice.com',
                capacity: 90,
                status: GymStatus.PENDING,
                ownerId: gymOwners[0 % gymOwners.length].id,
            },
        ];

        // Delete existing gyms first to avoid duplicates
        await prisma.gym.deleteMany({});

        const gyms = await Promise.all(
            gymsData.map((gym) =>
                prisma.gym.create({
                    data: gym,
                })
            )
        );

        console.log(`✅ Created ${gyms.length} gyms`);
        return gyms;
    } catch (error) {
        console.error('❌ Error seeding gyms:', error);
        throw error;
    }
}
