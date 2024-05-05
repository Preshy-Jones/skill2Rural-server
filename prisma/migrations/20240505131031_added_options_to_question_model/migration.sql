/*
  Warnings:

  - Changed the type of `answer` on the `CourseQuestion` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "CourseQuestion" ADD COLUMN     "options" TEXT[],
DROP COLUMN "answer",
ADD COLUMN     "answer" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "Answer";
