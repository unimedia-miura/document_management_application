/*
  Warnings:

  - You are about to drop the column `authorId` on the `Document` table. All the data in the column will be lost.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Document` DROP FOREIGN KEY `Document_authorId_fkey`;

-- DropIndex
DROP INDEX `Document_authorId_fkey` ON `Document`;

-- AlterTable
ALTER TABLE `Document` DROP COLUMN `authorId`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `password` VARCHAR(191) NOT NULL;
