import { GameConfig } from "..";
import Ball from "../Ball";
import Paddle from "../Paddle";
import UI from "../UI";
import Wall from "../Wall";

export type score = [leftPlayer: number, rightPlayer: number];

export enum PongGameEvents {
  Paused = "paused",
  Score = "score",
}

export default class Manager extends Phaser.Events.EventEmitter {
  Ball!: Ball;
  leftPaddle!: Paddle;
  rightPaddle!: Paddle;
  SFXs: {
    ballPaddle: Phaser.Sound.BaseSound;
    bounds: Phaser.Sound.BaseSound;
    lose: Phaser.Sound.BaseSound;
    win: Phaser.Sound.BaseSound;
  };

  score: score = [0, 0];

  wall!: Wall;
  UI!: UI;

  constructor(private scene: Phaser.Scene, readonly config: GameConfig) {
    super();

    /**
     * Create Sound instances for further use
     */
    this.SFXs = {
      ballPaddle: this.scene.sound.add("sfx1"),
      bounds: this.scene.sound.add("sfx2"),
      lose: this.scene.sound.add("sfx3"),
      win: this.scene.sound.add("sfx5")
    };

    /**
     * Check for input always(not only on mouse move)
     */
    this.scene.input.setPollAlways();
    /** update physics world in sync with renderer, to prevent glitchy rendering for constant moving objects like ball */
    this.scene.physics.world.fixedStep = false;

    /**
     * Update Game Objects according to size at start and subscribe to resize event
     */
    this.handleResize(this.scene.scale.baseSize);
    this.scene.scale.on(Phaser.Scale.Events.RESIZE, this.handleResize, this);

    /**
     * Pause on Double click
     * check if delay between clicks is `250`ms
     */
    let lastTime = 0;
    this.scene.input.on("pointerdown", () => {
      let clickDelay = this.scene.time.now - lastTime;
      lastTime = this.scene.time.now;
      if (clickDelay < 250) {
        /**
         * Pause scene and emit global Paused event for vue components
         */
        this.scene.scene.pause();
        this.scene.game.events.emit(PongGameEvents.Paused);
      }
    });

    /**
     * Subscribe to score event and update localstorage
     * only subscribe if game mode is wall mode or single player
     */
    if (this.config.wallMode)
      this.on("score", (score) => {
        /** Emit global score event for vue components */
        this.scene.game.events.emit(PongGameEvents.Score, score);
        /**
         * Calculate High Score if in wall mode
         */
        if (this.config.wallMode) {
          const highScore = Math.max(
            parseInt(localStorage.getItem("maxScore") || "0"),
            score[this.config.leftPlayer ? 0 : 1]
          ).toString();
          localStorage.setItem("maxScore", highScore);
          this.UI.highScoreText?.setText("HIGH SCORE " + highScore);
        }
      });
  }

  /**
   * get reference to objects in scene
   */
  set(
    Ball: Ball,
    leftPaddle: Paddle,
    rightPaddle: Paddle,
    wall: Wall,
    UI: UI
  ): this {
    this.Ball = Ball;
    this.leftPaddle = leftPaddle;
    this.rightPaddle = rightPaddle;
    this.wall = wall;
    this.UI = UI;

    return this;
  }

  managePhysics(): this {
    /**
     * Add collision between bal and paddles
     */
    this.scene.physics.add.collider(
      this.Ball,
      [this.leftPaddle, this.rightPaddle],
      //@ts-ignore
      (ball: Ball, paddle: Paddle) => {
        /**
         * play sound effect
         */
        this.SFXs.ballPaddle.play();
        /**
         * If in wall mode, increase score when ball touches paddle
         */
        if (this.config.wallMode) {
          this.score[this.config.rightPlayer ? 1 : 0]++;
          this.emit("score", this.score);
        }
        ball.body.velocity.y += 20 * Math.min(20, paddle.movementY);
      },
      (ball, paddle: any) => {
        /**
         * Check that ball is colliding only from sides, not from top or bottom
         */
        const moveY =
          (this.Ball.body.velocity.y * this.scene.game.loop.delta) / 1000;
        return !(
          ball.body.y + ball.body.height - moveY <= paddle.body.y ||
          ball.body.y - moveY >= paddle.body.y + paddle.body.height
        );
      }
    );

    /**
     * Add overlap between ball and wall
     * adding overlap instead of collision to simplify process and preventing "sticked to wall" bug
     */
    this.scene.physics.add.overlap(this.Ball, this.wall, () => {
      /**
       * Play sound effect
       */
      this.SFXs.bounds.play();
      /**
       * Check which side is wall placed on, switch ball's velocity based on that
       * if on right side, make ball's velocity moving left
       */
      this.Ball.body.velocity.x =
        (this.wall.side === "right" ? -1 : 1) *
        Math.abs(this.Ball.body.velocity.x);
    });

    /**
     * Check when ball hits world bounds
     */
    this.scene.physics.world.on(
      Phaser.Physics.Arcade.Events.WORLD_BOUNDS,
      (body: Phaser.Physics.Arcade.Body) => {
        /** if it isn't ball dont continue */
        if (body !== this.Ball.body) return;
        /**
         * play sound effect
         */
        this.SFXs.bounds.play();
        /**
         * Check which side of ball is touching world bounds to get winner
         * emit contact point event for animations
         */
        const bounds = this.scene.physics.world.bounds;
        if (body.blocked.up) {
          this.emit("contactPoint", {
            x: body.x + body.halfWidth,
            y: bounds.top,
          });
        } else if (body.blocked.down) {
          this.emit("contactPoint", {
            x: body.x + body.halfWidth,
            y: bounds.height,
          });
        } else if (body.blocked.right) {
          /**
           * if in wall mode reset score because ball touched active player's side of world
           * if not increase score for opposing player
           */
          if (this.config.wallMode) {
            this.score[1] = 0;
            this.emit("score", this.score);
          } else {
            this.score[0]++;
            this.emit("score", this.score);
          }
          /**
           * if not wall mode or it's wallmode and active player is on the same side that the ball touches then it means player lost, restart game
           */
          if (
            !this.config.wallMode ||
            (this.config.wallMode && !this.config.leftPlayer)
          ) {
            this.SFXs.lose.play();
            this.emit("restart", "left");
          }
        } else if (body.blocked.left) {
          /**
           * if in wall mode reset score because ball touched active player's side of world
           * if not increase score for opposing player
           */
          if (this.config.wallMode) {
            this.score[0] = 0;
            this.emit("score", this.score);
          } else {
            this.score[1]++;
            this.emit("score", this.score);
          }
          /**
           * if not wall mode or it's wallmode and active player is on the same side that the ball touches then it means player lost, restart game
           */
          if (
            !this.config.wallMode ||
            (this.config.wallMode && !this.config.rightPlayer)
          ) {
            this.SFXs.win.play();
            this.emit("restart", "right");
          }
        }
      }
    );

    return this;
  }

  private handleResize(size: Phaser.Structs.Size): void {
    const camera = this.scene.cameras.main;
    /**
     * Check if game should be rotated or not
     */
    if (size.aspectRatio < 1) {
      /**
       * check if camera isn't rotated yet and rotate camera
       */
      //@ts-expect-error
      if (camera.rotation == 0) camera.rotateTo(Math.PI / 2, true);
      /**
       * move camera worldview little bit to align correctly
       */
      camera.setScroll(
        (size.width - size.height) / -2,
        (size.height - size.width) / -2
      );
      /** update bounds */
      this.scene.physics.world.setBounds(0, 0, size.height, size.width);
    } else {
      /**
       * check if camera is rotated 90 degrees, put it back to 0
       */
      //@ts-expect-error
      if (camera.rotation == Math.PI / 2) camera.rotateTo(0, true);
      /**
       * move camera worldview to start to align correctly
       */
      camera.setScroll(0, 0);
      /** update bounds */
      this.scene.physics.world.setBounds(0, 0, size.width, size.height);
    }
    /** update camera size */
    camera.setSize(size.width, size.height);
  }

  /**
   * get world width & height based on aspect ratio and camera rotation
   */
  get worldWidth(): number {
    const size = this.scene.scale.baseSize;
    return size.aspectRatio < 1 ? size.height : size.width;
  }
  get worldHeight(): number {
    const size = this.scene.scale.baseSize;
    return size.aspectRatio < 1 ? size.width : size.height;
  }

  /**
   * Define typescript overloads for events
   */
  on(
    event: "contactPoint",
    callback: (point: Required<Phaser.Types.Math.Vector2Like>) => void
  ): this;
  on(event: "score", callback: (score: score) => void): this;
  on(event: "update", callback: () => void): this;
  on(event: "restart", callback: (winner: "left" | "right") => void): this;
  on(event: string, callback: (...args: any[]) => void): this;
  on(event: string, callback: (...args: any[]) => void): this {
    return super.on(event, callback);
  }

  update() {
    /**
     * emit custom update event because subscribing to global Phaser.Scenes.Events.UPDATE event causes error when switching between scenes
     */
    this.emit("update");
  }
}
