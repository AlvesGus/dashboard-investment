-- AlterTable
ALTER TABLE "exchanges" ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "exchanges" ADD CONSTRAINT "exchanges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
