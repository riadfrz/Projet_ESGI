import prisma from '../src/config/prisma';
import {
  cleanDatabase,
  seedUsers,
  seedMuscles,
  seedExercises
} from '../src/helpers';

async function main() {
  try {
    await cleanDatabase();

    console.log('🌱 Starting seeding process...');
    await seedMuscles();
    await seedUsers();
    await seedExercises();

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
