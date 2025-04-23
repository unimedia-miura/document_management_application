/*
  Warnings:

  - You are about to drop the column `published` on the `Document` table. All the data in the column will be lost.
  - Added the required column `delete_flg` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deletedAt` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Document` DROP COLUMN `published`,
    ADD COLUMN `delete_flg` BOOLEAN NOT NULL,
    ADD COLUMN `deletedAt` DATETIME(3) NOT NULL;
