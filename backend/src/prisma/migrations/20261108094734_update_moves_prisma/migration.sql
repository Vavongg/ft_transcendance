/*
  Warnings:

  - You are about to drop the column `spritsType` on the `Type` table. All the data in the column will be lost.
  - You are about to drop the `DamageRelation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_DamageRelationType" DROP CONSTRAINT "_DamageRelationType_A_fkey";

-- DropForeignKey
ALTER TABLE "_DamageRelationType" DROP CONSTRAINT "_DamageRelationType_B_fkey";

-- AlterTable
ALTER TABLE "Move" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Move_id_seq";

-- AlterTable
ALTER TABLE "Type" DROP COLUMN "spritsType",
ADD COLUMN     "spritesType" TEXT;

-- DropTable
DROP TABLE "DamageRelation";

-- CreateTable
CREATE TABLE "TypeRelation" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "TypeRelation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TypeRelation_name_key" ON "TypeRelation"("name");

-- AddForeignKey
ALTER TABLE "_DamageRelationType" ADD CONSTRAINT "_DamageRelationType_A_fkey" FOREIGN KEY ("A") REFERENCES "Type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DamageRelationType" ADD CONSTRAINT "_DamageRelationType_B_fkey" FOREIGN KEY ("B") REFERENCES "TypeRelation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
