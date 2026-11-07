import { Module } from '@nestjs/common';

import { AbilityImportService } from './api/api-abilities';
import { MoveImportService } from './api/api-moves';
import { NatureImportService } from './api/api-nature';
import { ApiPokemonService } from './api/api-pokemon';
import { TypeImportService } from './api/api-type';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService,
    PrismaService,
    ApiPokemonService,
    MoveImportService,
    AbilityImportService,
    NatureImportService,
    TypeImportService,
  ],
})
export class AppModule {}
