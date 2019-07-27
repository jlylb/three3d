import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/c3',
    component: () => import('@/views/c3.vue')
  },
  {
    path: '/c4',
    component: () => import('@/views/c4.vue')
  },
  {
    path: '/c5',
    component: () => import('@/views/c5.vue')
  },
  {
    path: '/c6',
    component: () => import('@/views/c6.vue')
  },
  {
    path: '/c7',
    component: () => import('@/views/c7.vue')
  },
  {
    path: '/c8',
    component: () => import('@/views/c8.vue')
  },
  {
    path: '/c9',
    component: () => import('@/views/c9.vue')
  },
  {
    path: '/c10',
    component: () => import('@/views/c10.vue')
  },
  {
    path: '/c11',
    component: () => import('@/views/c11.vue')
  },
  {
    path: '/c12',
    component: () => import('@/views/c12.vue')
  },
  {
    path: '/c13',
    component: () => import('@/views/c13.vue')
  },
  {
    path: '/c14',
    component: () => import('@/views/c14.vue')
  },
  {
    path: '/c15',
    component: () => import('@/views/c15.vue')
  },
  {
    path: '/c16',
    component: () => import('@/views/c16.vue')
  },
  {
    path: '/c17',
    component: () => import('@/views/c17.vue')
  },
  {
    path: '/c18',
    component: () => import('@/views/c18.vue')
  },
  {
    path: '/c19',
    component: () => import('@/views/c19.vue')
  },
  {
    path: '/c20',
    component: () => import('@/views/c20.vue')
  },
  {
    path: '/c21',
    component: () => import('@/views/c21.vue')
  },
  {
    path: '/c22',
    component: () => import('@/views/c22.vue')
  }
]

var router = new VueRouter({
  routes
})

export default router
