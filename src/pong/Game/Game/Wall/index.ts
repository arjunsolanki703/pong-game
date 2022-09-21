import Manager from "../Manager";

export default class Wall extends Phaser.GameObjects.Rectangle {
  static readonly WIDTH_FR = 0.015;
  declare body: Phaser.Physics.Arcade.StaticBody;

  constructor(
    scene: Phaser.Scene,
    private manager: Manager,
    public readonly side: "left" | "right"
  ) {
    super(
      scene,
      side == "left" ? 0 : manager.worldWidth,
      0,
      Wall.WIDTH_FR * manager.worldWidth,
      manager.worldHeight,
      0xffffff
    );
    /**
     * add to scene and physics world
     */
    this.addToScene().setOrigin(this.side == "left" ? 0 : 1, 0);
    /**
     * Update physics body based on rectangle width & height
     */
    this.body.updateFromGameObject();
    this.scene.scale.on(Phaser.Scale.Events.RESIZE, this.handleResize, this);
  }

  addToScene(): this {
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this, true);

    return this;
  }
  private handleResize(): void {
    this.setSize(
      Wall.WIDTH_FR * this.manager.worldWidth,
      this.manager.worldHeight
    );

    this.body.setSize(this.width, this.height);
  }
}
