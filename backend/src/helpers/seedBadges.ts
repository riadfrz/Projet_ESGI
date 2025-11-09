import prisma from '../config/prisma';

export async function seedBadges() {
    console.log('🏅 Seeding badges...');

    try {
        const badgesData = [
            {
                name: 'First Steps',
                description: 'Complete your first training session',
                icon: '👟',
                ruleType: 'SESSIONS_COUNT',
                ruleValue: 1,
                points: 10,
            },
            {
                name: 'Getting Started',
                description: 'Complete 5 training sessions',
                icon: '🌱',
                ruleType: 'SESSIONS_COUNT',
                ruleValue: 5,
                points: 50,
            },
            {
                name: 'Dedicated',
                description: 'Complete 10 training sessions',
                icon: '💪',
                ruleType: 'SESSIONS_COUNT',
                ruleValue: 10,
                points: 100,
            },
            {
                name: 'Committed',
                description: 'Complete 25 training sessions',
                icon: '🔥',
                ruleType: 'SESSIONS_COUNT',
                ruleValue: 25,
                points: 250,
            },
            {
                name: 'Fitness Warrior',
                description: 'Complete 50 training sessions',
                icon: '⚔️',
                ruleType: 'SESSIONS_COUNT',
                ruleValue: 50,
                points: 500,
            },
            {
                name: 'Century Club',
                description: 'Complete 100 training sessions',
                icon: '💯',
                ruleType: 'SESSIONS_COUNT',
                ruleValue: 100,
                points: 1000,
            },
            {
                name: 'Marathon Runner',
                description: 'Complete 200 training sessions',
                icon: '🏃',
                ruleType: 'SESSIONS_COUNT',
                ruleValue: 200,
                points: 2000,
            },
            {
                name: 'Calorie Burner',
                description: 'Burn 1,000 calories in total',
                icon: '🔥',
                ruleType: 'TOTAL_CALORIES',
                ruleValue: 1000,
                points: 100,
            },
            {
                name: 'Calorie Crusher',
                description: 'Burn 5,000 calories in total',
                icon: '💥',
                ruleType: 'TOTAL_CALORIES',
                ruleValue: 5000,
                points: 500,
            },
            {
                name: 'Inferno',
                description: 'Burn 10,000 calories in total',
                icon: '🌋',
                ruleType: 'TOTAL_CALORIES',
                ruleValue: 10000,
                points: 1000,
            },
            {
                name: 'Calorie Incinerator',
                description: 'Burn 25,000 calories in total',
                icon: '☄️',
                ruleType: 'TOTAL_CALORIES',
                ruleValue: 25000,
                points: 2500,
            },
            {
                name: 'Challenge Accepted',
                description: 'Complete your first challenge',
                icon: '🎯',
                ruleType: 'CHALLENGES_COMPLETED',
                ruleValue: 1,
                points: 100,
            },
            {
                name: 'Challenge Enthusiast',
                description: 'Complete 3 challenges',
                icon: '🎖️',
                ruleType: 'CHALLENGES_COMPLETED',
                ruleValue: 3,
                points: 300,
            },
            {
                name: 'Challenge Master',
                description: 'Complete 5 challenges',
                icon: '🏆',
                ruleType: 'CHALLENGES_COMPLETED',
                ruleValue: 5,
                points: 500,
            },
            {
                name: 'Challenge Legend',
                description: 'Complete 10 challenges',
                icon: '👑',
                ruleType: 'CHALLENGES_COMPLETED',
                ruleValue: 10,
                points: 1000,
            },
            {
                name: 'Weekly Warrior',
                description: 'Train 7 days in a row',
                icon: '📅',
                ruleType: 'STREAK_DAYS',
                ruleValue: 7,
                points: 200,
            },
            {
                name: 'Monthly Champion',
                description: 'Train 30 days in a row',
                icon: '📆',
                ruleType: 'STREAK_DAYS',
                ruleValue: 30,
                points: 1000,
            },
            {
                name: 'Endurance Beast',
                description: 'Complete a training session lasting 2+ hours',
                icon: '⏱️',
                ruleType: 'SESSION_DURATION',
                ruleValue: 120,
                points: 300,
            },
            {
                name: 'Early Bird',
                description: 'Complete a training session before 7 AM',
                icon: '🌅',
                ruleType: 'EARLY_MORNING_SESSION',
                ruleValue: 1,
                points: 100,
            },
            {
                name: 'Night Owl',
                description: 'Complete a training session after 10 PM',
                icon: '🌙',
                ruleType: 'LATE_NIGHT_SESSION',
                ruleValue: 1,
                points: 100,
            },
        ];

        const badges = await Promise.all(
            badgesData.map((badge) =>
                prisma.badge.upsert({
                    where: { name: badge.name },
                    update: badge,
                    create: badge,
                })
            )
        );

        console.log(`✅ Created ${badges.length} badges`);

        // Award some badges to users based on their activity
        console.log('🎁 Awarding badges to eligible users...');

        const users = await prisma.user.findMany({
            include: {
                trainingSessions: true,
            },
        });

        let awardedCount = 0;

        for (const user of users) {
            const sessionCount = user.trainingSessions.length;

            // Award session-based badges
            const sessionBadges = badges.filter(b =>
                b.ruleType === 'SESSIONS_COUNT' &&
                b.ruleValue <= sessionCount
            );

            for (const badge of sessionBadges) {
                try {
                    await prisma.userBadge.create({
                        data: {
                            userId: user.id,
                            badgeId: badge.id,
                        },
                    });
                    awardedCount++;
                } catch (error) {
                    // Badge might already be awarded, skip
                }
            }

            // Award calorie-based badges
            const totalCalories = user.trainingSessions.reduce(
                (sum, session) => sum + (session.caloriesBurned || 0),
                0
            );

            const calorieBadges = badges.filter(b =>
                b.ruleType === 'TOTAL_CALORIES' &&
                b.ruleValue <= totalCalories
            );

            for (const badge of calorieBadges) {
                try {
                    await prisma.userBadge.create({
                        data: {
                            userId: user.id,
                            badgeId: badge.id,
                        },
                    });
                    awardedCount++;
                } catch (error) {
                    // Badge might already be awarded, skip
                }
            }
        }

        console.log(`✅ Awarded ${awardedCount} badges to users`);
        return badges;
    } catch (error) {
        console.error('❌ Error seeding badges:', error);
        throw error;
    }
}
