import { MainClient } from 'pokenode-ts';

import {
  Injectable,
  Logger,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AbilityImportService {
  private readonly api = new MainClient();
  private readonly logger = new Logger(AbilityImportService.name);

  constructor(private readonly prisma: PrismaService) {}

  async importAbility() {
    try {
      this.logger.log('[AbilityImportService] Starting abilities import...');
      const abilityDetail = await this.api.pokemon.listAbilities(0, 500);

      for (const abilityEntry of abilityDetail.results) {
        const abilityDetails = await this.api.pokemon.getAbilityByName(
          abilityEntry.name,
        );

        //Récupérer les effets en anglais pour le moment
        const effectEntry = abilityDetails.effect_entries.find(
          (e) => e.language.name === 'en',
        );

        await this.prisma.pokemonAbility.upsert({
          where: { id: abilityDetails.id },
          update: {},
          create: {
            id: abilityDetails.id,
            name: abilityDetails.name,
            effect: effectEntry ? effectEntry.effect : null,
          },
        });
      }
      
      this.logger.log(
        '[AbilityImportService] Abilities successfully imported!',
      );
    } catch (error) {
      this.logger.error(
        '[AbilityImportService] Error during abilities import',
        error,
      );
    }
  }
}
