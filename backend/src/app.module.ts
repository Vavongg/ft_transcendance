import { Module } from '@nestjs/common';

import { MoveImportService } from './api/api-moves';
import { ApiPokemonService } from './api/api-Pokemon';
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
  ],
})
export class AppModule {}
