import prisma from '../config/prisma';
import { Difficulty } from '@shared/enums';

interface ExerciseData {
    id: string;
    name: string;
    force?: string;
    level?: string;
    mechanic?: string;
    equipment?: string;
    primaryMuscles?: string[];
    secondaryMuscles?: string[];
    instructions?: string[];
    category?: string;
    images?: string[];
}

// Mapping from Free Exercise DB muscle names to our identifiers
const muscleMapping: Record<string, string> = {
    'abdominals': 'abdominals',
    'abductors': 'glutes', // We don't have abductors, map to glutes
    'adductors': 'glutes', // We don't have adductors, map to glutes
    'biceps': 'biceps',
    'calves': 'calves',
    'chest': 'chest',
    'forearms': 'forearms',
    'glutes': 'glutes',
    'hamstrings': 'hamstrings',
    'lats': 'lats',
    'lower back': 'lowerback',
    'middle back': 'lats', // Map middle back to lats
    'neck': 'traps', // Map neck to traps
    'quadriceps': 'quads',
    'shoulders': 'front-shoulders',
    'triceps': 'triceps',
    'traps': 'traps',
};

// Map exercise level to our Difficulty enum
const mapDifficulty = (level?: string): Difficulty => {
    if (!level) return Difficulty.BEGINNER;

    switch (level.toLowerCase()) {
        case 'beginner':
            return Difficulty.BEGINNER;
        case 'intermediate':
            return Difficulty.INTERMEDIATE;
        case 'expert':
        case 'advanced':
            return Difficulty.ADVANCED;
        default:
            return Difficulty.BEGINNER;
    }
};

export async function seedExercises() {
    console.log('🏋️  Seeding exercises from Free Exercise DB...');

    try {
        // Fetch exercises from Free Exercise DB
        const response = await fetch('https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json');
        const exercisesData: ExerciseData[] = await response.json();

        console.log(`📥 Fetched ${exercisesData.length} exercises from Free Exercise DB`);

        // Get all muscles from database to create a mapping
        const muscles = await prisma.muscle.findMany({
            select: { id: true, identifier: true }
        });

        const muscleMap = new Map(muscles.map(m => [m.identifier, m.id]));

        let createdCount = 0;
        let skippedCount = 0;

        // Process exercises in batches to avoid overwhelming the database
        const batchSize = 50;
        for (let i = 0; i < exercisesData.length; i += batchSize) {
            const batch = exercisesData.slice(i, i + batchSize);

            await Promise.all(batch.map(async (exerciseData) => {
                try {
                    // Skip exercises without names
                    if (!exerciseData.name) {
                        skippedCount++;
                        return;
                    }

                    // Build description from instructions
                    const description = exerciseData.instructions?.join(' ') || undefined;

                    // Map difficulty
                    const difficulty = mapDifficulty(exerciseData.level);

                    // Check if exercise exists
                    let exercise = await prisma.exercise.findFirst({
                        where: { name: exerciseData.name }
                    });

                    if (exercise) {
                        // Update existing exercise
                        exercise = await prisma.exercise.update({
                            where: { id: exercise.id },
                            data: {
                                description,
                                difficulty,
                            },
                        });
                    } else {
                        // Create new exercise
                        exercise = await prisma.exercise.create({
                            data: {
                                name: exerciseData.name,
                                description,
                                difficulty,
                            },
                        });
                    }

                    // Map and link muscles
                    const primaryMuscles = exerciseData.primaryMuscles || [];
                    const secondaryMuscles = exerciseData.secondaryMuscles || [];

                    // Create muscle relationships with deduplication
                    const muscleConnections: Array<{ exerciseId: string; muscleId: string; isPrimary: boolean }> = [];
                    const addedMuscleIds = new Set<string>();

                    // Add primary muscles first
                    for (const muscleName of primaryMuscles) {
                        const mappedIdentifier = muscleMapping[muscleName.toLowerCase()];
                        if (mappedIdentifier && muscleMap.has(mappedIdentifier)) {
                            const muscleId = muscleMap.get(mappedIdentifier)!;
                            if (!addedMuscleIds.has(muscleId)) {
                                muscleConnections.push({
                                    exerciseId: exercise.id,
                                    muscleId,
                                    isPrimary: true,
                                });
                                addedMuscleIds.add(muscleId);
                            }
                        }
                    }

                    // Add secondary muscles (skip if already added as primary)
                    for (const muscleName of secondaryMuscles) {
                        const mappedIdentifier = muscleMapping[muscleName.toLowerCase()];
                        if (mappedIdentifier && muscleMap.has(mappedIdentifier)) {
                            const muscleId = muscleMap.get(mappedIdentifier)!;
                            if (!addedMuscleIds.has(muscleId)) {
                                muscleConnections.push({
                                    exerciseId: exercise.id,
                                    muscleId,
                                    isPrimary: false,
                                });
                                addedMuscleIds.add(muscleId);
                            }
                        }
                    }

                    // Create all muscle connections
                    if (muscleConnections.length > 0) {
                        await Promise.all(muscleConnections.map(conn =>
                            prisma.exerciseMuscle.upsert({
                                where: {
                                    exerciseId_muscleId: {
                                        exerciseId: conn.exerciseId,
                                        muscleId: conn.muscleId,
                                    }
                                },
                                update: {
                                    isPrimary: conn.isPrimary,
                                },
                                create: conn,
                            })
                        ));
                    }

                    // Add exercise images
                    if (exerciseData.images && exerciseData.images.length > 0) {
                        // Delete existing pictures for this exercise
                        await prisma.exercisePicture.deleteMany({
                            where: { exerciseId: exercise.id }
                        });

                        // Create new pictures
                        await prisma.exercisePicture.createMany({
                            data: exerciseData.images.map((imagePath, index) => ({
                                exerciseId: exercise.id,
                                url: `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${imagePath}`,
                                order: index,
                            }))
                        });
                    }

                    createdCount++;
                } catch (error) {
                    console.error(`❌ Error seeding exercise "${exerciseData.name}":`, error);
                    skippedCount++;
                }
            }));

            console.log(`⏳ Processed ${Math.min(i + batchSize, exercisesData.length)}/${exercisesData.length} exercises...`);
        }

        console.log(`✅ Successfully seeded ${createdCount} exercises`);
        console.log(`⚠️  Skipped ${skippedCount} exercises due to errors`);
    } catch (error) {
        console.error('❌ Error seeding exercises:', error);
        throw error;
    }
}
