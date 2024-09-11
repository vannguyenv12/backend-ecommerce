/*
  Warnings:

  - You are about to drop the column `addressId` on the `order` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_addressId_fkey`;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `addressId`,
    ADD COLUMN `address` VARCHAR(191) NOT NULL DEFAULT '';
