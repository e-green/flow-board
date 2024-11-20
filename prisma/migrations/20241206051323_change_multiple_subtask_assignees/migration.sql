/*
  Warnings:

  - You are about to drop the column `assigneeId` on the `SubTask` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "SubTask" DROP CONSTRAINT "SubTask_assigneeId_fkey";

-- AlterTable
ALTER TABLE "SubTask" DROP COLUMN "assigneeId";

-- CreateTable
CREATE TABLE "_UserSubTaskAssignee" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserSubTaskAssignee_AB_unique" ON "_UserSubTaskAssignee"("A", "B");

-- CreateIndex
CREATE INDEX "_UserSubTaskAssignee_B_index" ON "_UserSubTaskAssignee"("B");

-- AddForeignKey
ALTER TABLE "_UserSubTaskAssignee" ADD CONSTRAINT "_UserSubTaskAssignee_A_fkey" FOREIGN KEY ("A") REFERENCES "SubTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserSubTaskAssignee" ADD CONSTRAINT "_UserSubTaskAssignee_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
