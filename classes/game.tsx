import { Character } from "./character";

type Animations = {
  name: string;
  width: number;
  height: number;
  frameX: number;
  frameY: number;
  sprite: string;
}[];

export class Game {
  canvas: HTMLCanvasElement;
  ctx?: CanvasRenderingContext2D;
  raf: number;
  lastTime: number;
  width: number;
  height: number;
  character: Character;

  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    animations: Animations,
    selectedAnimation: string
  ) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.raf = 0;
    this.lastTime = 0;

    this.character = new Character(this, animations, selectedAnimation);

    this.start();
  }

  update(deltaTime: number) {
    this.ctx?.clearRect(0, 0, this.width, this.height);
    this.character.update(deltaTime);
  }

  loop = (timeStamp: number = 0) => {
    let deltaTime = timeStamp - this.lastTime;
    this.lastTime = timeStamp;
    // console.log("deltaTime:", Math.floor(deltaTime));

    this.update(deltaTime);
    this.raf = requestAnimationFrame(this.loop);
  };

  start() {
    this.raf = requestAnimationFrame(this.loop);
  }
}
