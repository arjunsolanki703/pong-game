<template>
  <div
    id="parent"
    ref="parent"
  />
</template>

<script lang="ts">
import PongGame from "./Game";
import { Component, Vue } from "vue-property-decorator";
import { GameConfig } from "./Game/Game";
import { PongGameEvents, score } from "./Game/Game/Manager";

const Props = Vue.extend({
  props: {
    playerCharacters: Array,
    computerCharacters:Array,
   }
})

@Component
export default class Pong extends Props {
  private game?: PongGame;

  mounted() {
    console.log(this.computerCharacters,this.playerCharacters);
    this.game = new PongGame(
      this.$refs.parent as HTMLDivElement,
      this.computerCharacters as string[][],
      this.playerCharacters as string[][],
    );
  }

  start(config: GameConfig) {
    this.game?.startGame(config);
  }

  resume() {
    this.game?.resumeGame();
  }

  close() {
    this.game?.closeGame();
  }

  onPause(callback: () => void) {
    this.game?.events.on(PongGameEvents.Paused, callback);
  }

  onScore(callback: (score: score) => void) {
    this.game?.events.on(PongGameEvents.Score, callback);
  }

  destroyed() {
    this.game?.dispose();
  }
}
</script>

<style>
#parent {
  width: 100vw;
  height: 100vh;
}

canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
