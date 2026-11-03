import { MainClient } from 'pokenode-ts';

import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';

import {
  PrismaService,
} from '../prisma/prisma.service'; // Ajustez le chemin relatif vers votre prisma.service

@Injectable()
export class ApiPokemonService implements OnApplicationBootstrap {
  private readonly api = new MainClient();
  private readonly logger = new Logger(ApiPokemonService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onApplicationBootstrap() {
    await this.listGen1Pokemons();
  }

  // Fonction de récupération && d'insertion des Pokémon
  async listGen1Pokemons() {
    let count = 0;
    const maxPokemons = 151;

    try {
      // Parcourt toutes les pages de la liste des Pokémon en utilisant la pagination
      for await (const pokemon of this.api.pokemon.paginate('listPokemons', {
        pageSize: 50,
        resolve: true, // permet de récupérer les détails complets de chaque Pokémon
      })) {
        if (count >= maxPokemons) {
          break;
        }

        // Ajouter chaque Pokémon dans la base de données via Prisma
        await this.prisma.pokemon.upsert({
          where: { id: pokemon.id },
          update: {},
          create: {
            id: pokemon.id,
            name: pokemon.name,
            type: pokemon.types.map((t) => t.type.name).join(', '),
            level: 100,
            stats: pokemon.stats as any,
          },
        });

        this.logger.log(`[${count + 1}] Added Pokemon : ${ pokemon.name}`);
        count++;
      }

      this.logger.log('Gen1 Importation successful !');
    } catch (error) {
      this.logger.error("Error during Gen1 import", error);
    }
  }
}
