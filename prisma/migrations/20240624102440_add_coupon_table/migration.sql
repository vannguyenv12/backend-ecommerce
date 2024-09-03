-- AlterTable
ALTER TABLE `order` ADD COLUMN `couponCode` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Coupon` (
    `code` VARCHAR(191) NOT NULL,
    `discountPrice` INTEGER NOT NULL,
    `discountType` ENUM('PERCENT', 'VALUE') NOT NULL DEFAULT 'PERCENT',

    PRIMARY KEY (`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_couponCode_fkey` FOREIGN KEY (`couponCode`) REFERENCES `Coupon`(`code`) ON DELETE SET NULL ON UPDATE CASCADE;
