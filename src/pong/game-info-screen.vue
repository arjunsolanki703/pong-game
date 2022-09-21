<template lang="pug">
  game-wrapper(hide-header)
    div.p-8
      img(
        class="max-w-sm mx-auto my-8"
        src="../assets/logo.png"
      )

      game-button.mx-auto.block(:sound="sound" @click="$emit('click:back')") Back
</template>

<script>
import Vue from 'vue';
import GameButton from './game-button.vue';
import GameLabel from './game-label.vue';
import GameWrapper from './game-wrapper.vue';

export default Vue.extend({
  components: {
    GameButton,
    GameLabel,
    GameWrapper,
  },

  props: {
    sound: Boolean,
  },
});
</script>
