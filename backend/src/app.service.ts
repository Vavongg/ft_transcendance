import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';

import { MoveImportService } from './api/api-moves';
import { NatureImportService } from './api/api-nature';
import { ApiPokemonService } from './api/api-pokemon';
import { TypeImportService } from './api/api-type';

@Injectable()
export class ImportAllDataService implements OnApplicationBootstrap {
  private readonly logger = new Logger(ImportAllDataService.name);

  constructor(
    private readonly natureImport: NatureImportService,
    private readonly typeImport: TypeImportService,
    private readonly moveImport: MoveImportService,
    private readonly pokemonImport: ApiPokemonService,
  ) {}

  async onApplicationBootstrap() {
    this.logger.log('[ImportAllDataService] Starting move import');

    await this.natureImport.importNatures();
    await this.typeImport.importTypes();
    await this.moveImport.importMoves();
    await this.pokemonImport.importPokemons();
  }
}

