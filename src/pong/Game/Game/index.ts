import PongGame from "..";
import Background from "./Background";
import Ball from "./Ball";
import Manager from "./Manager";
import Paddle, { inputConfiguration } from "./Paddle";

import UI from "./UI";
import Wall from "./Wall";

export interface GameConfig {
  wallMode: boolean;
  courtStyle: "brown" | "green";
  difficulty: "easy" | "medium" | "hard";
  leftPlayer?: boolean;
  rightPlayer?: boolean;
  leftPlayerCharacterIndex: number;
  rightPlayerCharacterIndex: number;
}

export default class GameScene extends Phaser.Scene {
  declare sound: Phaser.Sound.WebAudioSoundManager;
  declare game: PongGame;
  Manager!: Manager;
  ball!: Ball;
  leftPaddle!: Paddle;
  rightPaddle!: Paddle;
  Background!: Background;
  UI!: UI;
  config!: GameConfig;
  wall!: Wall;
  constructor() {
    super("Game");
  }

  init(config: GameConfig) {
    this.config = config;
    console.log(config);
  }

  create(): void {
    this.Manager = new Manager(this, this.config);

    this.UI = new UI(this, this.Manager);

    this.Background = new Background(this, this.Manager);

    this.ball = new Ball(this, this.Manager);
    if (
      !this.config.wallMode ||
      (this.config.wallMode && this.config.leftPlayer)
    )
      this.leftPaddle = new Paddle(
        this,
        this.Manager,
        "left",
        this.config.leftPlayer
          ? {
              keys: {
                up: Phaser.Input.Keyboard.KeyCodes.W,
                down: Phaser.Input.Keyboard.KeyCodes.S,
              },
              touch: true,
            }
          : undefined
      );

    if (
      !this.config.wallMode ||
      (this.config.wallMode && this.config.rightPlayer)
    )
      this.rightPaddle = new Paddle(
        this,
        this.Manager,
        "right",
        this.config.rightPlayer
          ? {
              keys: {
                up: Phaser.Input.Keyboard.KeyCodes.UP,
                down: Phaser.Input.Keyboard.KeyCodes.DOWN,
              },
              touch: true,
            }
          : undefined
      );
    if (this.config.wallMode) {
      this.wall = new Wall(
        this,
        this.Manager,
        this.config.leftPlayer ? "right" : "left"
      );
    }

    // pass object references to manager
    this.Manager.set(
      this.ball,
      this.leftPaddle,
      this.rightPaddle,
      this.wall,
      this.UI
    ).managePhysics();
  }

  update() {
    this.Manager.update();
  }
}
