import { MainClient } from 'pokenode-ts';

import {
  Injectable,
  Logger,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TypeImportService {
  private readonly api = new MainClient();
  private readonly logger = new Logger(TypeImportService.name);

  constructor(private readonly prisma: PrismaService) {}

  private filterType(relations: Array<{ name: string; url: string}>) {
    return relations.filter((target) => {
      const segments = target.url.split('/').filter(Boolean);
      const lastSegment = segments.pop()?? '';
      const id = parseInt(lastSegment, 10);
      return id <= 18;
    });
  }

  async importTypes(): Promise<void> {
    this.logger.log('[TypeImportService] Starting abilities import...');
    try {
      const typeList = await this.api.pokemon.listTypes(0, 18);

      for (const typeEntry of typeList.results) {
        const typeDetails = await this.api.pokemon.getTypeByName(
          typeEntry.name,
        );

        const spriteUrl =
          typeDetails.sprites?.['generation-ix']?.['scarlet-violet']?.name_icon ||
          null;

        await this.prisma.type.upsert({
          where: { id: typeDetails.id },
          update: {
            name: typeDetails.name,
            spritesType: spriteUrl,
          },
          create: {
            id: typeDetails.id,
            name: typeDetails.name,
            spritesType: spriteUrl,
          },
        });

        for (const typeEntry of typeList.results) {
        const typeDetails = await this.api.pokemon.getTypeByName(typeEntry.name);

        const doubleDamageTo = this.filterType(typeDetails.damage_relations.double_damage_to);
        const halfDamageTo = this.filterType(typeDetails.damage_relations.half_damage_to);
        const noDamageTo = this.filterType(typeDetails.damage_relations.no_damage_to);

        const doubleDamageFrom = this.filterType(typeDetails.damage_relations.double_damage_from);
        const halfDamageFrom = this.filterType(typeDetails.damage_relations.half_damage_from);
        const noDamageFrom = this.filterType(typeDetails.damage_relations.no_damage_from);
        
        await this.prisma.type.update({
          where: { id: typeDetails.id },
          data: {
            doubleDamageTo: {
              set: doubleDamageTo.map((target) => ({ name: target.name })),
            },
            halfDamageTo: {
              set: halfDamageTo.map((target) => ({ name: target.name })),
            },
            noDamageTo: {
              set: noDamageTo.map((target) => ({ name: target.name })),
            },
            doubleDamageFrom: {
              set: doubleDamageFrom.map((target) => ({ name: target.name })),
            },
            halfDamageFrom: {
              set: halfDamageFrom.map((target) => ({ name: target.name })),
            },
            noDamageFrom: {
              set: noDamageFrom.map((target) => ({ name: target.name })),
            },
          },
        });
      }
    }
      this.logger.log('[TypeImportService] Type successfully imported!');
    } catch (error) {
      this.logger.error('[TypeImportService] Error during type import', error);
    }
  }
}
