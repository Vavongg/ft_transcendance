import { MainClient } from 'pokenode-ts';

import {
  Injectable,
  Logger,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TypeImportService {
    private readonly TypeClient = new MainClient();
    private readonly logger = new Logger(TypeImportService.name);

    constructor(private readonly prisma: PrismaService) {}

    async importTypes(): Promise<void> {

    }
}