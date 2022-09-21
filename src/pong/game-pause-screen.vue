<template lang="pug">
  game-wrapper(hide-header)
    div.text-right(class="w-1/4")
      game-button.mb-48(danger :sound="sound" @click="$emit('click:exit')") Exit

    div.text-center(class="w-1/4")
      button.pl-1(@click="onClick")
        font-awesome-icon(size="2x" icon="play")

    div.text-left(class="w-1/4")
      game-button.mb-48(:sound="sound" @click="$emit('click:menu')") Menu
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

  data() {
    return {
      audio: new Audio('/assets/sfx1.mp3'),
    };
  },

  methods: {
    onClick() {
      if (this.sound) this.audio.play();
      this.$emit('click:resume');
    },
  },
});
</script>
