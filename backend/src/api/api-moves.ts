import { MoveClient } from 'pokenode-ts';

import {
  Injectable,
  Logger,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MoveImportService {
  private readonly moveClient = new MoveClient();
  private readonly logger = new Logger(MoveImportService.name);

  constructor(private readonly prisma: PrismaService) {}

  async importMoves(): Promise<void> {
    this.logger.log('[MoveImportService] Starting move import...');
    try {
      let count = 0;
      // Trouver toutes les attaques par pagination
      for await (const moveSummary of this.moveClient.paginate('listMoves', {
        pageSize: 50,
        resolve: true,
      })) {
        const moveDetails = await this.moveClient.getMoveByName(
          moveSummary.name,
        );

        // // Récupérer le FR
        // const frFlavorTextEntry = moveDetails.flavor_text_entries.find(
        //   (entry) => entry.language.name === 'fr',
        // );
        // // Nettoyer les caractères spéciaux et sauts de texte etc.
        // const cleanDescription = frFlavorTextEntry
        //   ? frFlavorTextEntry.flavor_text.replace(/[\n\f\r]/g, ' ')
        //   : null;

        // Insertion de l'attaque en base de données
        await this.prisma.move.upsert({
          where: { name: moveDetails.name },
          update: {},
          create: {
            name: moveDetails.name,
            accurancy: moveDetails.accuracy ?? null,
            effectChance: moveDetails.effect_chance ?? null,
            pp: moveDetails.pp ?? null,
            priority: moveDetails.priority ?? null,
            power: moveDetails.power ?? null,

            minHits: moveDetails.meta?.min_hits,
            maxHits: moveDetails.meta?.max_hits,
            minTurns: moveDetails.meta?.min_turns,
            maxTurns: moveDetails.meta?.max_turns,
            drain: moveDetails.meta?.drain,
            healing: moveDetails.meta?.healing,
            critRate: moveDetails.meta?.crit_rate,
            ailmentChance: moveDetails.meta?.ailment_chance,
            flinchChance: moveDetails.meta?.flinch_chance,
            statChance: moveDetails.meta?.stat_chance,

            type: {
              connectOrCreate: [
                {
                  where: { name: moveDetails.type.name },
                  create: { name: moveDetails.type.name },
                },
              ],
            },
          },
        });

        count++;
        //this.logger.log(`[MoveImportService] [${count}] Added Move : ${moveDetails.name}`);
      }
      this.logger.log('[MoveImportService] Moves successfully imported!');
    } catch (error) {
      this.logger.error('[MoveImportService] Error during moves import', error);
    }
  }
}

@Injectable()
export class MoveDamageClassImportService {
  private readonly moveClient = new MoveClient();
  private readonly logger = new Logger(MoveDamageClassImportService.name);

  constructor(private readonly prisma: PrismaService) {}

  async importMoveDamageClass(): Promise<void> {
    this.logger.log('[MoveDamageClassImportService] Starting move import...');
    try {
      const moveDamageDetails = await this.moveClient.listMoveDamageClasses();

      for (const damageClassRef of moveDamageDetails.results) {
        const details = await this.moveClient.getMoveDamageClassByName(
          damageClassRef.name,
        );

        await this.prisma.moveDamageClass.upsert({
          where: { name: details.name },
          update: {},
          create: {
            name: details.name,
          },
        });
      }
      this.logger.log(
        '[MoveDamageImportService] Move damage classes successfully imported!',
      );
    } catch (error) {
      this.logger.error(
        '[MoveDamageImportService] Error during move damage import',
        error,
      );
    }
  }
}

@Injectable()
export class MoveAilmentImportService {
  private readonly moveClient = new MoveClient();
  private readonly logger = new Logger(MoveAilmentImportService.name);

  constructor(private readonly prisma: PrismaService) {}

  async importMoveAilment(): Promise<void> {
    this.logger.log('[MoveAilmentImportService] Starting move import...');
    try {
      const moveAilmentDetails = await this.moveClient.listMoveAilments();

      for (const ailmentRef of moveAilmentDetails.results) {
        const details = await this.moveClient.getMoveAilmentByName(
          ailmentRef.name,
        );

        await this.prisma.movesAilment.upsert({
          where: { name: details.name },
          update: {},
          create: {
            name: details.name,
          },
        });
      }
      this.logger.log(
        '[MoveAilmentImportService] Move ailments successfully imported!',
      );
    } catch (error) {
      this.logger.error(
        '[MoveAilmentImportService] Error during move ailment import',
        error,
      );
    }
  }
}
