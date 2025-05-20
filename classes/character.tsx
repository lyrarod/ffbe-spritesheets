import { Game } from "@/classes/game";

type Animations = {
  name: string;
  width: number;
  height: number;
  frameX: number;
  frameY: number;
  sprite: string;
}[];

export class Character {
  game: Game;
  width: number;
  height: number;
  x: number;
  y: number;
  frameX: number[];
  indexFrameX: number;
  frameY: number[];
  indexFrameY: number;
  sprite: HTMLImageElement;
  frameTimer: number;
  frameInterval: number;
  paused: boolean;
  isAttacking: boolean;

  animations: {
    name: string;
    width: number;
    height: number;
    frameX: number;
    frameY: number;
    sprite: string;
  }[];
  currentAnimation: number;
  buttonRunAnimation: HTMLButtonElement;
  buttonPauseAnimation: HTMLButtonElement;
  selectTrigger: HTMLSelectElement;
  buttonHome: HTMLButtonElement;

  constructor(game: Game, animations: Animations, indexAnimation: string) {
    this.game = game;
    this.animations = animations;
    this.currentAnimation = Number(indexAnimation);
    this.width = this.animations[this.currentAnimation].width;
    this.height = this.animations[this.currentAnimation].height;
    this.x = this.game.width * 0.5 - this.width * 0.5;
    this.y = this.game.height * 0.5 - this.height * 0.5;
    this.frameX = Array.from(
      { length: this.animations[this.currentAnimation].frameX },
      (_, i) => i
    );
    this.indexFrameX = 0;
    this.frameY = Array.from(
      { length: this.animations[this.currentAnimation].frameY },
      (_, i) => i
    );
    this.indexFrameY = 0;
    this.frameTimer = 0;
    this.frameInterval = 1000 / 8;
    this.paused = true;
    this.isAttacking = false;
    this.sprite = new Image();
    this.sprite.src = this.animations[this.currentAnimation].sprite;

    this.buttonRunAnimation =
      (document.getElementById("buttonRunAnimation")! as HTMLButtonElement) ||
      null;

    this.buttonPauseAnimation =
      (document.getElementById("buttonPauseAnimation")! as HTMLButtonElement) ||
      null;

    this.selectTrigger =
      (document.getElementById("selectTrigger")! as HTMLSelectElement) || null;

    this.buttonHome =
      (document.getElementById("buttonHome")! as HTMLButtonElement) || null;
  }

  setPointerEvents(state: "none" | "all") {
    this.buttonHome.style.pointerEvents = state;
    this.selectTrigger.style.pointerEvents = state;
    this.buttonHome.style.opacity = "1";
    this.selectTrigger.style.opacity = "1";
    if (state === "none") {
      this.buttonHome.style.opacity = ".3";
      this.selectTrigger.style.opacity = ".3";
    }
  }

  runAnimation() {
    this.paused = false;
    this.buttonRunAnimation.style.display = "none";
    this.buttonPauseAnimation.style.display = "flex";
    this.setPointerEvents("none");
  }

  pauseAnimation() {
    this.paused = true;
    this.buttonRunAnimation.style.display = "flex";
    this.buttonPauseAnimation.style.display = "none";
    this.setPointerEvents("all");
  }

  stopAnimation() {
    this.paused = true;
    this.indexFrameX = 0;
    this.indexFrameY = 0;
    this.buttonRunAnimation.style.display = "flex";
    this.buttonPauseAnimation.style.display = "none";
    this.setPointerEvents("all");
  }

  setAnimation(animation: string) {
    this.currentAnimation = Number(animation);
    // console.log(this.animations[this.currentAnimation]);
    this.width = this.animations[this.currentAnimation].width;
    this.height = this.animations[this.currentAnimation].height;
    this.frameX = Array.from(
      { length: this.animations[this.currentAnimation].frameX },
      (_, i) => i
    );
    this.indexFrameX = 0;
    this.frameY = Array.from(
      { length: this.animations[this.currentAnimation].frameY },
      (_, i) => i
    );
    this.indexFrameY = 0;
    this.sprite.src = this.animations[this.currentAnimation].sprite;

    this.x = this.game.width * 0.5 - this.width * 0.5;
    this.y = this.game.height * 0.5 - this.height * 0.5;
  }

  drawCharacter() {
    const ctx = this.game.ctx!;
    ctx.drawImage(
      this.sprite,
      this.frameX[this.indexFrameX] * this.width,
      this.frameY[this.indexFrameY] * this.height,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  render() {
    const ctx = this.game.ctx!;
    ctx.strokeStyle = "transparent";
    ctx.strokeRect(this.x, this.y, this.width, this.height);

    this.drawCharacter();
  }

  update(deltaTime: number) {
    this.render();
    if (this.paused) return;

    if (this.frameTimer >= this.frameInterval) {
      this.indexFrameX++;
      if (this.indexFrameX >= this.frameX.length) {
        this.indexFrameX = 0;

        this.indexFrameY++;
        if (this.indexFrameY >= this.frameY.length - 1) {
          this.indexFrameY = 0;
          if (
            !this.animations.at(this.currentAnimation)?.name.includes("Idle") &&
            !this.animations.at(this.currentAnimation)?.name.includes("Move") &&
            !this.animations
              .at(this.currentAnimation)
              ?.name.includes("Standby") &&
            !this.animations.at(this.currentAnimation)?.name.includes("Magic")
          ) {
            this.paused = true;
            this.buttonRunAnimation.style.display = "flex";
            this.buttonPauseAnimation.style.display = "none";
            this.setPointerEvents("all");
            return;
          }
        }
      }

      this.frameTimer = 0;
    } else {
      this.frameTimer += deltaTime;
    }
  }
}
