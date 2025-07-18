/*
  Warnings:

  - You are about to drop the column `idClient` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `idClient` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `idClient` on the `Receipt` table. All the data in the column will be lost.
  - You are about to drop the `Client` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `userId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Receipt` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_idClient_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_idClient_fkey";

-- DropForeignKey
ALTER TABLE "Receipt" DROP CONSTRAINT "Receipt_idClient_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "idClient",
ADD COLUMN     "userId" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "idClient",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Receipt" DROP COLUMN "idClient",
ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Client";

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
