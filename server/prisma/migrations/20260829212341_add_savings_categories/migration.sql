/*
  Warnings:

  - Added the required column `categoryId` to the `SavingsGoal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SavingsGoal" ADD COLUMN     "categoryId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "SavingsCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "SavingsCategory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SavingsGoal" ADD CONSTRAINT "SavingsGoal_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "SavingsCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
