import prisma from '../config/prisma';
import * as fs from 'fs';
import * as path from 'path';

interface MuscleData {
    name: string;
    identifier: string;
    description?: string;
}

export async function seedMuscles() {
    console.log('🏋️  Seeding muscles...');

    try {
        // Read the muscles data from JSON file
        const musclesDataPath = path.join(__dirname, '../../prisma/data/muscles.json');
        const musclesData: MuscleData[] = JSON.parse(
            fs.readFileSync(musclesDataPath, 'utf-8')
        );

        // Create muscles
        const muscles = await Promise.all(
            musclesData.map((muscle) =>
                prisma.muscle.upsert({
                    where: { identifier: muscle.identifier },
                    update: {
                        name: muscle.name,
                        description: muscle.description,
                    },
                    create: {
                        name: muscle.name,
                        identifier: muscle.identifier,
                        description: muscle.description,
                    },
                })
            )
        );

        console.log(`✅ Created ${muscles.length} muscles`);
        return muscles;
    } catch (error) {
        console.error('❌ Error seeding muscles:', error);
        throw error;
    }
}
