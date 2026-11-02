import { writeFile} from 'node:fs/promises'
import {existsSync} from 'node:fs'


async function extractPokemonApi(){
    console.log("Début de l'extraction de l'API des Pokémon...");
    const Pokemon = [];
    try {
        for(let id = 1; id <= 151; id++)
        {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            if (!res.ok) {
                throw new Error(`Erreur HTTP ${res.status} pour le Pokémon ID ${id}`);
            }
            const data = await res.json();
            const res2 = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
            if (!res2.ok) {
                throw new Error(`Erreur HTTP ${res2.status} pour le Pokémon ID ${id}`);
            }
            const getNames = await res2.json();
            const element = getNames.names.find((item) => item.language.name === 'fr');
            if(!element || !element.name){
                throw new Error(`Erreur HTTP pour le nom français du Pokémon ID ${id}`);
            }
            const nameFr = element.name;
            //const stats [] = ; //atk, atk spe, def, def spe, vitesse, hp
            //const types = ;
            //const abilities = ;
            //const moves[] = ;
            Pokemon.push({ id, name: data.name, nameFr })
            console.log(`[${id}/151] Ajouté : ${nameFr} (${data.name})`);
        }
        const filePath = 'database/seeds/pokemons.json';
        await writeFile(filePath, JSON.stringify(Pokemon, null, 2));
        console.log("✅ Importation terminée avec succès !");
    }
    catch(error) {
        console.error("❌ Oups, une erreur est survenue pendant l'importation :", error);
    }
}

await extractPokemonApi()