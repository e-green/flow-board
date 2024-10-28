-- AlterTable
ALTER TABLE "SubTask" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "parentId" INTEGER;

-- AddForeignKey
ALTER TABLE "SubTask" ADD CONSTRAINT "SubTask_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "SubTask"("id") ON DELETE SET NULL ON UPDATE CASCADE;
