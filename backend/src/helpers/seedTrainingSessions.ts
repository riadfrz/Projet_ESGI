import prisma from '../config/prisma';

export async function seedTrainingSessions() {
    console.log('💪 Seeding training sessions...');

    try {
        // Get users (excluding admins)
        const users = await prisma.user.findMany({
            where: {
                role: {
                    in: ['CLIENT', 'GYM_OWNER']
                }
            },
            take: 20,
        });

        if (users.length === 0) {
            console.log('⚠️  No users found, skipping training session seeding');
            return [];
        }

        // Get exercises to use in training sessions
        const exercises = await prisma.exercise.findMany({
            take: 50,
        });

        if (exercises.length === 0) {
            console.log('⚠️  No exercises found, skipping training session seeding');
            return [];
        }

        const trainingSessions = [];

        // Create training sessions for each user (last 90 days)
        for (const user of users) {
            // Random number of sessions per user (5-30)
            const sessionCount = Math.floor(Math.random() * 26) + 5;

            for (let i = 0; i < sessionCount; i++) {
                // Random date in the last 90 days
                const daysAgo = Math.floor(Math.random() * 90);
                const sessionDate = new Date();
                sessionDate.setDate(sessionDate.getDate() - daysAgo);

                // Random duration between 30-120 minutes
                const duration = Math.floor(Math.random() * 91) + 30;

                // Random calories burned (proportional to duration)
                const caloriesBurned = Math.floor(duration * (3 + Math.random() * 5)); // 3-8 calories per minute

                // Random repetitions
                const repetitions = Math.floor(Math.random() * 50) + 10; // 10-60 reps

                // Pick a random exercise for this session
                const exercise = exercises[Math.floor(Math.random() * exercises.length)];

                // Create the training session
                const session = await prisma.trainingSession.create({
                    data: {
                        userId: user.id,
                        exerciseId: exercise.id,
                        date: sessionDate,
                        duration,
                        caloriesBurned,
                        repetitions,
                    },
                });

                trainingSessions.push(session);
            }
        }

        console.log(`✅ Created ${trainingSessions.length} training sessions for ${users.length} users`);
        return trainingSessions;
    } catch (error) {
        console.error('❌ Error seeding training sessions:', error);
        throw error;
    }
}
