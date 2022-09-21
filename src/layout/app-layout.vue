<template lang="pug">
  v-app(:style="{ height: fillHeight ? '100vh' : undefined }")
    v-app-bar(
      app
      elevation="0"
      :style="{ borderBottom: 'thin solid #ffffff1f' }"
    )
      router-link.mx-auto.text-decoration-none(
        :style="{ color: 'inherit' }"
        :to="{ name: 'index' }"
      )
        img.mt-2(
          src="/assets/Skinnz_Logos_Fin_1col_Pos_Lg.png"
          :width="$vuetify.breakpoint.width < 364 ? 56 : 72"
        )

    v-main.fill-height
      slot
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  metaInfo: { titleTemplate: '%s | Modfather Labs' },
  props: { fillHeight: Boolean },

  data() {
    return { drawer: false };
  },

  created() {
    this.$vuetify.theme.dark = true;
  },
});
</script>

<!-- eslint-disable-next-line vue/no-restricted-block -->
<style>
.v-toolbar__content {
  padding: 0px !important;
}
</style>
