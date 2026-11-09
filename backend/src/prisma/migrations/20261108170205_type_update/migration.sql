/*
  Warnings:

  - You are about to drop the `TypeRelation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DamageRelationType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_DamageRelationType" DROP CONSTRAINT "_DamageRelationType_A_fkey";

-- DropForeignKey
ALTER TABLE "_DamageRelationType" DROP CONSTRAINT "_DamageRelationType_B_fkey";

-- AlterTable
ALTER TABLE "Type" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Type_id_seq";

-- DropTable
DROP TABLE "TypeRelation";

-- DropTable
DROP TABLE "_DamageRelationType";

-- CreateTable
CREATE TABLE "_DoubleDamage" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_DoubleDamage_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_HalfDamage" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_HalfDamage_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_NoDamage" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_NoDamage_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_DoubleDamage_B_index" ON "_DoubleDamage"("B");

-- CreateIndex
CREATE INDEX "_HalfDamage_B_index" ON "_HalfDamage"("B");

-- CreateIndex
CREATE INDEX "_NoDamage_B_index" ON "_NoDamage"("B");

-- AddForeignKey
ALTER TABLE "_DoubleDamage" ADD CONSTRAINT "_DoubleDamage_A_fkey" FOREIGN KEY ("A") REFERENCES "Type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DoubleDamage" ADD CONSTRAINT "_DoubleDamage_B_fkey" FOREIGN KEY ("B") REFERENCES "Type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HalfDamage" ADD CONSTRAINT "_HalfDamage_A_fkey" FOREIGN KEY ("A") REFERENCES "Type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HalfDamage" ADD CONSTRAINT "_HalfDamage_B_fkey" FOREIGN KEY ("B") REFERENCES "Type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NoDamage" ADD CONSTRAINT "_NoDamage_A_fkey" FOREIGN KEY ("A") REFERENCES "Type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NoDamage" ADD CONSTRAINT "_NoDamage_B_fkey" FOREIGN KEY ("B") REFERENCES "Type"("id") ON DELETE CASCADE ON UPDATE CASCADE;
