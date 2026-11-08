/*
  Warnings:

  - You are about to drop the column `category` on the `Move` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Move` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Pokemon` table. All the data in the column will be lost.
  - You are about to drop the `Ailment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AilmentMoves" DROP CONSTRAINT "_AilmentMoves_A_fkey";

-- DropForeignKey
ALTER TABLE "_AilmentMoves" DROP CONSTRAINT "_AilmentMoves_B_fkey";

-- AlterTable
ALTER TABLE "Move" DROP COLUMN "category",
DROP COLUMN "type",
ADD COLUMN     "ailmentChance" INTEGER,
ADD COLUMN     "critRate" INTEGER,
ADD COLUMN     "drain" INTEGER,
ADD COLUMN     "flinchChance" INTEGER,
ADD COLUMN     "healing" INTEGER,
ADD COLUMN     "maxHits" INTEGER,
ADD COLUMN     "maxTurns" INTEGER,
ADD COLUMN     "minHits" INTEGER,
ADD COLUMN     "minTurns" INTEGER,
ADD COLUMN     "statChance" INTEGER;

-- AlterTable
ALTER TABLE "Pokemon" DROP COLUMN "type";

-- DropTable
DROP TABLE "Ailment";

-- DropEnum
DROP TYPE "CategoryClass";

-- CreateTable
CREATE TABLE "MoveDamageClass" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "MoveDamageClass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovesAilment" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "MovesAilment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Type" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "spritsType" TEXT,

    CONSTRAINT "Type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DamageRelation" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "DamageRelation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DamageClass" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_DamageClass_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_MoveType" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_MoveType_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_PokemonType" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PokemonType_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_DamageRelationType" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_DamageRelationType_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "MoveDamageClass_name_key" ON "MoveDamageClass"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MovesAilment_name_key" ON "MovesAilment"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Type_name_key" ON "Type"("name");

-- CreateIndex
CREATE INDEX "_DamageClass_B_index" ON "_DamageClass"("B");

-- CreateIndex
CREATE INDEX "_MoveType_B_index" ON "_MoveType"("B");

-- CreateIndex
CREATE INDEX "_PokemonType_B_index" ON "_PokemonType"("B");

-- CreateIndex
CREATE INDEX "_DamageRelationType_B_index" ON "_DamageRelationType"("B");

-- AddForeignKey
ALTER TABLE "_DamageClass" ADD CONSTRAINT "_DamageClass_A_fkey" FOREIGN KEY ("A") REFERENCES "Move"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DamageClass" ADD CONSTRAINT "_DamageClass_B_fkey" FOREIGN KEY ("B") REFERENCES "MoveDamageClass"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AilmentMoves" ADD CONSTRAINT "_AilmentMoves_A_fkey" FOREIGN KEY ("A") REFERENCES "Move"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AilmentMoves" ADD CONSTRAINT "_AilmentMoves_B_fkey" FOREIGN KEY ("B") REFERENCES "MovesAilment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MoveType" ADD CONSTRAINT "_MoveType_A_fkey" FOREIGN KEY ("A") REFERENCES "Move"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MoveType" ADD CONSTRAINT "_MoveType_B_fkey" FOREIGN KEY ("B") REFERENCES "Type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PokemonType" ADD CONSTRAINT "_PokemonType_A_fkey" FOREIGN KEY ("A") REFERENCES "Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PokemonType" ADD CONSTRAINT "_PokemonType_B_fkey" FOREIGN KEY ("B") REFERENCES "Type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DamageRelationType" ADD CONSTRAINT "_DamageRelationType_A_fkey" FOREIGN KEY ("A") REFERENCES "DamageRelation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DamageRelationType" ADD CONSTRAINT "_DamageRelationType_B_fkey" FOREIGN KEY ("B") REFERENCES "Type"("id") ON DELETE CASCADE ON UPDATE CASCADE;
