-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "publishedById" INTEGER;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_publishedById_fkey" FOREIGN KEY ("publishedById") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
