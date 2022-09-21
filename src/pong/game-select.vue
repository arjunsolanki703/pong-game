<template lang="pug">
  .flex.rounded-sm.overflow-hidden(:style="{ paddingLeft: '0.125rem', paddingRight: '0.125rem', background: '#11111133' }")
    .flex-1.uppercase.font-bold.tracking-wider.border-4.border-slate-100.py-2(
      v-for="v in values"
      :key="v"
      :class="{ 'bg-slate-100 text-slate-900': v.toLowerCase() === value.toLowerCase() }"
      :style="{ marginLeft: '-0.125rem', marginRight: '-0.125rem' }"
      @click="onClick(v.toLowerCase())"
    ) {{ v }}
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  props: {
    value: String,
    values: Array,
    sound: Boolean,
  },

  data() {
    return {
      audio: new Audio('/assets/sfx1.mp3'),
    };
  },

  methods: {
    onClick(event) {
      if (this.sound) this.audio.play();
      this.$emit('input', event);
    },
  },
});
</script>
