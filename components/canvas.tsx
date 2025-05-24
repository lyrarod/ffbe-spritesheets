"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Home,
  Lightbulb,
  LightbulbOff,
  Pause,
  Play,
  SquareIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Character } from "@/classe/character";

type CharacterTypo = {
  slug: string;
  name: string;
  image: string;
  animations: {
    name: string;
    width: number;
    height: number;
    frameX: number;
    frameY: number;
    sprite: string;
  }[];
};

export function CanvasComponent({ character }: { character: CharacterTypo }) {
  const [animation, setAnimation] = React.useState<Character | null>(null);
  const [selectedAnimation, setSelectedAnimation] = React.useState<string>("0");
  const [canvasWidth, setCanvasWidth] = React.useState<number>(
    character.animations[Number(selectedAnimation)].width
  );
  const [canvasHeight, setCanvasHeight] = React.useState<number>(
    character.animations[Number(selectedAnimation)].height
  );
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    if (!canvasRef.current) return;
    setAnimation(
      new Character(
        canvasRef.current.getContext("2d")!,
        canvasWidth,
        canvasHeight,
        character.animations,
        selectedAnimation
      )
    );
  }, [
    canvasRef.current,
    canvasWidth,
    canvasHeight,
    character.animations,
    selectedAnimation,
  ]);

  return (
    <main className="flex flex-col items-center gap-4 p-10 lg:container">
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        className="w-full h-full transition bg-black border rounded max-w-fit"
        style={{
          imageRendering: "pixelated",
        }}
      ></canvas>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Select
          defaultValue={selectedAnimation}
          onValueChange={(value) => {
            setSelectedAnimation(value);
            setCanvasWidth(character.animations[Number(value)].width);
            setCanvasHeight(character.animations[Number(value)].height);
          }}
        >
          <SelectTrigger id="selectTrigger" className="select-none w-fit">
            <SelectValue placeholder="Select an animation" />
          </SelectTrigger>
          <SelectContent>
            {character.animations.map((animation, i) => (
              <SelectItem key={i} value={String(i)}>
                <div className="flex items-center mr-3 gap-x-2">
                  <Play className="size-3 fill-foreground" />
                  {animation.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          id="buttonRunAnimation"
          variant={"outline"}
          className="cursor-pointer"
          title="Run"
          onClick={() => animation?.run()}
        >
          <Play className="fill-foreground" />
        </Button>

        <Button
          id="buttonPauseAnimation"
          variant={"outline"}
          className="hidden cursor-pointer"
          title="Pause"
          onClick={() => animation?.pause()}
        >
          <Pause className="fill-foreground" />
        </Button>

        <Button
          id="buttonStopAnimation"
          variant={"outline"}
          onClick={() => animation?.stop()}
          className="cursor-pointer"
          title="Stop"
        >
          <SquareIcon className="fill-foreground" />
        </Button>

        <Button
          id="buttonLightMode"
          variant={"outline"}
          title="Light On"
          onClick={() => {
            document.querySelector("canvas")!.style.backgroundColor = "#fff";
            document.getElementById("buttonDarkMode")!.style.display = "flex";
            document.getElementById("buttonLightMode")!.style.display = "none";
          }}
        >
          <Lightbulb className="fill-foreground" />
        </Button>
        <Button
          id="buttonDarkMode"
          variant={"outline"}
          title="Light Off"
          className="hidden"
          onClick={() => {
            document.querySelector("canvas")!.style.backgroundColor = "#000";
            document.getElementById("buttonLightMode")!.style.display = "flex";
            document.getElementById("buttonDarkMode")!.style.display = "none";
          }}
        >
          <LightbulbOff className="fill-foreground" />
        </Button>

        <Button id="buttonHome" asChild variant={"outline"} title="Home">
          <Link href="/">
            <Home className="fill-foreground" />
          </Link>
        </Button>
      </div>
    </main>
  );
}
