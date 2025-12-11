import prisma from '../src/config/prisma';
import {
  cleanDatabase,
  seedUsers,
  seedMuscles,
  seedExercises,
  seedGyms,
  seedEquipment,
  seedTrainingSessions,
  seedChallenges,
  seedBadges,
} from '../src/helpers';

async function main() {
  try {
    await cleanDatabase();

    console.log('🌱 Starting seeding process...');

    // Seed base data first
    await seedMuscles();
    await seedUsers();
    await seedExercises();

    // Seed gym-related data
    await seedGyms();
    await seedEquipment();

    // Seed user activity data
    await seedTrainingSessions();
    await seedChallenges();

    // Seed badges and award them
    await seedBadges();

    console.log('✅ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error('❌ Fatal error:', e);
});
