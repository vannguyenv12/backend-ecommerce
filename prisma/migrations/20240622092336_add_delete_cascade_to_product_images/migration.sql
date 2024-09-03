-- DropForeignKey
ALTER TABLE `productimages` DROP FOREIGN KEY `ProductImages_productId_fkey`;

-- AddForeignKey
ALTER TABLE `ProductImages` ADD CONSTRAINT `ProductImages_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
