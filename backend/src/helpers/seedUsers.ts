import { fakerUser, users } from '@/fixtures';

import { User } from '@/config/client';
import prisma from '@/config/prisma';

export async function seedUsers(
    countFakerUsers = 10
): Promise<User[]> {
    console.log('🌱 Seeding users...');
    const createdUsers: User[] = [];

    try {
        // Create predefined users
        for (let i = 0; i < users.length; i++) {
            const { ...userData } = users[i];
            const user = await prisma.user.create({
                data: {
                    ...userData,
                },
            });
            createdUsers.push(user);
        }

        // Create faker users
        for (let i = 0; i < countFakerUsers; i++) {
            const fakerUserData = fakerUser();
            const { ...fakerUserDataWithoutAddress } = fakerUserData;
            const user = await prisma.user.create({
                data: {
                    ...fakerUserDataWithoutAddress,
                },
            });
            createdUsers.push(user);
        }

        console.log(`✅ Created ${createdUsers.length} users`);
        return createdUsers;
    } catch (error) {
        console.error('❌ Error seeding users:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}
