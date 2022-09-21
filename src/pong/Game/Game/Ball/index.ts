import Manager from "../Manager";

export default class Ball extends Phaser.GameObjects.Arc {
  /**
   * ball constant velocity depends on ball radius to achieve same behavior on all screen sizes
   * this is scale factor for velocity
   */
  static VELOCITY_MULTIPLIER = 0.5;
  declare body: Phaser.Physics.Arcade.Body;

  constructor(scene: Phaser.Scene, private manager: Manager) {
    super(
      scene,
      manager.worldWidth / 2,
      manager.worldHeight / 2,
      Math.min(manager.worldWidth, manager.worldHeight) * 0.015,
      0,
      360,
      false,
      0xffffff,
      1
    );
    this.addToScene().setOrigin(0.5).setDepth(Infinity);

    this.body
      .setCollideWorldBounds(true, this.bounce, this.bounce, true)
      .setAllowGravity(false)
      .setDrag(0, 0)
      .setBounce(this.bounce, this.bounce)
      .setCircle(this.radius, 0, 0);

    /**
     * Give starting velocity
     */
    this.assignVelocity("left");

    /**
     * Subscribe to restart event
     */
    this.manager.on("restart", (winner) => {
      /**
       * Place ball in centen
       */
      this.body.reset(
        this.manager.worldWidth / 2,
        this.manager.worldHeight / 2
      );
      /**
       * Wait for user input, once it taps give ball a velocity
       */
      this.scene.input.once(Phaser.Input.Events.POINTER_DOWN, () => {
        this.assignVelocity(winner);
      });
    });

    /**
     * Subscribe to resize event
     */
    this.scene.scale.on(Phaser.Scale.Events.RESIZE, this.handleResize, this);
  }

  preUpdate(_: number, delta: number) {
    const paddle = this.manager.leftPaddle || this.manager.rightPaddle;
    if (paddle.body)
      /**
       * Set maximum velocity based on paddle's body width, so when it reaches highest velocity, it won't go through
       */
      this.body.setMaxVelocity((0.5 * paddle.body.width) / (delta / 1000));
  }

  private assignVelocity(winner: "left" | "right") {
    this.scene.physics.velocityFromAngle(
      winner == "left"
        ? Phaser.Math.Between(155, 205)
        : Phaser.Math.Between(-25, 25),
      this.calculateVelocityLength(),
      this.body.velocity
    );
  }

  private addToScene(): this {
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this, false);

    return this;
  }

  private handleResize(): void {
    /**
     * Update ball's radius and body
     */
    this.setRadius(this.calculateRadius());
    this.body
      .setCircle(this.radius, 0, 0)
      .setMaxVelocity(this.radius * Ball.VELOCITY_MULTIPLIER);
    /**
     * Update velocity, so ball does not start moving fast/slow when changing canvas size
     */
    this.body.velocity.setLength(this.calculateVelocityLength());
  }

  private readonly shape = new Phaser.Geom.Circle();
  get circle() {
    return this.shape.setTo(
      this.body.x + this.radius,
      this.body.y + this.radius,
      this.radius
    );
  }

  /**
   * Calculate ball's bounce based on difficulty
   */
  get bounce() {
    return (
      1 +
      0.05 * ["easy", "medium", "hard"].indexOf(this.manager.config.difficulty)
    );
  }

  calculateRadius(): number {
    // since game will be responsive set ball radius according to canvas size
    return Math.min(this.manager.worldWidth, this.manager.worldHeight) * 0.015;
  }

  calculateVelocityLength() {
    /**
     * Calculate velocity based on ball's radius, world size and difficulty to be responsive
     */
    return (
      Ball.VELOCITY_MULTIPLIER *
      Math.hypot(this.manager.worldWidth, this.manager.worldHeight) *
      (1 +
        0.15 *
          ["easy", "medium", "hard"].indexOf(this.manager.config.difficulty))
    );
  }
}
