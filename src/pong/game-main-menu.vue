<template lang="pug">
  game-wrapper(:sound="sound" @update:sound="$emit('update:sound', $event)" @click:info="$emit('click:info')")
    div(class="w-1/2").mr-8
      game-slider(
        border
        :images="['green-logo.png', 'brown-logo.png']"
        :values="['green', 'brown']"
        :value="court"
        :sound="sound"
        @input="$emit('update:court', $event)"
      )

    div(class="w-1/4 -my-2" :style="{ maxWidth: '220px' }")
      game-button.my-2(block :sound="sound" @click="$emit('change:mode', '1-player')") 1 Player
      game-button.my-2(block :sound="sound" @click="$emit('change:mode', '2-player')") 2 Player
      game-button.my-2(block :sound="sound" @click="$emit('change:mode', 'wall')") Wall Mode
      game-button.my-2(block :sound="sound" danger @click="$emit('click:exit')") Exit
</template>

<script>
import Vue from 'vue';
import GameButton from './game-button.vue';
import GameLabel from './game-label.vue';
import GameSlider from './game-slider.vue';
import GameWrapper from './game-wrapper.vue';

export default Vue.extend({
  components: {
    GameButton,
    GameLabel,
    GameSlider,
    GameWrapper,
  },

  props: {
    court: String,
    sound: Boolean,
  },
});
</script>
