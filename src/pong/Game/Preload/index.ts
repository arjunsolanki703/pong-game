import PongGame from '..';

export default class PreloadScene extends Phaser.Scene {
  declare game: PongGame;

  constructor() {
    super('Preload');
  }

  preload(): void {
    this.load.setBaseURL('./assets/');
    this.load.spritesheet('fullscreenIcon', 'fullscreenIcon.png', {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.bitmapFont('blackFont', 'blackFont.png', 'font.xml');
    this.load.bitmapFont('whiteFont', 'whiteFont.png', 'font.xml');
    this.load.image('dots', 'dots.png');

    this.load.image('logoGreen', 'logoGreen.png');
    this.load.image('logoBrown', 'logoBrown.png');

    this.load.audio('sfx1', 'sfx1.mp3');
    this.load.audio('sfx2', 'sfx2.mp3');
    this.load.audio('sfx3', 'sfx3.mp3');
    this.load.audio('sfx5', 'sfx5.mp3');

    this.game.computerCharacters
      .forEach((character, characterIndex) => character
        .forEach((url, characterLayerIndex) => this.load.image(
          `computerCharacter-${characterIndex}-${characterLayerIndex}`,
          url,
        )));

    this.game.playerCharacters
      .forEach((character, characterIndex) => character
        .forEach((url, characterLayerIndex) => this.load.image(
          `playerCharacter-${characterIndex}-${characterLayerIndex}`,
          url,
        )));

    const retryCounter: Record<string, number> = {};

    this.load.on(Phaser.Loader.Events.FILE_LOAD_ERROR, (file: Phaser.Loader.File) => {
      if (!retryCounter[file.key]) retryCounter[file.key] = 0;
      if (retryCounter[file.key] <= 3) {
        retryCounter[file.key] += 1;
        this.load.image(file.key, file.url.toString());
      }
    });
  }
}
