<template lang="pug">
  p(:class="classes")
    slot
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  props: {
    block: Boolean,
  },

  computed: {
    classes() {
      return [
        'text-lg',
        'uppercase',
        'font-bold',
        'tracking-wider',
        'px-4',
        'py-2',
        { 'text-center': this.block },
        { 'w-full': this.block },
      ];
    },
  },
});
</script>
