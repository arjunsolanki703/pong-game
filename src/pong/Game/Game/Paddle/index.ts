import GameScene from "..";
import Manager from "../Manager";

type ValuesOf<T> = T[keyof T];

export interface inputConfiguration {
  keys?: {
    up: ValuesOf<typeof Phaser.Input.Keyboard.KeyCodes>;
    down: ValuesOf<typeof Phaser.Input.Keyboard.KeyCodes>;
  };
  touch?: boolean;
}

export default class Paddle extends Phaser.Physics.Arcade.Image {
  /**
   * what fraction of canvas width should be between edge of the canvas and paddles?
   * range `[0,1]`
   * actual margin calculated by multiplying this to overall canvas width
   */
  static readonly HORIZONTAL_MARGIN_FR = 0.04;
  static readonly KEYBOARD_SENSITIVITY = 0.025;
  static readonly RECLOTHE_COMBO_POINT = 3;

  static heightFr = 0.24;

  declare body: Phaser.Physics.Arcade.Body;
  dots!: Phaser.GameObjects.TileSprite;

  private characterIndex: number = 0;
  private characterLayerIndex = 0;

  characterComboWins = 0;

  constructor(
    public scene: GameScene,
    private readonly manager: Manager,
    private readonly side: "left" | "right",
    /** if not passed then paddle is controlled by computer */ private readonly inputConfiguration?: inputConfiguration
  ) {
    super(scene, 0, 0, `character-0-0`);

    this.characterIndex =
      side == "left"
        ? scene.config.leftPlayerCharacterIndex
        : scene.config.rightPlayerCharacterIndex;

    this.updateSprite();

    this.addToScene()
      .setOrigin(this.side == "left" ? 0 : 1, 0.5)
      .setScale(this.calculateScale())
      .setPosition(this.calculateX(), this.scene.cameras.main.centerY)
      .setFlipX(this.side == "left");

    this.body
      .setCollideWorldBounds(true, 0, 0.7, true)
      .setImmovable(true)
      .setAllowGravity(false);

    this.updateBody();

    this.setUpControls().addDots();

    this.manager.on("restart", (winner) => {
      /**
       * If lost player should lose some clothes, else get one back
       */
      if (this.side === winner) {
        this.characterComboWins++;
        if (this.characterComboWins >= Paddle.RECLOTHE_COMBO_POINT) {
          this.characterLayerIndex--;
          this.characterComboWins = 0;
        }
      } else {
        this.characterLayerIndex++;
        this.characterComboWins = 0;
      }

      this.updateSprite();
    });

    this.scene.scale.on(Phaser.Scale.Events.RESIZE, this.handleResize, this);
  }

  addToScene(): this {
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this, false);

    return this;
  }

  private handleResize(): void {
    this.setScale(this.calculateScale()).setPosition(
      this.calculateX(),
      Phaser.Math.Clamp(
        this.y,
        this.height / 2,
        this.manager.worldHeight - this.height / 2
      )
    );
    this.updateBody();
  }

  private readonly dotTextureSize = 13;
  private readonly dotColumnCount = 4;
  private addDots(): this {
    /**
     * it's height is snapped automatically to half of paddle's displayHeight
     */
    this.dots = this.scene.add
      .tileSprite(
        0,
        0,
        this.dotTextureSize * this.dotColumnCount,
        Phaser.Math.Snap.To(this.displayHeight / 2, this.dotTextureSize),
        "dots"
      )
      .setAlpha(0.5)
      .setOrigin(this.side == "left" ? 1 : 0, 0.5);
    /**
     * Update position on every frame to be in sync with paddle
     */
    this.scene.events.on(Phaser.Scenes.Events.PRE_RENDER, () => {
      this.dots.setPosition(this.x, this.y);
    });
    /**
     * Subscribe to resize listener, to always have right size
     */
    this.scene.scale.on(Phaser.Scale.Events.RESIZE, () => {
      this.dots.setSize(
        this.dotTextureSize * this.dotColumnCount,
        Phaser.Math.Snap.To(this.displayHeight / 2, this.dotTextureSize)
      );
    });

    return this;
  }

  public movementY: number = 0;
  setUpControls(): this {
    if (!this.inputConfiguration) {
      /**
       * set up computer controls
       */
      let t = 0;
      switch (this.manager.config.difficulty) {
        case "easy":
          t = 0.05;
          break;
        case "medium":
          t = 0.13;
          break;
        case "hard":
          t = 0.2;
          break;
      }
      this.manager.on("update", () => {
        if (this.scene.physics.world.isPaused) return;
        const oldY = this.y;
        this.y = Phaser.Math.Linear(this.y, this.manager.Ball.body.y, t);
        this.movementY = this.y - oldY;
      });
    } else {
      const { keys: keyCodes, touch } = this.inputConfiguration;

      /**
       * Set up keyboard input if defined
       */
      if (keyCodes) {
        const keys = this.scene.input.keyboard.addKeys(
          keyCodes,
          true,
          true
        ) as {
          [key in keyof Required<inputConfiguration>["keys"]]: Phaser.Input.Keyboard.Key;
        };

        this.manager.on("update", () => {
          if (this.scene.physics.world.isPaused) return;
          if (this.scene.input.keyboard.checkDown(keys.up)) {
            this.y -= this.height * Paddle.KEYBOARD_SENSITIVITY;
            this.movementY = -this.height * Paddle.KEYBOARD_SENSITIVITY;
          } else if (this.scene.input.keyboard.checkDown(keys.down)) {
            this.y += this.height * Paddle.KEYBOARD_SENSITIVITY;
            this.movementY = this.height * Paddle.KEYBOARD_SENSITIVITY;
          }
        });
      }

      if (touch) {
        /**
         * add extra pointer to be managed by phaser inputManager
         */
        this.scene.input.addPointer();

        // keep reference to active pointer
        let activePointer: Phaser.Input.Pointer | undefined;

        this.scene.input.on(
          Phaser.Input.Events.POINTER_DOWN,
          (pointer: Phaser.Input.Pointer) => {
            /** Stop execution if world is paused */
            if (this.scene.physics.world.isPaused) return;
            /**
             * Check if pointer is pressed on current player's side
             */
            if (
              (this.side === "left" &&
                pointer.worldX < this.manager.worldWidth / 2) ||
              (this.side === "right" &&
                pointer.worldX > this.manager.worldWidth / 2)
            )
              activePointer = pointer;
          }
        );

        this.scene.input.on(
          Phaser.Input.Events.POINTER_MOVE,
          (pointer: Phaser.Input.Pointer) => {
            /** Stop execution if world is paused */
            if (this.scene.physics.world.isPaused) return;
            /**
             * Check if current pointer is the same that was pressed in current player region
             */
            if (activePointer === pointer) {
              const oldY = this.y;
              this.setY(pointer.worldY);
              this.movementY = this.y - oldY;
            }
          }
        );

        this.scene.input.on(
          Phaser.Input.Events.POINTER_UP,
          (pointer: Phaser.Input.Pointer) => {
            /** Stop execution if world is paused */
            if (this.scene.physics.world.isPaused) return;
            /**
             * Remove reference to pointer
             */
            if (activePointer === pointer) activePointer = undefined;
          }
        );
      }
    }

    return this;
  }

  updateBody() {
    /**
     * Make body to cover everything: 4/5 of sprite(leave some space for racket) and space between character and world edge to minimize risk of ball going through
     */
    this.body.setSize(
      (this.dotTextureSize * this.dotColumnCount) / this.scaleX +
        this.width * (4 / 5),
      this.height,
      false
    );
    /**
     * Set offset to correctly align body with player sprite
     */
    if (this.side == "left")
      this.body.setOffset(
        -(this.dotTextureSize * this.dotColumnCount) / this.scaleX,
        0
      );
    else this.body.setOffset(this.width * (1 / 5), 0);
  }

  updateSprite() {
    /**
     * Character layer index is clamped between 0 and total characters in set
     */
    this.characterLayerIndex = Phaser.Math.Clamp(
      this.characterLayerIndex,
      0,
      (this.inputConfiguration
        ? this.scene.game.playerCharacters
        : this.scene.game.computerCharacters)[this.characterIndex].length - 1
    );

    this.setTexture(
      `${this.inputConfiguration ? "playerCharacter" : "computerCharacter"}-${
        this.characterIndex
      }-${this.characterLayerIndex}`
    );
  }

  static map(
    x: number,
    min: number,
    max: number,
    destMin: number,
    destMax: number
  ) {
    return (
      Phaser.Math.Clamp((x - min) / (max - min), 0, 1) * (destMax - destMin) +
      destMin
    );
  }

  getDirectionToPointer(pointer: Phaser.Input.Pointer): number {
    return Phaser.Math.Fuzzy.Equal(this.y, pointer.y, this.height * 0.05)
      ? 0
      : Math.sign(pointer.y - this.y);
  }

  private readonly shape = new Phaser.Geom.Rectangle();
  get rectangle() {
    return this.shape.setTo(this.body.x, this.body.y, this.width, this.height);
  }

  calculateX() {
    return this.side == "left"
      ? this.dotTextureSize * this.dotColumnCount * 1.5
      : this.manager.worldWidth -
          this.dotTextureSize * this.dotColumnCount * 1.5;
  }

  calculateScale() {
    return (this.manager.worldHeight * Paddle.heightFr) / this.height;
  }
}
