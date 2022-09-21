<template lang="pug">
  .h-full.w-full.p-5.overflow-y-auto
    div.flex.flex-wrap.justify-around
        div( @click="$emit('click:play', padle)" v-for="(padle, index) in paddle" :key="index").w-350
          img(:src='padle.image')
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  props: {
    paddle: Array,
  },
});
</script>

<style scoped>
.w-350 {
  width: 200px;
  margin-bottom: 20px;
}
</style>
