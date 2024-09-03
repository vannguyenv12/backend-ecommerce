-- AlterTable
ALTER TABLE `product` ADD COLUMN `shopId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_shopId_fkey` FOREIGN KEY (`shopId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
