-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('USER', 'ADMIN', 'SHOP') NOT NULL DEFAULT 'USER';
