-- CreateEnum
CREATE TYPE "Type" AS ENUM ('USER', 'EDUCATOR');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "no_of_students_to_reach" INTEGER,
ADD COLUMN     "organisation" TEXT,
ADD COLUMN     "role" TEXT,
ADD COLUMN     "type" "Type" NOT NULL DEFAULT 'USER',
ADD COLUMN     "work_with_maginalized_populations" BOOLEAN;
