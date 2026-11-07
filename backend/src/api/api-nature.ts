import { MainClient } from 'pokenode-ts';

import {
  Injectable,
  Logger,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NatureImportService {
  private readonly api = new MainClient();
  private readonly logger = new Logger(NatureImportService.name);

  constructor(private readonly prisma: PrismaService) {}

  async importNatures(): Promise<void> {
    this.logger.log('[NatureImportService] Starting move import...');
    try {
      const natureDetail = await this.api.pokemon.listNatures(0, 100);

      for (const natureEntry of natureDetail.results) {
        const natureDetails = await this.api.pokemon.getNatureByName(
          natureEntry.name,
        );

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

      this.logger.log('[NatureImportService] Natures successfully imported.');
    } catch (error) {
      this.logger.error(
        '[NatureImportService] Error during nature import.',
        error,
      );
    }
  }
}
