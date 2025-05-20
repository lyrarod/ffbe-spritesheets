"use client";

import React from "react";
import { Game } from "@/classes/game";
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
import { cn } from "@/lib/utils";
import Link from "next/link";

type Character = {
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

export function CanvasComponent({ character }: { character: Character }) {
  const [game, setGame] = React.useState<Game | null>(null);
  const [selectedAnimation, setSelectedAnimation] = React.useState<string>("0");
  const [selectError, setSelectError] = React.useState<boolean>(false);
  const [canvasWidth, setCanvasWidth] = React.useState<number>(
    character.animations[Number(selectedAnimation)].width
  );
  const [canvasHeight, setCanvasHeight] = React.useState<number>(
    character.animations[Number(selectedAnimation)].height
  );
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    if (!canvasRef.current) return;
    setGame(
      new Game(
        canvasRef.current,
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
        className="w-full h-full transition bg-black rounded max-w-fit"
        style={{
          imageRendering: "pixelated",
          // backgroundImage: `url('/FFBE_Chamber_of_Arms_BG.webp')`,
          // backgroundSize: "cover",
          // backgroundPosition: "center",
          // backgroundRepeat: "no-repeat",
        }}
      ></canvas>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button id="buttonHome" asChild variant={"outline"} title="Home">
          <Link href="/">
            <Home className="fill-foreground" />
          </Link>
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

        <Button
          id="buttonRunAnimation"
          variant={"outline"}
          className="cursor-pointer"
          title="Run"
          onClick={() => {
            if (!selectedAnimation) {
              setSelectError(true);
              alert("Please select an animation");
              return;
            }
            game?.character.runAnimation();
          }}
        >
          <Play className="fill-foreground" />
        </Button>

        <Button
          id="buttonPauseAnimation"
          variant={"outline"}
          className="hidden cursor-pointer"
          title="Pause"
          onClick={() => game?.character.pauseAnimation()}
        >
          <Pause className="fill-foreground" />
        </Button>

        <Button
          variant={"outline"}
          onClick={() => game?.character.stopAnimation()}
          className="cursor-pointer"
          title="Stop"
        >
          <SquareIcon className="fill-foreground" />
        </Button>

        <Select
          defaultValue={selectedAnimation}
          onValueChange={(value) => {
            setSelectError(false);
            setSelectedAnimation(value);
            setCanvasWidth(character.animations[Number(value)].width);
            setCanvasHeight(character.animations[Number(value)].height);
          }}
        >
          <SelectTrigger
            id="selectTrigger"
            className={cn("select-none w-max", {
              "text-destructive dark:text-destructive border-destructive dark:border-destructive focus:ring-destructive animate-pulse":
                selectError,
            })}
          >
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
      </div>
    </main>
  );
}
