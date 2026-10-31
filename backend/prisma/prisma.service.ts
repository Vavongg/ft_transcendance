import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect(); // connection à la base de données
  }

  async onModuleDestroy() {
    await this.$disconnect(); // déconnection à l'arrêt de l'app
  }
}
