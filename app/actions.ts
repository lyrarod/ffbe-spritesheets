import { characters } from "@/characters";
import { generateSlug } from "@/lib/utils";

export function getCharacters() {
  return characters.map((character) => {
    const slug = generateSlug(character.name);

    return {
      ...character,
      animations: character.animations.map((animation) => ({
        ...animation,
        sprite: `/${slug}/${animation.sprite}`,
      })),
      slug,
    };
  });
}

export function getCharacterBySlug(slug: string) {
  const characters = getCharacters();
  return characters.find((character) => character.slug === slug);
}
