-- AlterTable
ALTER TABLE "SubTask" ADD COLUMN     "description" TEXT,
ADD COLUMN     "documents" TEXT[],
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Not Started';
