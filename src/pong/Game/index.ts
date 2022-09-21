import Phaser from "phaser";
import GameScene, { GameConfig as GameConfig } from "./Game";
import { PongGameEvents } from "./Game/Manager";
import PreloadScene from "./Preload";

export default class PongGame extends Phaser.Game {
  constructor(
    private parent: HTMLDivElement,
    readonly computerCharacters: string[][],
    readonly playerCharacters: string[][]
  ) {
    super({
      type: Phaser.CANVAS,
      disableContextMenu: true,
      backgroundColor: 0x000000,
      pixelArt: true,
      scale: {
        parent,
        width: parent.clientWidth * window.devicePixelRatio,
        height: parent.clientHeight * window.devicePixelRatio,

        mode: Phaser.Scale.NONE,
      },
      physics: {
        default: "arcade",

        arcade: {
          gravity: { y: 0, x: 1 },
          debug: process.env.NODE_ENV === 'development',
        },
      },

      scene: [PreloadScene, GameScene],
    });
    window.addEventListener("resize", this.handleResize);
  }

  private handleResize = () => {
    this.scale.resize(
      this.parent.clientWidth * window.devicePixelRatio,
      this.parent.clientHeight * window.devicePixelRatio
    );
  };

  startGame(gameConfig: GameConfig): void {
    this.scene.start("Game", gameConfig);
  }

  closeGame() {
    this.scene.remove("Game");
  }

  resumeGame() {
    this.scene.resume("Game");
  }

  dispose() {
    this.destroy(true, false);
  }
}
