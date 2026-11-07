import { MainClient } from 'pokenode-ts';

import {
  Injectable,
  Logger,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { AbilityImportService } from './api-abilities';
import { MoveImportService } from './api-moves';
import { TypeImportService } from './api-type';

@Injectable()
export class ApiPokemonService {
  private readonly api = new MainClient();
  private readonly logger = new Logger(ApiPokemonService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly typeImportService: TypeImportService, 
    private readonly moveImportService: MoveImportService,
    private readonly abilityImportService: AbilityImportService,
  ) {}

  // Fonction de récupération && d'insertion des Pokémon
  async importPokemons() {
    let count = 0;
    const maxPokemons = 807;

    try {
      this.logger.log('[ApiPokemonService] Starting Pokemon import...');
      // Parcourt toutes les pages de la liste des Pokémon en utilisant la pagination
      for await (const pokemon of this.api.pokemon.paginate('listPokemons', {
        pageSize: 50,
        resolve: true, // permet de récupérer les détails complets de chaque Pokémon
      })) {
        if (count >= maxPokemons) {
          break;
        }

        // Pour chaque Pokemon
        try {
          const sortName = [
            pokemon.species.name,
            pokemon.name,
            pokemon.name.split('-')[0],
          ];
          const finalName = Array.from(new Set(sortName.filter(Boolean)));

          let species = null;
          for (const nameTry of finalName) {
            try {
              species = await this.api.pokemon.getPokemonSpeciesByName(nameTry);
              break;
            } catch (e) {}
          }
          if (!species) {
            throw new Error('Failure for repecuration of Pokemon name.');
          }

          // Récupérer les informations de l'espèce: base_happiness, gender_rate, etc.
          const genderRate = species.gender_rate;
          const ratioValue = genderRate === -1 ? 0 : genderRate / 8;

          const baseHappinessValue = species.base_happiness ?? 70;

          const getStats = (statName: string) =>
            pokemon.stats.find((s) => s.stat.name === statName)?.base_stat ?? 0;

          // Récupérer uniquement les talents du pokemon concerné
          const abilityNames = pokemon.abilities.map((a) => a.ability.name);

          // Vérifier que les talents existent dans la base
          const existingAbility = await this.prisma.pokemonAbility.findMany({
            where: { name: { in: abilityNames } },
            //select: { name: true },
          });

          const addingAbility = existingAbility.map((a) => a.name);

          // Récupérer uniquement les attaques du pokémon concerné
          const MoveNames = pokemon.moves.map((m) => m.move.name);

          // Vérifier que les attaques existent dans la base
          const existingMoves = await this.prisma.move.findMany({
            where: { name: { in: MoveNames } },
            //select: { name: true },
          });

          const addingMoves = existingMoves.map((m) => m.name);

          //Import des Sprites
          const createSprite = await this.prisma.pokemonSprite.upsert({
            where: { id: pokemon.id },
            update: {
              front_default: pokemon.sprites.front_default,
              front_shiny: pokemon.sprites.front_shiny,
              front_female: pokemon.sprites.front_female,
              front_shiny_female: pokemon.sprites.front_shiny_female,
              back_default: pokemon.sprites.back_default,
              back_shiny: pokemon.sprites.back_shiny,
              back_female: pokemon.sprites.back_female,
              back_shiny_female: pokemon.sprites.back_shiny_female,
            },
            create: {
              id: pokemon.id,
              front_default: pokemon.sprites.front_default,
              front_shiny: pokemon.sprites.front_shiny,
              front_female: pokemon.sprites.front_female,
              front_shiny_female: pokemon.sprites.front_shiny_female,
              back_default: pokemon.sprites.back_default,
              back_shiny: pokemon.sprites.back_shiny,
              back_female: pokemon.sprites.back_female,
              back_shiny_female: pokemon.sprites.back_shiny_female,
            },
          });

          const uniqueAbilities = Array.from(new Set(addingAbility));
          const uniqueMoves = Array.from(new Set(addingMoves));

          // Ajouter chaque Pokémon dans la base de données via Prisma
          await this.prisma.pokemon.upsert({
            where: { id: pokemon.id },
            update: {
              ability: {
                set: uniqueAbilities.map((name) => ({ name })),
              },

              moves: {
                set: uniqueMoves.map((name) => ({ name })),
              },
            },
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

              ability: {
                connect: uniqueAbilities.map((name) => ({ name })),
              },

              moves: {
                connect: uniqueMoves.map((name) => ({ name })),
              },

              spriteId: createSprite.id,
            },
          });

          this.logger.log(`[${count + 1}] Added Pokemon : ${pokemon.name}`);
          count++;
        } catch (pokemonError) {
          // Affiche l'erreur d'un Pokémon spécifique sans couper la boucle globale
          this.logger.error(
            `Erreur sur le Pokémon ${pokemon.name} (ID: ${pokemon.id}):`,
            pokemonError,
          );
        }
      }

      this.logger.log('[ApiPokemonService] Pokemon successfully imported!');
    } catch (error) {
      this.logger.error(
        '[ApiPokemonService] Error during Pokemons import',
        error,
      );
    }
  }
}
