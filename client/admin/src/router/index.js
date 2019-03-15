import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },

  {
    path: '/admin',
    component: Layout,
    name: 'Admin',
    redirect: '/amin/user',
    meta: { title: '管理员', icon: 'form' },
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/admin/user'),
        meta: { title: '用户管理', icon: 'form' }
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/admin/role'),
        meta: { title: '权限管理', icon: 'form' }
      }
    ]
  },

  {
    path: '/article',
    component: Layout,
    name: 'Article',
    redirect: '/article/list',
    meta: { title: '文章管理', icon: 'form' },
    children: [
      {
        path: 'list',
        name: 'List',
        component: () => import('@/views/article/list'),
        meta: { title: '文章列表', icon: 'form' }
      },
      {
        path: 'add',
        name: 'Add',
        component: () => import('@/views/article/add'),
        meta: { title: '新增文章', icon: 'form' }
      },
      {
        path: 'update',
        name: 'Update',
        hidden: true,
        component: () => import('@/views/article/update'),
        meta: { title: '修改文章', icon: 'form' }
      }
    ]
  },

  {
    path: '/category',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Category',
        component: () => import('@/views/category/index'),
        meta: { title: '分类管理', icon: 'form' }
      }
    ]
  },
  // { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
