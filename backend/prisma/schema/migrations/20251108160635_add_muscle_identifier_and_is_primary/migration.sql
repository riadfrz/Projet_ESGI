/*
  Warnings:

  - You are about to drop the `accounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `badges` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `challenge_exercises` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `challenge_participants` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `challenges` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `exercise_muscles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `exercise_pictures` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `exercises` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `gym_equipments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `gyms` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `muscles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `training_sessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_badges` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `verifications` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `accounts` DROP FOREIGN KEY `accounts_userId_fkey`;

-- DropForeignKey
ALTER TABLE `challenge_exercises` DROP FOREIGN KEY `challenge_exercises_challengeId_fkey`;

-- DropForeignKey
ALTER TABLE `challenge_exercises` DROP FOREIGN KEY `challenge_exercises_exerciseId_fkey`;

-- DropForeignKey
ALTER TABLE `challenge_participants` DROP FOREIGN KEY `challenge_participants_challengeId_fkey`;

-- DropForeignKey
ALTER TABLE `challenge_participants` DROP FOREIGN KEY `challenge_participants_userId_fkey`;

-- DropForeignKey
ALTER TABLE `challenges` DROP FOREIGN KEY `challenges_createdBy_fkey`;

-- DropForeignKey
ALTER TABLE `challenges` DROP FOREIGN KEY `challenges_gymId_fkey`;

-- DropForeignKey
ALTER TABLE `exercise_muscles` DROP FOREIGN KEY `exercise_muscles_exerciseId_fkey`;

-- DropForeignKey
ALTER TABLE `exercise_muscles` DROP FOREIGN KEY `exercise_muscles_muscleId_fkey`;

-- DropForeignKey
ALTER TABLE `exercise_pictures` DROP FOREIGN KEY `exercise_pictures_exerciseId_fkey`;

-- DropForeignKey
ALTER TABLE `gym_equipments` DROP FOREIGN KEY `gym_equipments_gymId_fkey`;

-- DropForeignKey
ALTER TABLE `gyms` DROP FOREIGN KEY `gyms_ownerId_fkey`;

-- DropForeignKey
ALTER TABLE `sessions` DROP FOREIGN KEY `sessions_userId_fkey`;

-- DropForeignKey
ALTER TABLE `training_sessions` DROP FOREIGN KEY `training_sessions_challengeId_fkey`;

-- DropForeignKey
ALTER TABLE `training_sessions` DROP FOREIGN KEY `training_sessions_exerciseId_fkey`;

-- DropForeignKey
ALTER TABLE `training_sessions` DROP FOREIGN KEY `training_sessions_gymId_fkey`;

-- DropForeignKey
ALTER TABLE `training_sessions` DROP FOREIGN KEY `training_sessions_userId_fkey`;

-- DropForeignKey
ALTER TABLE `user_badges` DROP FOREIGN KEY `user_badges_badgeId_fkey`;

-- DropForeignKey
ALTER TABLE `user_badges` DROP FOREIGN KEY `user_badges_userId_fkey`;

-- DropTable
DROP TABLE `accounts`;

-- DropTable
DROP TABLE `badges`;

-- DropTable
DROP TABLE `challenge_exercises`;

-- DropTable
DROP TABLE `challenge_participants`;

-- DropTable
DROP TABLE `challenges`;

-- DropTable
DROP TABLE `exercise_muscles`;

-- DropTable
DROP TABLE `exercise_pictures`;

-- DropTable
DROP TABLE `exercises`;

-- DropTable
DROP TABLE `gym_equipments`;

-- DropTable
DROP TABLE `gyms`;

-- DropTable
DROP TABLE `muscles`;

-- DropTable
DROP TABLE `sessions`;

-- DropTable
DROP TABLE `training_sessions`;

-- DropTable
DROP TABLE `user_badges`;

-- DropTable
DROP TABLE `users`;

-- DropTable
DROP TABLE `verifications`;
