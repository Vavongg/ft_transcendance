import { MainClient } from 'pokenode-ts';

import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { MoveImportService } from './api-moves';

import

@Injectable()
export class ApiPokemonService implements OnApplicationBootstrap {
  private readonly api = new MainClient();
  private readonly logger = new Logger(ApiPokemonService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly moveImportService: MoveImportService,
  ) {}

  async onApplicationBootstrap() {
    await this.moveImportService.importMoves();
    await this.importGen1Pokemons();
  }

  // Fonction de récupération && d'insertion des Pokémon
  async importGen1Pokemons() {
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

        // Récupérer les informations de l'espèce: base_happiness, gender_rate, etc.
        const species = await this.api.pokemon.getPokemonSpeciesByName(
          pokemon.name,
        );

        const genderRate = species.gender_rate;
        const ratioValue = genderRate === -1 ? 0 : genderRate / 8;

        const baseHappinessValue = species.base_happiness ?? 70;

        const getStats = (statName: string) =>
          pokemon.stats.find((s) => s.stat.name === statName)?.base_stat ?? 0;

        // Récupérer uniquement les attaques de du pokémon concerné
        const MoveNames = pokemon.moves.map((m) => m.move.name);

        // Ajouter chaque Pokémon dans la base de données via Prisma
        await this.prisma.pokemon.upsert({
          where: { id: pokemon.id },
          update: {},
          create: {
            id: pokemon.id,
            name: pokemon.name,
            type: pokemon.types.map((t) => t.type.name).join(', '),
            level: 100,

            //Base stats
            hp: getStats('hp'),
            atk: getStats('attack'),
            def: getStats('defense'),
            spAtk: getStats('special-attack'),
            spDef: getStats('special-defense'),
            speed: getStats('speed'),

            //Gender ratio
            ratio: ratioValue, 

            //Base happiness
            baseHappiness: baseHappinessValue, 

            moves: {
              connect: MoveNames.map((moveName) => ({ name: moveName })),
            },

            sprite: {
              create: {
                front_default: pokemon.sprites.front_default,
                front_shiny: pokemon.sprites.front_shiny,
                front_female: pokemon.sprites.front_female,
                front_shiny_female: pokemon.sprites.front_shiny_female,
                back_default: pokemon.sprites.back_default,
                back_shiny: pokemon.sprites.back_shiny,
                back_female: pokemon.sprites.back_female,
                back_shiny_female: pokemon.sprites.back_shiny_female,
              },
            },
          },
        });

        //this.logger.log(`[${count + 1}] Added Pokemon : ${pokemon.name}`);
        count++;
      }

      this.logger.log('[ApiPokemonService] Gen1 Importation successful !');
    } catch (error) {
      this.logger.error('[ApiPokemonService] Error during Gen1 import', error);
    }
  }
}
