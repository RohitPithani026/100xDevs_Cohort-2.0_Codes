/*
  Warnings:

  - You are about to drop the column `sortingOrder` on the `Trigger` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Trigger" DROP COLUMN "sortingOrder";

-- AlterTable
ALTER TABLE "Zap" ADD COLUMN     "sortingOrder" INTEGER NOT NULL DEFAULT 0;
