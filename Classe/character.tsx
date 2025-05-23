type Animations = {
  name: string;
  width: number;
  height: number;
  frameX: number;
  frameY: number;
  sprite: string;
}[];

export class Character {
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
  buttonStopAnimation: HTMLButtonElement;
  opacity: string;
  spriteIsLoaded: boolean;
  lastTime: number;
  raf: number;
  canvasWidth: number;
  canvasHeight: number;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | undefined;

  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    canvasWidth: number,
    canvasHeight: number,
    animations: Animations,
    indexAnimation: string
  ) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.animations = animations;
    this.currentAnimation = Number(indexAnimation);
    this.width = this.animations[this.currentAnimation].width;
    this.height = this.animations[this.currentAnimation].height;
    this.x = this.canvasWidth * 0.5 - this.width * 0.5;
    this.y = this.canvasHeight * 0.5 - this.height * 0.5;
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
    this.spriteIsLoaded = false;
    this.sprite = new Image();
    this.sprite.onload = () => (this.spriteIsLoaded = true);
    this.sprite.src = this.animations[this.currentAnimation].sprite;
    this.raf = 0;
    this.lastTime = 0;

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

    this.buttonStopAnimation =
      (document.getElementById("buttonStopAnimation")! as HTMLButtonElement) ||
      null;

    this.opacity = ".25";
    this.buttonStopAnimation.style.pointerEvents = "none";
    this.buttonStopAnimation.style.opacity = this.opacity;

    this.start();
  }

  setPointerEvents(state: "none" | "all") {
    this.buttonHome.style.pointerEvents = state;
    this.selectTrigger.style.pointerEvents = state;
    this.buttonHome.style.opacity = "1";
    this.selectTrigger.style.opacity = "1";
    if (state === "none") {
      this.buttonHome.style.opacity = this.opacity;
      this.selectTrigger.style.opacity = this.opacity;
    }
  }

  toggleButtonRunPause() {
    this.buttonRunAnimation.style.display = "none";
    this.buttonPauseAnimation.style.display = "flex";

    if (this.paused) {
      this.buttonRunAnimation.style.display = "flex";
      this.buttonPauseAnimation.style.display = "none";
    }
  }

  run() {
    this.paused = false;
    this.toggleButtonRunPause();
    this.setPointerEvents("none");
    this.buttonStopAnimation.style.opacity = "1";
    this.buttonStopAnimation.style.pointerEvents = "all";
  }

  pause() {
    this.paused = true;
    this.toggleButtonRunPause();
  }

  stop() {
    this.paused = true;
    this.frameTimer = 0;
    this.indexFrameX = 0;
    this.indexFrameY = 0;
    this.toggleButtonRunPause();
    this.setPointerEvents("all");
    this.buttonStopAnimation.style.opacity = this.opacity;
    this.buttonStopAnimation.style.pointerEvents = "none";
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

    this.x = this.canvasWidth * 0.5 - this.width * 0.5;
    this.y = this.canvasHeight * 0.5 - this.height * 0.5;
  }

  drawCharacter() {
    if (this.spriteIsLoaded === false) return;

    this.ctx?.drawImage(
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

  update(deltaTime: number) {
    this.drawCharacter();
    if (this.paused) return;

    if (this.frameTimer >= this.frameInterval) {
      this.indexFrameX++;

      if (this.indexFrameX >= this.frameX.length) {
        this.indexFrameX = 0;

        this.indexFrameY++;
        if (this.indexFrameY >= this.frameY.length) {
          this.indexFrameY = 0;
          if (
            !this.animations.at(this.currentAnimation)?.name.includes("Idle") &&
            !this.animations.at(this.currentAnimation)?.name.includes("Move") &&
            !this.animations
              .at(this.currentAnimation)
              ?.name.includes("Standby") &&
            !this.animations.at(this.currentAnimation)?.name.includes("Magic")
          ) {
            this.stop();
          }
        }
      }

      this.frameTimer = 0;
    } else {
      this.frameTimer += deltaTime;
    }
  }

  loop = (timeStamp: number = 0) => {
    let deltaTime = timeStamp - this.lastTime;
    this.lastTime = timeStamp;
    // console.log("deltaTime:", Math.floor(deltaTime));

    this.ctx?.clearRect(0, 0, this.width, this.height);
    this.update(deltaTime);
    this.raf = requestAnimationFrame(this.loop);
  };

  start() {
    this.raf = requestAnimationFrame(this.loop);
  }
}
