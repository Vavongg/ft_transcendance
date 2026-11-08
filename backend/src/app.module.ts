import { Module } from '@nestjs/common';

import { AbilityImportService } from './api/api-abilities';
import {
  MoveAilmentImportService,
  MoveDamageClassImportService,
  MoveImportService,
} from './api/api-moves';
import { NatureImportService } from './api/api-nature';
import { ApiPokemonService } from './api/api-pokemon';
import {
  TypeImportService,
  TypeRelationImportService,
} from './api/api-type';
import { ImportController } from './app.controller';
import { ImportAllDataService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [],
  controllers: [ImportController],
  providers: [
    ImportAllDataService,
    PrismaService,
    ApiPokemonService,
    MoveImportService,
    MoveDamageClassImportService,
    MoveAilmentImportService,
    AbilityImportService,
    NatureImportService,
    TypeImportService,
    TypeRelationImportService,
  ],
})
export class AppModule {}
