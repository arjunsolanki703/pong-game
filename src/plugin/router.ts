import Vue from 'vue';
import VueRouter from 'vue-router';
import Launcher from '../view/launcher.vue';

Vue.use(VueRouter);

export default new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,

  routes: [
    {
      path: '/',
      name: 'pong',
      component: () => import('../view/pong.vue'),
    }
  ],
});
