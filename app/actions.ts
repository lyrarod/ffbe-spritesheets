import { characters } from "@/characters";
import { generateSlug } from "@/lib/utils";

export function getCharacters() {
  return characters.map((character) => {
    return {
      ...character,
      animations: character.animations.map((animation) => ({
        ...animation,
        sprite: `/${generateSlug(character.name)}/${animation.sprite}`,
      })),
      slug: generateSlug(character.name),
    };
  });
}

export function getCharacterBySlug(slug: string) {
  const characters = getCharacters();
  return characters.find((character) => character.slug === slug);
}
