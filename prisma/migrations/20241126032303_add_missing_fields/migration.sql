/*
  Warnings:

  - You are about to drop the column `driverName` on the `Ride` table. All the data in the column will be lost.
  - Added the required column `minKm` to the `Drivers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pricePerKm` to the `Drivers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Drivers" ADD COLUMN     "minKm" INTEGER NOT NULL,
ADD COLUMN     "pricePerKm" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Ride" DROP COLUMN "driverName";

-- AddForeignKey
ALTER TABLE "Ride" ADD CONSTRAINT "Ride_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Drivers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
