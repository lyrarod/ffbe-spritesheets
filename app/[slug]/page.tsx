import type { Metadata } from "next";

import { redirect } from "next/navigation";
import { getCharacterBySlug } from "../actions";
import { CanvasComponent } from "@/components/canvas";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const character = getCharacterBySlug(slug);

  return {
    title: character?.name,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const character = getCharacterBySlug(slug);

  if (!character) redirect("/");

  return <CanvasComponent character={character} />;
}
