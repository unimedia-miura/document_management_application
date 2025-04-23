-- AlterTable
ALTER TABLE `Document` MODIFY `delete_flg` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `deletedAt` DATETIME(3) NULL;
