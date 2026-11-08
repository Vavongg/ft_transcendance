import {
  Controller,
  Post,
} from '@nestjs/common';

import { ImportAllDataService } from './app.service';

@Controller('import')
export class ImportController {
  constructor(private readonly importAllDataService: ImportAllDataService) {}

  @Post()
  async triggerImport() {
    await this.importAllDataService.runAllImport();
    return { message: 'Import completed successfully!' };
}
}
