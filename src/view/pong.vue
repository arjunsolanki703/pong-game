<template lang="pug">
    #container
      pong(
        v-if="isReady"
        :computerCharacters="computerCharacters"
        :playerCharacters="playerCharacters"
        ref="pongGame"
      )

      #game(:style="gameStyle" v-if="screen !== 'game'")

        game-splash(v-if="screen === 'splash'")
        game-info-screen(v-if="screen === 'info'" :sound="sound" @click:back="handleInfoBack")

        game-main-menu(
          v-if="screen === 'main-menu'"
          :sound.sync="sound"
          :court.sync="court"
          @change:mode="handleMode"
          @click:exit="handleExit"
          @click:info="handleInfo"
        )

        game-player-menu(
          v-if="screen === 'player-menu'"
          :difficulty.sync="difficulty"
          :side.sync="side"
          :player1.sync="player1"
          :player2.sync="player2"
          :computer-characters="computerCharacters"
          :computer-indices="computerIndices"
          :player-characters="playerCharacters"
          :player-indices="playerIndices"
          :mode="mode"
          :sound.sync="sound"
          @click:back="handleBack"
          @click:play="handlePlay"
          @click:info="handleInfo"
        )

        game-paddle(
          v-if="screen === 'paddle'"
          @click:play="handleGamePlay"
          :paddle="paddles"
        )

        game-screen(
          v-if="screen === 'game'"
          :config="gameConfig"
        )

        game-pause-screen(
          v-if="screen === 'pause'"
          :config="gameConfig"
          :sound="sound"
          @click:menu="handleBack"
          @click:exit="handleExit"
          @click:resume="handleResume"
        )
</template>

<script>
import Vue from 'vue';
import Pong from '../pong/index.vue';
import GameMainMenu from '../pong/game-main-menu.vue';
import GamePauseScreen from '../pong/game-pause-screen.vue';
import GamePlayerMenu from '../pong/game-player-menu.vue';
import GameScreen from '../pong/game-screen.vue';
import GameSplash from '../pong/game-splash.vue';
import GameInfoScreen from '../pong/game-info-screen.vue';
import GamePaddle from '../pong/game-paddle.vue';

export default Vue.extend({
  components: {
    GameMainMenu,
    GamePauseScreen,
    GamePlayerMenu,
    GameScreen,
    GameSplash,
    Pong,
    GameInfoScreen,
    GamePaddle,
  },

  inject: ['metadataUrl'],

  data() {
    return {
      isReady: false,
      court: 'brown',
      screen: 'splash',
      side: 'right',
      difficulty: 'med',
      mode: null,
      sound: true,
      fullscreen: false,
      player1: 0,
      player2: 0,
      back: '',

      gameConfig: {},

      computerCharacters: [],
      computerIndices: [],
      playerCharacters: [],
      playerIndices: [],

      paddles: [
        {
          id: 1,
          image: './assets/paddles.png',
        }, {
          id: 2,
          image: './assets/paddles.png',
        }, {
          id: 3,
          image: './assets/paddles.png',
        }, {
          id: 4,
          image: './assets/paddles.png',
        }, {
          id: 5,
          image: './assets/paddles.png',
        }, {
          id: 6,
          image: './assets/paddles.png',
        },
      ],
      selectedPaddle: '',
    };
  },

  computed: {
    gameStyle() {
      return {
        // backgroundImage: this.screen !== 'pause' ? 'url(../backgroundGradient.png)' : undefined,
        background: this.screen !== 'pause' ? '#000' : undefined,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      };
    },
  },

  created() {
    this.setCharacters();
    this.screen = 'main-menu';
    this.isReady = true;
  },

  methods: {
    handleMode(mode) {
      this.screen = 'player-menu';
      this.mode = mode;
    },

    handleInfo() {
      this.back = this.screen;
      this.screen = 'info';
    },

    handleInfoBack() {
      this.screen = this.back;
    },

    handlePlay() {
      if (this.paddles.length > 0) {
        this.screen = 'paddle';
      } else {
        this.handleGamePlay(null);
      }
    },

    handleGamePlay(paddle) {
      if (paddle) {
        this.selectedPaddle = paddle.image;
      }
      this.gameConfig = {
        sound: this.sound,
        wallMode: this.mode === 'wall',
        courtStyle: this.court,
        difficulty: { med: 'medium' }[this.difficulty] || this.difficulty,
        leftPlayer: this.side === 'left',
        rightPlayer: this.side === 'right',
        leftPlayerCharacterIndex: this.side === 'left' ? this.player1 : this.player2,
        rightPlayerCharacterIndex: this.side === 'right' ? this.player1 : this.player2,
      };

      this.$refs.pongGame.start(this.gameConfig);
      this.$refs.pongGame.onPause(() => {
        this.screen = 'pause';
      });

      this.screen = 'game';
    },

    handleBack() {
      this.screen = 'main-menu';
      this.mode = null;
    },

    handleResume() {
      this.$refs.pongGame.resume();
      this.screen = 'game';
    },

    handleExit() {
      this.$refs.pongGame.close(this.gameConfig);
      this.$router.push({ name: 'launcher' });
    },

    setCharacters() {
      this.playerIndices = [16006, 16012];
      this.playerCharacters = [
        ['https://ml-metadata.herokuapp.com/v2/merge?payload={%22id%22:%20%2237237cee-36cb-4509-9122-d2acea40f11a%22,%20%22index%22:%2016006,%20%22configId%22:%20%22b08f5967-ce36-475c-bb1a-763f57705a1a%22,%20%22items%22:%20[{%22id%22:%20%22f42d0090-10b1-4775-b872-50777e4b2009--alt0%22},%20{%22id%22:%20%227a4da24e-ca72-4e6b-98d8-cf49db47aac8--alt2%22},%20{%22id%22:%20%22ca657ccb-d84b-4eda-8c0b-ba31f4acebe9--alt0%22},%20{%22id%22:%20%2209844e98-6638-4765-9d88-75659effaeef--alt0%22},%20{%22id%22:%20%22d4b76491-f375-4d00-a78b-edca8a534e7c--alt3%22},%20{%22id%22:%20%2277e109ce-2f9a-4577-bdd6-0389ccc13268--alt3%22},%20{%22id%22:%20%22543a6a27-34b5-48e1-b5a7-b9f2440228b5--alt1%22},%20{%22id%22:%20%2262635dd4-76a1-4cf6-b93f-20ef3393ef30--alt1%22},%20{%22id%22:%20%225ccde819-e7a0-425d-8b63-c03fae7275d5--alt8%22},%20{%22id%22:%20%226833b78b-8c53-4303-9ae7-e10486a71cc3--alt5%22},%20{%22id%22:%20%22ad4c562d-0846-4d9a-84f4-30804b0b0904--alt1%22},%20{%22id%22:%20%22f1280d47-ace2-4242-a28d-237b0afe2b46--alt5%22},%20{%22id%22:%20%225d772bd8-77fa-4ccc-b89c-f464d8090a29--alt3%22},%20{%22id%22:%20%22b87943d6-45d9-4c19-9240-5e9710ed03e3--alt2%22},%20{%22id%22:%20%2298a8c2cc-5e16-4d18-bfa8-d14169139f9b--alt2%22},%20{%22id%22:%20%2236823e4a-be37-42aa-9bfc-908d8744dd33--alt0%22}]}'],
        ['https://ml-metadata.herokuapp.com/v2/merge?payload={"id": "3fccd010-c92f-4663-a73e-ec6ba137b880", "index": 16012, "configId": "92d7af7c-9391-4f0d-a42e-7f40f6b0c162", "items": [{"id": "f42d0090-10b1-4775-b872-50777e4b2009--alt0"}, {"id": "ca657ccb-d84b-4eda-8c0b-ba31f4acebe9--alt0"}, {"id": "e813635f-7ce0-4d37-a146-a5f3396e6acc--alt0"}, {"id": "64d20060-12c4-40cd-b568-d42a15aab4a9--alt7"}, {"id": "e40763c6-2f36-4c0c-83ab-88fd800c5c4f--alt0"}, {"id": "9187e421-0802-407f-9c45-c9e748f148b1--alt0"}, {"id": "0f489b53-7beb-4771-aa97-191eebc085c1--alt9"}]}'],
      ];

      this.computerIndices = [16010, 16009];
      this.computerCharacters = [
        ['https://ml-metadata.herokuapp.com/v2/merge?payload={"id": "110256b2-fbf5-4dfd-a627-2931cc51e742", "index": 16010, "configId": "65c1c579-2614-46ce-934d-3cf911e0d4e6", "items": [{"id": "f42d0090-10b1-4775-b872-50777e4b2009--alt0"}, {"id": "7f44d4ed-dba1-449a-8a2e-12e18f526a9c--alt0"}, {"id": "2df576b3-f074-4bf8-b1bc-73d5854ed200--alt1"}, {"id": "ca657ccb-d84b-4eda-8c0b-ba31f4acebe9--alt0"}, {"id": "09844e98-6638-4765-9d88-75659effaeef--alt0"}, {"id": "d4b76491-f375-4d00-a78b-edca8a534e7c--alt6"}, {"id": "52342406-c9c2-4856-9317-f218d99fb02d--alt6"}, {"id": "5ccde819-e7a0-425d-8b63-c03fae7275d5--alt8"}, {"id": "8c597bfb-6fb3-4466-983f-4ce17f68f8d3--alt7"}, {"id": "dd3150c8-d799-416c-b12c-f2fe2b69a19--alt0"}, {"id": "f154ae73-4de3-4060-9893-2908d3851350--alt1"}, {"id": "70f9eb73-242f-4ebb-af97-50f5f40e663f--alt0"}, {"id": "6833b78b-8c53-4303-9ae7-e10486a71cc3--alt4"}]}'],
        ['https://ml-metadata.herokuapp.com/v2/merge?payload={"id": "c774c496-63f7-4ba7-88cb-bb3e6a7f9330", "index": 16009, "configId": "454f71ff-fc3b-4749-ad14-581f6aec48af", "items": [{"id": "f42d0090-10b1-4775-b872-50777e4b2009--alt0"}, {"id": "cedfbad6-aaff-44a8-a05f-a8def63ac34a--alt1"}, {"id": "f7266c7c-59bc-4723-9128-a0bfdc7b74dd--alt0"}, {"id": "3aa6b895-5104-4c6e-9d59-6ba08ac48788--alt0"}, {"id": "ca657ccb-d84b-4eda-8c0b-ba31f4acebe9--alt0"}, {"id": "a8a9bdd9-a358-4f37-b5b2-ae1f205e15e2--alt3"}, {"id": "f3082e71-a9e7-4984-8808-89b6e1650e36--alt3"}, {"id": "5ccde819-e7a0-425d-8b63-c03fae7275d5--alt0"}, {"id": "0d6a4703-3a05-47ec-998d-dcebd6acc926--alt0"}, {"id": "bbd4e1d5-7cee-46e7-9c22-fa37080673e2--alt1"}, {"id": "be85a416-2e23-4d79-9d32-f510856f0556--alt5"}, {"id": "79894343-1e64-48c4-b04b-6b7855030389--alt2"}, {"id": "ea4e8cf0-7b0c-42ae-8be7-36b92dc7e4bc--alt0"}]}'],
      ];
    },
  },
});
</script>

<!-- eslint-disable-next-line vue/no-restricted-block -->
<style>
html,
body {
  height: 100vh;
  width: 100vw;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

#game{
  position:absolute;
  left: 0;
  top:0;
}

@media only screen and (orientation: portrait) {
  html,
  body {
    position: relative;
  }

  #game {
    position: absolute;
    height: 100vw;
    width: 100vh;
    transform: translate(-50%, -50%) rotate(90deg);
    left: 50%;
    top: 50%;
  }
}

@media only screen and (orientation: landscape) {
  #game {
    height: 100vh;
    width: 100vw;
  }
}
</style>
