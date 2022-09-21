import Manager from "../Manager";

export default class UI extends Phaser.GameObjects.Layer {
  static readonly SCORE_MARGIN_FR = 0.07;
  leftPlayerScore?: Phaser.GameObjects.BitmapText;
  rightPlayerScore?: Phaser.GameObjects.BitmapText;
  highScoreText!: Phaser.GameObjects.BitmapText;
  constructor(scene: Phaser.Scene, private manager: Manager) {
    super(scene);

    /**
     * Add to scene and bring on top of everything
     */
    this.scene.add.existing(this).setDepth(Infinity);

    /**
     * create texts for ui
     * left player score is visible if it's normal mode or it's wall mode and leftplayer is active
     * same for right player score
     */
    if (
      !this.manager.config.wallMode ||
      (this.manager.config.wallMode && this.manager.config.leftPlayer)
    ) {
      this.leftPlayerScore = this.scene.add
        .bitmapText(
          this.manager.worldWidth / 2 -
            UI.SCORE_MARGIN_FR * this.manager.worldHeight,
          UI.SCORE_MARGIN_FR * this.manager.worldHeight,
          "whiteFont",
          "0"
        )
        .setScale(10)
        .setOrigin(1, 0);
      this.add(this.leftPlayerScore);
    }
    //
    if (
      !this.manager.config.wallMode ||
      (this.manager.config.wallMode && this.manager.config.rightPlayer)
    ) {
      this.rightPlayerScore = this.scene.add
        .bitmapText(
          this.manager.worldWidth / 2 +
            UI.SCORE_MARGIN_FR * this.manager.worldHeight,
          UI.SCORE_MARGIN_FR * this.manager.worldHeight,
          "whiteFont",
          "0"
        )
        .setScale(10)
        .setOrigin(0, 0);
      this.add(this.rightPlayerScore);
    }

    /**
     * High score is avaliable only for wall mode
     */
    if (this.manager.config.wallMode) {
      this.highScoreText = this.scene.add
        .bitmapText(
          60,
          30,
          "whiteFont",
          "HIGH SCORE " + (localStorage.getItem("maxScore") || "0")
        )
        .setScale(3)
        .setOrigin(0, 0);

      this.add(this.highScoreText);
    }

    /**
     * Subscribe to score event
     * update texts when new score is avaliable
     */
    this.manager.on("score", ([leftPlayerScore, rightPlayerScore]) => {
      this.leftPlayerScore?.setText(leftPlayerScore.toString());
      this.rightPlayerScore?.setText(rightPlayerScore.toString());
    });

    /**
     * Subscribe to resize event
     */
    this.scene.scale.on(Phaser.Scale.Events.RESIZE, this.handleResize, this);
  }

  private handleResize(): void {
    /**
     * Update texts position when canvas size changes
     */
    this.leftPlayerScore?.setPosition(
      this.manager.worldWidth / 2 -
        UI.SCORE_MARGIN_FR * this.manager.worldHeight,
      UI.SCORE_MARGIN_FR * this.manager.worldHeight
    );
    this.rightPlayerScore?.setPosition(
      this.manager.worldWidth / 2 +
        UI.SCORE_MARGIN_FR * this.manager.worldHeight,
      UI.SCORE_MARGIN_FR * this.manager.worldHeight
    );
  }
}
