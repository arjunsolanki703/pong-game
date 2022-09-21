<template lang="pug">
  .flex.items-center
    font-awesome-icon.m-4(
      v-if="!vertical"
      icon="chevron-left"
      @click="$refs.swiper.$swiper.slidePrev()"
    )

    swiper.swiper.h-full(ref="swiper" :options="swiperOption")
      swiper-slide.overflow-hidden(v-for="(v, index) in values" :key="v")
        img.rounded-sm.h-full(
          :class="{ 'border-4 border-solid rounded-sm': border }"
          :src="images[index]"
          :style="flip ? { transform: 'scaleX(-1)' } : {}"
        )

    font-awesome-icon.m-4(
      v-if="!vertical"
      icon="chevron-right"
      @click="$refs.swiper.$swiper.slideNext()"
    )
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  props: {
    flip: Boolean,
    value: [Number, String],
    values: Array,
    images: Array,
    vertical: Boolean,
    sound: Boolean,
    border: Boolean,
  },

  data() {
    return {
      swiperOption: {
        initialSlide: this.values.indexOf(this.value),
        loop: true,
        direction: this.vertical ? 'vertical' : 'horizontal',
      },

      audio: new Audio('/assets/sfx4.mp3'),
    };
  },

  mounted() {
    this.$refs.swiper.$swiper.on('slideChange', (e) => {
      this.$emit('input', this.values[e.realIndex]);
      if (this.sound) this.audio.play();
    });
  },
});
</script>
