<template lang="pug">
  button(
    :class="classes"
    :style="{ background: '#11111133' }"
    @click="onClick"
    @mouseover="onMouseover"
    v-on="$listeners"
  )
    slot
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  props: {
    block: Boolean,
    danger: Boolean,
    sound: Boolean,
  },

  data() {
    return {
      audio: new Audio('/assets/sfx1.mp3'),
    };
  },

  computed: {
    classes() {
      return [
        { block: this.block },
        'text-lg',
        'uppercase',
        'font-bold',
        'tracking-wider',
        'border-4',
        'border-solid',
        'px-4',
        'py-2',
        'mx-auto',
        'rounded-sm',
        { 'w-full': this.block },
        { 'border-slate-100 text-slate-100': !this.danger },
        { 'border-red-400 text-red-400': this.danger },
      ];
    },
  },

  methods: {
    onClick() {
      this.$emit('click');
    },

    onMouseover() {
      if (this.sound) this.audio.play();
    },
  },
});
</script>
