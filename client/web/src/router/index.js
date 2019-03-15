import Vue from 'vue'
import Router from 'vue-router'
import layout from '@/views/layout'
Vue.use(Router)


export const routes = [
  {
    path: '/',
    component: layout,
    redirect: '/index',
    children: [
      {
        path: 'index',
        name: 'Index',
        meta: {
          keepAlive: true
        },
        component: () => import('@/views/article')
      }
    ]
  },
  {
    path: '/article',
    component: layout,
    redirect: '/article/detail',
    children: [
      {
        path: 'detail/:id',
        name: 'Detail',
        component: () => import('@/views/article/detail')
      }
    ]
  },
  {
    path: '/user',
    component: layout,
    children: [
      {
        path: ':user_id',
        name: 'User',
        component: () => import('@/views/user/home'),
        children: [
          {
            path: 'profile',
            name: 'Profile',
            component: () => import('@/views/user/profile')
          }
        ]
      }
      
    ]
  }
]
/**
 * 参数一定要是routes
 */
export default new Router({
  routes
})