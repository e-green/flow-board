-- AlterTable
ALTER TABLE "SubTask" ADD COLUMN     "assigneeId" INTEGER,
ADD COLUMN     "comments" TEXT;

-- AddForeignKey
ALTER TABLE "SubTask" ADD CONSTRAINT "SubTask_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
