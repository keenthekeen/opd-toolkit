import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/ncd',
      name: 'ncd',
      component: () => import('../views/NCDView.vue'),
    },
    {
      path: '/lab',
      name: 'lab',
      // lazy-loaded when the route is visited.
      component: () => import('../views/LabView.vue'),
    },
    {
      path: '/phonebook',
      name: 'phonebook',
      // lazy-loaded when the route is visited.
      component: () => import('../views/PhonebookView.vue'),
    },
  ],
})

export default router
