import { MainClient } from 'pokenode-ts';

import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TypeImportService implements OnApplicationBootstrap {
    private readonly TypeClient = new MainClient();
    private readonly logger = new Logger(TypeImportService.name);

    constructor(private readonly prisma: PrismaService) {}

    async onApplicationBootstrap() {
        await this.importType();
    }

    async importType(): Promise<void> {

    }
}