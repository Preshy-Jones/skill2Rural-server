/*
  Warnings:

  - You are about to drop the column `no_of_correct_answers` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `no_of_questions` on the `Quiz` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Quiz" DROP COLUMN "no_of_correct_answers",
DROP COLUMN "no_of_questions";
