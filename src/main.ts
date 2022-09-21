// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faCompress,
  faChevronLeft,
  faChevronRight,
  faExpand,
  faInfoCircle,
  faPlay,
  faVolumeMute,
  faVolumeUp,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Vue from 'vue';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import VueAgile from 'vue-agile';
import VueMeta from 'vue-meta';
import Clipboard from 'v-clipboard';
import './registerServiceWorker';
import router from './plugin/router';
import vuetify from './plugin/vuetify';
import './scss/styles.scss';

async function bootstrap(): Promise<void> {
  Vue.use(VueAwesomeSwiper);
  Vue.use(Clipboard);
  Vue.use(VueAgile);
  Vue.use(VueMeta);

  library.add(faCompress);
  library.add(faChevronLeft);
  library.add(faChevronRight);
  library.add(faExpand);
  library.add(faInfoCircle);
  library.add(faPlay);
  library.add(faVolumeMute);
  library.add(faVolumeUp);
  Vue.component('font-awesome-icon', FontAwesomeIcon);

  new Vue({
    router,
    vuetify,
    render: (h) => h('router-view'),

    provide() {
      return { metadataUrl: 'https://ml-metadata.herokuapp.com' };
    },
  }).$mount('#app');
}

bootstrap().then();
