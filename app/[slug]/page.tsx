import { CanvasComponent } from "@/components/canvas";
import { getCharacterBySlug } from "../actions";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const character = getCharacterBySlug(slug);

  if (!character) redirect("/");

  return (
    <section>
      <CanvasComponent character={character} />
    </section>
  );
}
