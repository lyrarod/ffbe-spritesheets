import { getCharacters } from "@/app/actions";

export default function Home() {
  const characters = getCharacters();
  return (
    <section className="container flex items-center justify-center py-10">
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {characters.map((character, i) => {
          return (
            <a key={i} href={`/${character.slug}`}>
              <li className="flex flex-col space-y-1 overflow-hidden transition border rounded shadow group hover:border-primary">
                <img
                  src={`/${character.slug}/${character.image}`}
                  alt={character.name}
                  className="object-scale-down w-full transition h-28 group-hover:scale-110"
                  style={{ imageRendering: "pixelated" }}
                />
                <span className="flex items-center justify-center p-1 transition bg-border group-hover:bg-primary">
                  <p className="text-xs transition text-foreground/50 group-hover:text-foreground/100">
                    {character.name}
                  </p>
                </span>
              </li>
            </a>
          );
        })}
      </ul>
    </section>
  );
}
