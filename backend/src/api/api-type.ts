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

  private extractIdFromUrl(url: string): number {
    const segments = url.split('/').filter(Boolean);
    const lastSegment = segments.pop() ?? '0';
    return parseInt(lastSegment, 10);
  }

  private formatConnectRelation(relations: { url: string }[] | undefined) {
    if (!relations || relations?.length === 0) {
      return { set: [] };
    }

    const ids = relations
      .map((target) => this.extractIdFromUrl(target.url))
      .filter((id) => id > 0 && id <= 18);

    if (ids.length === 0) {
      return { set: [] };
    }
    return { set: [], connect: ids.map((id) => ({ id })) };
  }

  async importTypes(): Promise<void> {
    this.logger.log('[TypeImportService] Starting abilities import...');
    try {
      const typeList = await this.api.pokemon.listTypes(0, 18);
      const allTypeDetails = [];

      for (const typeEntry of typeList.results) {
        const typeDetails = await this.api.pokemon.getTypeByName(
          typeEntry.name,
        );
        allTypeDetails.push(typeDetails);

        const spriteUrl =
          typeDetails.sprites?.['generation-ix']?.['scarlet-violet']
            ?.name_icon || null;

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
      }

      for (const typeItem of allTypeDetails) {
        await this.prisma.type.update({
          where: { id: typeItem.id },
          data: {
            doubleDamageTo: this.formatConnectRelation(
              typeItem.damage_relations.double_damage_to,
            ),
            doubleDamageFrom: this.formatConnectRelation(
              typeItem.damage_relations.double_damage_from,
            ),
            halfDamageTo: this.formatConnectRelation(
              typeItem.damage_relations.half_damage_to,
            ),
            halfDamageFrom: this.formatConnectRelation(
              typeItem.damage_relations.half_damage_from,
            ),
            noDamageTo: this.formatConnectRelation(
              typeItem.damage_relations.no_damage_to,
            ),
            noDamageFrom: this.formatConnectRelation(
              typeItem.damage_relations.no_damage_from,
            ),
          },
        });
      }
      this.logger.log('[TypeImportService] Type successfully imported!');
    } catch (error) {
      this.logger.error('[TypeImportService] Error during type import', error);
    }
  }
}
