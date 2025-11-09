import prisma from '../config/prisma';
import { ParticipantStatus } from '@shared/enums';

export async function seedChallenges() {
    console.log('🎯 Seeding challenges...');

    try {
        // Get users to create challenges
        const users = await prisma.user.findMany({
            where: {
                role: {
                    in: ['CLIENT', 'GYM_OWNER']
                }
            },
            take: 15,
        });

        if (users.length === 0) {
            console.log('⚠️  No users found, skipping challenge seeding');
            return [];
        }

        const challengesData = [
            {
                title: '30-Day Fitness Challenge',
                description: 'Complete 30 workout sessions in 30 days',
                duration: 30,
                objectiveType: 'SESSIONS',
                objectiveValue: 30,
                isPublic: true,
                startDate: new Date('2025-01-01'),
                endDate: new Date('2025-01-31'),
            },
            {
                title: 'Burn 10,000 Calories',
                description: 'Burn a total of 10,000 calories through workouts',
                duration: 31,
                objectiveType: 'CALORIES',
                objectiveValue: 10000,
                isPublic: true,
                startDate: new Date('2025-01-15'),
                endDate: new Date('2025-02-15'),
            },
            {
                title: 'Weekly Warrior',
                description: 'Work out at least 5 times per week for 4 weeks',
                duration: 28,
                objectiveType: 'SESSIONS',
                objectiveValue: 20,
                isPublic: true,
                startDate: new Date('2025-01-08'),
                endDate: new Date('2025-02-05'),
            },
            {
                title: 'Strength Builder',
                description: 'Complete 50 strength training sessions',
                duration: 90,
                objectiveType: 'SESSIONS',
                objectiveValue: 50,
                isPublic: true,
                startDate: new Date('2025-01-01'),
                endDate: new Date('2025-03-31'),
            },
            {
                title: 'Cardio Master',
                description: 'Burn 5,000 calories through cardio exercises',
                duration: 31,
                objectiveType: 'CALORIES',
                objectiveValue: 5000,
                isPublic: true,
                startDate: new Date('2025-01-20'),
                endDate: new Date('2025-02-20'),
            },
            {
                title: 'Friends Fitness Challenge',
                description: 'Private challenge for our workout group',
                duration: 31,
                objectiveType: 'SESSIONS',
                objectiveValue: 15,
                isPublic: false,
                startDate: new Date('2025-01-10'),
                endDate: new Date('2025-02-10'),
                maxParticipants: 10,
            },
            {
                title: 'Summer Body Prep',
                description: 'Get ready for summer with 60 days of consistent training',
                duration: 60,
                objectiveType: 'SESSIONS',
                objectiveValue: 45,
                isPublic: true,
                startDate: new Date('2025-04-01'),
                endDate: new Date('2025-05-31'),
            },
            {
                title: 'Marathon Calories',
                description: 'Burn enough calories to run a marathon (2,500-3,000 calories)',
                duration: 28,
                objectiveType: 'CALORIES',
                objectiveValue: 2800,
                isPublic: true,
                startDate: new Date('2025-02-01'),
                endDate: new Date('2025-02-28'),
            },
            {
                title: 'Consistency is Key',
                description: 'Work out every day for 14 days straight',
                duration: 14,
                objectiveType: 'SESSIONS',
                objectiveValue: 14,
                isPublic: true,
                startDate: new Date('2025-01-15'),
                endDate: new Date('2025-01-29'),
            },
            {
                title: 'Team Challenge - Office Warriors',
                description: 'Our office fitness challenge',
                duration: 90,
                objectiveType: 'SESSIONS',
                objectiveValue: 100,
                isPublic: false,
                maxParticipants: 20,
                startDate: new Date('2025-01-01'),
                endDate: new Date('2025-03-31'),
            },
        ];

        const challenges = [];

        for (let i = 0; i < challengesData.length; i++) {
            const challengeData = challengesData[i];
            const creator = users[i % users.length];

            const challenge = await prisma.challenge.create({
                data: {
                    ...challengeData,
                    createdBy: creator.id,
                },
            });

            // Add creator as a participant
            await prisma.challengeParticipant.create({
                data: {
                    challengeId: challenge.id,
                    userId: creator.id,
                    status: ParticipantStatus.ACCEPTED,
                },
            });

            // Add 3-8 random participants to each challenge
            const participantCount = Math.floor(Math.random() * 6) + 3;
            const otherUsers = users.filter(u => u.id !== creator.id);
            const selectedParticipants = otherUsers
                .sort(() => Math.random() - 0.5)
                .slice(0, Math.min(participantCount, otherUsers.length));

            for (const participant of selectedParticipants) {
                // Random status for variety
                const statuses = [
                    ParticipantStatus.ACCEPTED,
                    ParticipantStatus.ACCEPTED,
                    ParticipantStatus.ACCEPTED,
                    ParticipantStatus.INVITED,
                ];
                const status = statuses[Math.floor(Math.random() * statuses.length)];

                await prisma.challengeParticipant.create({
                    data: {
                        challengeId: challenge.id,
                        userId: participant.id,
                        status,
                    },
                });
            }

            challenges.push(challenge);
        }

        console.log(`✅ Created ${challenges.length} challenges with participants`);
        return challenges;
    } catch (error) {
        console.error('❌ Error seeding challenges:', error);
        throw error;
    }
}
