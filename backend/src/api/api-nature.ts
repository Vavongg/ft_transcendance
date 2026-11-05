import { MainClient } from 'pokenode-ts';

import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NatureImportService implements OnApplicationBootstrap {
  private readonly api = new MainClient();
  private readonly logger = new Logger(NatureImportService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onApplicationBootstrap() {
    await this.importNatures();
  }

  async importNatures() {
    try {
      const natureDetail = await this.api.pokemon.listNatures();

      for (const natureEntry of natureDetail.results) {
        const natureDetails = await this.api.pokemon.getNatureByName(natureEntry.name);

        await this.prisma.nature.upsert({
          where: { id: natureDetails.id },
          update: {},
          create: {
            id: natureDetails.id,
            natureName: natureDetails.name,
            decreasedStat: natureDetails.decreased_stat?.name ?? null,
            increasedStat: natureDetails.increased_stat?.name ?? null,
          },
        });
      }

      this.logger.log('[NatureImportService] Natures imported successfully.');
    } catch (error) {
      this.logger.error(
        '[NatureImportService] Error importing natures:',
        error,
      );
    }
  }
}
