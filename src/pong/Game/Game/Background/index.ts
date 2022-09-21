import Manager from "../Manager";

export default class Background extends Phaser.GameObjects.Graphics {
  /**
   * How many frames should trail span?
   */
  static TRAILLENGTH = 8;
  constructor(scene: Phaser.Scene, private manager: Manager) {
    super(scene, {
      fillStyle: {
        color: manager.config.courtStyle == "brown" ? 0x160601 : 0x487853,
      },
      lineStyle: {
        color: manager.config.courtStyle == "brown" ? 0x59453f : 0xccd7fa,
        width: 4,
        alpha: 1,
      },
    });
    this.scene.add.existing(this).setDepth(-5);

    /**
     * draw transparent expanding circle when ball contacts anything
     */
    this.manager.on("contactPoint", (point) => {
      this.scene.tweens.addCounter({
        from: 1,
        to: 0,
        duration: 300,
        ease: Phaser.Math.Easing.Quadratic.Out,
        onUpdate: (tween) => {
          const value = tween.getValue();
          this.fillStyle(0xffffff, value);
          this.fillCircle(point.x, point.y, (1 - value) * 25);
        },
      });
    });

    this.scene.cameras.main.setBackgroundColor(this.defaultFillColor);
    this.drawBackgroundLines().drawFadingTrail().addLogo();
  }

  private drawBackgroundLines() {
    this.scene.events.on(Phaser.Scenes.Events.PRE_UPDATE, () => {
      this.clear();
      this.lineBetween(
        this.manager.worldWidth / 2,
        0,
        this.manager.worldWidth / 2,
        this.manager.worldHeight / 2 - this.manager.worldHeight / 8
      );
      this.lineBetween(
        this.manager.worldWidth / 2,

        this.manager.worldHeight / 2 + this.manager.worldHeight / 8,
        this.manager.worldWidth / 2,
        this.manager.worldHeight
      );
      this.strokeCircle(
        this.manager.worldWidth / 2,
        this.manager.worldHeight / 2,
        this.manager.worldHeight / 8
      );
    });
    return this;
  }

  private trailPositions = Array(Background.TRAILLENGTH)
    .fill(false)
    .map(
      (_) =>
        new Phaser.Math.Vector2(
          this.manager.worldWidth / 2,
          this.manager.worldHeight / 2
        )
    );
  private dummyTrailPosition = new Phaser.Math.Vector2(0, 0);
  private drawFadingTrail() {
    this.manager.on("restart", () => {
      for (let i = 0; i < Background.TRAILLENGTH; i++)
        this.trailPositions[i].set(
          this.manager.worldWidth / 2,
          this.manager.worldHeight / 2
        );
    });
    this.manager.on("update", () => {
      /**
       * Shift trail positions and update with new one
       */
      const currentTrailPosition =
        this.trailPositions[Background.TRAILLENGTH - 1];
      for (let i = Background.TRAILLENGTH - 2; i >= 0; i--)
        this.trailPositions[i + 1] = this.trailPositions[i];
      this.trailPositions[0] = currentTrailPosition;
      currentTrailPosition.set(
        this.manager.Ball.body.x + this.manager.Ball.body.halfWidth,
        this.manager.Ball.body.y + this.manager.Ball.body.halfHeight
      );
      /**
       * draw trail circles and draw mid circles to make continious path
       */
      for (
        let trailIndex = 0;
        trailIndex < Background.TRAILLENGTH - 1;
        trailIndex++
      ) {
        const startTrailPosition = this.trailPositions[trailIndex];
        const endTrailPosition = this.trailPositions[trailIndex + 1];
        const startTrailLife = 1 - trailIndex / (Background.TRAILLENGTH - 1);
        const endTrailLife =
          1 - (trailIndex + 1) / (Background.TRAILLENGTH - 1);

        /**
         * Calculate how many inner circles should be drawn to make trail smooth by calculating distance
         */
        const totalSubTrails = Math.ceil(
          this.dummyTrailPosition
            .copy(endTrailPosition)
            .subtract(startTrailPosition)
            .length()
        );
        for (
          let subTrailIndex = 1;
          subTrailIndex <= totalSubTrails;
          subTrailIndex++
        ) {
          const subTrailPosition = this.dummyTrailPosition
            .copy(startTrailPosition)
            .lerp(endTrailPosition, subTrailIndex / totalSubTrails);
          const subTrailLife = Phaser.Math.Linear(
            startTrailLife,
            endTrailLife,
            subTrailIndex / totalSubTrails
          );
          this.fillStyle(0xffffff, 0.02 * subTrailLife);
          this.fillCircle(
            subTrailPosition.x,
            subTrailPosition.y,
            subTrailLife * this.manager.Ball.radius * 0.9
          );
        }
      }
    });

    return this;
  }

  logo!: Phaser.GameObjects.Image;
  private addLogo() {
    this.logo = this.scene.add.image(
      this.manager.worldWidth / 2,
      this.manager.worldHeight / 2,
      this.manager.config.courtStyle == "brown" ? "logoBrown" : "logoGreen"
    );

    this.logo
      .setOrigin(0.5)
      .setScale((0.5 * this.manager.worldHeight) / this.logo.height)
      .setDepth(-Infinity);

    this.scene.scale.on(Phaser.Scale.Events.RESIZE, () => {
      this.logo
        .setPosition(this.manager.worldWidth / 2, this.manager.worldHeight / 2)
        .setScale((0.5 * this.manager.worldHeight) / this.logo.height);
    });

    return this;
  }
}
