#!/bin/sh
set -e

echo "[Backend] Initialisation des services..."

# 1. Génération du client Prisma
echo "[Backend] Génération du Prisma Client..."
npx prisma generate --schema=src/prisma/schema

# 2. Exécution des migrations BDD
echo "[Backend] Application des migrations PostgreSQL..."
npx prisma migrate deploy --schema=src/prisma/schema

# 3. Lancement du Seed
echo "[Backend] Insertion du dataset Pokémon..."
npx prisma db seed || echo "[Backend] Le seed a été ignoré ou a échoué."

echo "[Backend] Base de données prête !"

# Transmettre la main à NestJS (CMD du Dockerfile)
exec "$@"