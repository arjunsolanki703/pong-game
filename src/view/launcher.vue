<template lang="pug">
  app-layout
    v-container
      v-row(dense)
        v-col(cols="12")
          v-card.overflow-hidden.rounded-lg(:to="{ name: 'pong' }")
            .d-flex.flex-no-wrap.justify-space-between.align-center
              .d-flex.flex-column.justify-space-between.flex-grow-1
                v-card-title PONG

              v-avatar.rounded-lg.ma-4(tile size="96")
                v-icon(x-large dark) mdi-tennis
</template>

<script lang="ts">
import Vue from 'vue';
import AppLayout from '../layout/app-layout.vue';

export default Vue.extend({
  metaInfo: { title: 'Home' },
  components: { AppLayout },
});
</script>
