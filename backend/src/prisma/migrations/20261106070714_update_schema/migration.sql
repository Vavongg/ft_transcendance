/*
  Warnings:

  - You are about to drop the column `accuracy` on the `Move` table. All the data in the column will be lost.
  - You are about to drop the column `nameDE` on the `Move` table. All the data in the column will be lost.
  - You are about to drop the column `nameFR` on the `Move` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Move" DROP COLUMN "accuracy",
DROP COLUMN "nameDE",
DROP COLUMN "nameFR",
ADD COLUMN     "accurancy" INTEGER;

-- AlterTable
ALTER TABLE "Nature" ALTER COLUMN "decreasedStat" DROP NOT NULL,
ALTER COLUMN "increasedStat" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Pokemon" ALTER COLUMN "ratio" SET DEFAULT -1,
ALTER COLUMN "ratio" SET DATA TYPE DOUBLE PRECISION;
