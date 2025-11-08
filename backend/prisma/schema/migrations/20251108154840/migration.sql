/*
  Warnings:

  - You are about to drop the column `picture` on the `muscles` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[identifier]` on the table `muscles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `identifier` to the `muscles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `exercise_muscles` ADD COLUMN `isPrimary` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `muscles` DROP COLUMN `picture`,
    ADD COLUMN `identifier` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `muscles_identifier_key` ON `muscles`(`identifier`);
