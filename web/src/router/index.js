import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import Pricing from '../pages/Princing.vue';
import Success from '../pages/Success.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/pricing', component: Pricing },
  { path: '/success', component: Success },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
