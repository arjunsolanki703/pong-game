<template lang="pug">
  .h-full.w-full.flex.justify-center.items-center
    .absolute.top-0.w-full.flex(v-if="!hideHeader")
      .flex-1.flex.justify-start
        font-awesome-icon.block.m-4(
          v-if="!sound"
          icon="volume-mute"
          size="lg"
          @click="$emit('update:sound', true)"
        )

        font-awesome-icon.block.m-4(
          v-if="sound"
          icon="volume-up"
          size="lg"
          @click="$emit('update:sound', false)"
        )

      .flex-1.flex.justify-end
        template(v-if="fullscreenSupport")
          font-awesome-icon.block.m-4(
            v-if="fullscreenSupport && isFullscreen"
            icon="compress"
            size="lg"
            @click="disableFullscreen"
          )

          font-awesome-icon.block.m-4(
            v-if="!isFullscreen"
            icon="expand"
            size="lg"
            @click="enableFullscreen"
          )

        font-awesome-icon.block.m-4(
          icon="info-circle"
          size="lg"
          @click="$emit('click:info')"
        )

    slot
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  props: {
    hideHeader: Boolean,
    sound: Boolean,
  },

  data() {
    return {
      isFullscreen: false,
      fullscreenSupport: true,
    };
  },

  mounted() {
    this.fullscreenSupport = document.fullscreenEnabled;
  },

  methods: {
    enableFullscreen() {
      document.documentElement.requestFullscreen({ navigationUI: 'hide' })
        .then(() => { this.isFullscreen = true; })
        .catch(() => {
          this.fullscreenSupport = false;
        });
    },

    disableFullscreen() {
      document.exitFullscreen()
        .then(() => { this.isFullscreen = false; })
        .catch(() => {
          this.fullscreenSupport = false;
        });
    },
  },
});
</script>
