/*
  Warnings:

  - You are about to drop the `wishlish` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `wishlish` DROP FOREIGN KEY `Wishlish_productId_fkey`;

-- DropForeignKey
ALTER TABLE `wishlish` DROP FOREIGN KEY `Wishlish_userId_fkey`;

-- DropTable
DROP TABLE `wishlish`;

-- CreateTable
CREATE TABLE `Wishlist` (
    `userId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,

    PRIMARY KEY (`userId`, `productId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Wishlist` ADD CONSTRAINT `Wishlist_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Wishlist` ADD CONSTRAINT `Wishlist_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
