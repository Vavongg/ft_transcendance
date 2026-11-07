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

  async importTypes(): Promise<void> {
    this.logger.log('[TypeImportService] Starting abilities import...');
    try {
      const typeDetails = await this.api.pokemon.listTypes();

      for (const typeEntry of typeDetails.results) {
        const typeDetails = await this.api.pokemon.getTypeByName(
          typeEntry.name,
        );

        const spriteUrl =
          typeDetails.sprites?.['generation-vii']?.['sun-moon']?.name_icon ||
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
      }

      this.logger.log('[TypeImportService] Type successfully imported!');
    } catch (error) {
      this.logger.error('[TypeImportService] Error during type import', error);
    }
  }
}

@Injectable()
export class TypeRelationImportService {
  private readonly api = new MainClient();
  private readonly logger = new Logger(TypeRelationImportService.name);

  constructor(private readonly prisma: PrismaService) {}

  async importTypeRelationType(): Promise<void> {
    this.logger.log('[TypeRelationImportService] Starting abilities import...');
    try {
      const relationDetails = await this.api.pokemon.listTypes();

      for (const relationEntry of relationDetails.results) {
        const typeDetails = await this.api.pokemon.getTypeByName(
          relationEntry.name,
        );
        
        const doubleDamageTo = typeDetails.damage_relations.double_damage_to;

        await this.prisma.type.update({
          where: { id: typeDetails.id },
          data: {
            damageRelation: {
              connectOrCreate: doubleDamageTo.map((target) => ({
                where: { name: target.name }, 
                create: {
                  name: target.name,
          },
        })),
            },
          },
        });
      }

      this.logger.log(
        '[TypeRelationImportService] Damage Relation Type successfully imported!',
      );
    } catch (error) {
      this.logger.error(
        '[TypeRelationImportService] Error during damage relation type import',
        error,
      );
    }
  }
}
