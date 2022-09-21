<template lang="pug">
  game-wrapper(hide-header)
    img(
      class="w-1/2 mx-auto"
      src="../assets/logo.png"
    )
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
});
</script>
