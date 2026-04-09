import { createRouter, createWebHistory } from 'vue-router'
import MapView from '../views/MapView.vue'
import ListView from '../views/ListView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/map',
    },
    {
      path: '/map',
      name: 'map',
      component: MapView,
    },
    {
      path: '/list',
      name: 'list',
      component: ListView,
    },
  ],
})

export default router
