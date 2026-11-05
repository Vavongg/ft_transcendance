-- CreateEnum
CREATE TYPE "CategoryClass" AS ENUM ('PHYSICAL', 'SPECIAL', 'STATUS');

-- CreateTable
CREATE TABLE "Stat" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Stat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nature" (
    "id" SERIAL NOT NULL,
    "natureName" TEXT NOT NULL,
    "decreasedStat" TEXT NOT NULL,
    "increasedStat" TEXT NOT NULL,

    CONSTRAINT "Nature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Move" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "nameFR" TEXT,
    "nameDE" TEXT,
    "type" TEXT NOT NULL,
    "power" INTEGER,
    "accuracy" INTEGER,
    "effectChance" INTEGER,
    "pp" INTEGER,
    "priority" INTEGER,
    "category" "CategoryClass",

    CONSTRAINT "Move_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ailment" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Ailment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pokemon" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "level" INTEGER NOT NULL,
    "hp" INTEGER NOT NULL DEFAULT 0,
    "atk" INTEGER NOT NULL DEFAULT 0,
    "def" INTEGER NOT NULL DEFAULT 0,
    "spAtk" INTEGER NOT NULL DEFAULT 0,
    "spDef" INTEGER NOT NULL DEFAULT 0,
    "speed" INTEGER NOT NULL DEFAULT 0,
    "ratio" INTEGER DEFAULT -1,
    "baseHappiness" INTEGER DEFAULT 70,
    "spriteId" INTEGER,

    CONSTRAINT "Pokemon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PokemonAbility" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "effect" TEXT,

    CONSTRAINT "PokemonAbility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PokemonSprite" (
    "id" SERIAL NOT NULL,
    "front_default" TEXT,
    "front_shiny" TEXT,
    "front_female" TEXT,
    "front_shiny_female" TEXT,
    "back_default" TEXT,
    "back_female" TEXT,
    "back_shiny" TEXT,
    "back_shiny_female" TEXT,

    CONSTRAINT "PokemonSprite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PokemonMoves" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PokemonMoves_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_AilmentMoves" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_AilmentMoves_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_PokemonAbilities" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PokemonAbilities_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Stat_name_key" ON "Stat"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Nature_natureName_key" ON "Nature"("natureName");

-- CreateIndex
CREATE UNIQUE INDEX "Move_name_key" ON "Move"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Ailment_name_key" ON "Ailment"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Pokemon_name_key" ON "Pokemon"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PokemonAbility_name_key" ON "PokemonAbility"("name");

-- CreateIndex
CREATE INDEX "_PokemonMoves_B_index" ON "_PokemonMoves"("B");

-- CreateIndex
CREATE INDEX "_AilmentMoves_B_index" ON "_AilmentMoves"("B");

-- CreateIndex
CREATE INDEX "_PokemonAbilities_B_index" ON "_PokemonAbilities"("B");

-- AddForeignKey
ALTER TABLE "Pokemon" ADD CONSTRAINT "Pokemon_spriteId_fkey" FOREIGN KEY ("spriteId") REFERENCES "PokemonSprite"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PokemonMoves" ADD CONSTRAINT "_PokemonMoves_A_fkey" FOREIGN KEY ("A") REFERENCES "Move"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PokemonMoves" ADD CONSTRAINT "_PokemonMoves_B_fkey" FOREIGN KEY ("B") REFERENCES "Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AilmentMoves" ADD CONSTRAINT "_AilmentMoves_A_fkey" FOREIGN KEY ("A") REFERENCES "Ailment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AilmentMoves" ADD CONSTRAINT "_AilmentMoves_B_fkey" FOREIGN KEY ("B") REFERENCES "Move"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PokemonAbilities" ADD CONSTRAINT "_PokemonAbilities_A_fkey" FOREIGN KEY ("A") REFERENCES "Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PokemonAbilities" ADD CONSTRAINT "_PokemonAbilities_B_fkey" FOREIGN KEY ("B") REFERENCES "PokemonAbility"("id") ON DELETE CASCADE ON UPDATE CASCADE;
