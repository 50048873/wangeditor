import Vue from 'vue'
import VueRouter from 'vue-router'
import About from '../views/About.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: About,
  },
  // {
  //   path: '/about',
  //   name: 'about',
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // },
  // {
  //   path: '/redips',
  //   name: 'redips',
  //   component: () => import(/* webpackChunkName: "about" */ '../views/Redips.vue')
  // }
]

const router = new VueRouter({
  routes
})

export default router
