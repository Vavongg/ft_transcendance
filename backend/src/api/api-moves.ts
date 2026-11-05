import { MoveClient } from 'pokenode-ts';

import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MoveImportService implements OnApplicationBootstrap {
  private readonly moveClient = new MoveClient();
  private readonly logger = new Logger(MoveImportService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onApplicationBootstrap() {
    await this.importMoves();
  }

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

        //'generation-i' = génération 1
        // if (moveDetails.generation?.name !== 'generation-i') {
        //   continue; // Ignore cette attaque et passe à la suivante
        // }

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
            type: moveDetails.type.name,
            power: moveDetails.power ?? null,
            accuracy: moveDetails.accuracy ?? null,
            pp: moveDetails.pp ?? null,
            //description: cleanDescription,
          },
        });

        count++;
        //this.logger.log(`[MoveImportService] [${count}] Added Move : ${moveDetails.name}`);
      }
      this.logger.log('[MoveImportService] Successfully imported moves!');
    } catch (error) {
      this.logger.error('[MoveImportService] Error importing moves:', error);
    }
  }
}
