import prisma from '../config/prisma';

export async function seedEquipment() {
    console.log('🏋️ Seeding equipment...');

    try {
        // Get all gyms
        const gyms = await prisma.gym.findMany();

        if (gyms.length === 0) {
            console.log('⚠️  No gyms found, skipping equipment seeding');
            return [];
        }

        const equipmentTypes = [
            { name: 'Treadmill', minQty: 3, maxQty: 10 },
            { name: 'Elliptical Trainer', minQty: 2, maxQty: 6 },
            { name: 'Stationary Bike', minQty: 5, maxQty: 15 },
            { name: 'Rowing Machine', minQty: 2, maxQty: 5 },
            { name: 'Bench Press', minQty: 2, maxQty: 5 },
            { name: 'Squat Rack', minQty: 2, maxQty: 4 },
            { name: 'Cable Machine', minQty: 1, maxQty: 4 },
            { name: 'Leg Press', minQty: 1, maxQty: 3 },
            { name: 'Smith Machine', minQty: 1, maxQty: 2 },
            { name: 'Dumbbells Set', minQty: 3, maxQty: 10 },
            { name: 'Kettlebells Set', minQty: 2, maxQty: 6 },
            { name: 'Pull-up Bar', minQty: 2, maxQty: 5 },
            { name: 'Lat Pulldown Machine', minQty: 1, maxQty: 3 },
            { name: 'Leg Extension Machine', minQty: 1, maxQty: 2 },
            { name: 'Leg Curl Machine', minQty: 1, maxQty: 2 },
            { name: 'Chest Fly Machine', minQty: 1, maxQty: 2 },
            { name: 'Shoulder Press Machine', minQty: 1, maxQty: 2 },
            { name: 'Preacher Curl Bench', minQty: 1, maxQty: 2 },
            { name: 'Battle Ropes', minQty: 1, maxQty: 3 },
            { name: 'Medicine Balls', minQty: 3, maxQty: 8 },
        ];

        const allEquipment = [];

        for (const gym of gyms) {
            // Each gym gets a random selection of equipment
            const equipmentCount = Math.floor(Math.random() * 5) + 10; // 10-15 types of equipment per gym
            const selectedEquipment = equipmentTypes
                .sort(() => Math.random() - 0.5)
                .slice(0, equipmentCount);

            for (const equipType of selectedEquipment) {
                const quantity = Math.floor(
                    Math.random() * (equipType.maxQty - equipType.minQty + 1)
                ) + equipType.minQty;

                const equipment = await prisma.gymEquipment.create({
                    data: {
                        name: equipType.name,
                        quantity,
                        gymId: gym.id,
                    },
                });

                allEquipment.push(equipment);
            }
        }

        console.log(`✅ Created ${allEquipment.length} equipment items across ${gyms.length} gyms`);
        return allEquipment;
    } catch (error) {
        console.error('❌ Error seeding equipment:', error);
        throw error;
    }
}
