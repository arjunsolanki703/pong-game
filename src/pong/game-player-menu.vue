<template lang="pug">
  game-wrapper.py-8(:sound="sound" @update:sound="$emit('update:sound', $event)" @click:info="$emit('click:info')" :class="{ 'flex-row-reverse': side === 'right' }")
    div.text-center.p-2.flex.flex-col.h-full(class="w-1/3 -my-2")
      p.text-lg.uppercase.font-bold.tracking-wider.p-2 Player 1

      game-slider.flex-1.overflow-hidden(
        :flip="side === 'left'"
        :images="playerCharacterConfigs.images"
        :values="playerCharacterConfigs.values"
        :value="player1"
        vertical
        @input="$emit('update:player1', Number.parseInt($event, 10))"
      )

      p.text-md.uppercase.font-bold.tracking-wider.p-2 {{ `#${playerCharacterConfigs.indices[player1]}` }}

    div.text-center.p-2(
      class="w-1/3 -my-2"
      :style="{ maxWidth: '220px' }"
    )
      game-select.my-2(
        v-if="mode !== 'wall'"
        :sound="sound"
        :value="difficulty"
        :values="['Easy', 'Med', 'Hard']"
        @input="$emit('update:difficulty', $event)"
      )

      game-select.my-2(
        :sound="sound"
        :value="side"
        :values="['Left', 'Right']"
        @input="$emit('update:side', $event)"
      )

      game-button.my-2(block :sound="sound" @click="$emit('click:play')") Play
      game-button.my-2(block :sound="sound" danger @click="$emit('click:back')") Back

    div.text-center.p-2.flex.flex-col.h-full(class="w-1/3 -my-2")
      template(v-if="mode !== 'wall'")
        p.text-lg.uppercase.font-bold.tracking-wider.p-2 {{ mode === '1-player' ? 'Com' : 'Player 2'  }}

        game-slider.flex-1.overflow-hidden(
          :flip="side === 'right'"
          :images="computerCharacterConfigs.images"
          :values="computerCharacterConfigs.values"
          :value="player2"
          vertical
          @input="$emit('update:player2', Number.parseInt($event, 10))"
        )

        p.text-md.uppercase.font-bold.tracking-wider.p-2 {{ `#${computerCharacterConfigs.indices[player2]}` }}
</template>

<script>
import Vue from 'vue';
import GameButton from './game-button.vue';
import GameLabel from './game-label.vue';
import GameSelect from './game-select.vue';
import GameSlider from './game-slider.vue';
import GameWrapper from './game-wrapper.vue';

export default Vue.extend({
  components: {
    GameButton,
    GameLabel,
    GameSelect,
    GameSlider,
    GameWrapper,
  },

  props: {
    difficulty: String,
    side: String,
    mode: String,
    player1: Number,
    player2: Number,
    computerCharacters: Array,
    computerIndices: Array,
    playerCharacters: Array,
    playerIndices: Array,
    sound: Boolean,
  },

  computed: {
    computerCharacterConfigs() {
      const images = this.computerCharacters.map((x) => x[0]);
      const indices = this.computerIndices;
      const values = this.computerCharacters.map((_, index) => index);
      return { images, indices, values };
    },

    playerCharacterConfigs() {
      const images = this.playerCharacters.map((x) => x[0]);
      const indices = this.playerIndices;
      const values = this.playerCharacters.map((_, index) => index);
      return { images, indices, values };
    },
  },
});
</script>
