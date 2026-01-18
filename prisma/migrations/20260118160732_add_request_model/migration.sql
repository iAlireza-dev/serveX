-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('OPEN', 'ASSIGNED');

-- CreateTable
CREATE TABLE "Request" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "pricePerHour" INTEGER NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'OPEN',
    "customerId" TEXT NOT NULL,
    "specialistId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_specialistId_fkey" FOREIGN KEY ("specialistId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
