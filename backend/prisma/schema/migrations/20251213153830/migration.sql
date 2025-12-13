-- CreateTable
CREATE TABLE `tokens` (
    `id` VARCHAR(191) NOT NULL,
    `token` VARCHAR(2000) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `scopes` VARCHAR(191) NULL,
    `deviceName` VARCHAR(191) NULL,
    `deviceIp` VARCHAR(191) NULL,
    `userAgent` TEXT NULL,
    `browserName` VARCHAR(191) NULL,
    `browserVersion` VARCHAR(191) NULL,
    `osName` VARCHAR(191) NULL,
    `osVersion` VARCHAR(191) NULL,
    `deviceType` VARCHAR(191) NULL,
    `deviceVendor` VARCHAR(191) NULL,
    `deviceModel` VARCHAR(191) NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `unavailableAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `tokens_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tokens` ADD CONSTRAINT `tokens_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
