import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/example/user',
    name: 'Example',
    meta: { title: '用户管理', icon: 'el-icon-user' },
    children: [
      {
        path: 'add',
        name: 'Add',
        component: () => import('@/views/User/add'),
        meta: { title: '个人信息', icon: 'add' ,icon: 'el-icon-user'}
      }
    ]
  },
  {
    path: '/file',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: '存储', icon: 'el-icon-cloudy' },
    children: [
      {
        path: 'list',
        name: 'List',
        component: () => import('@/views/table/index'),
        meta: { title: '存储列表', icon: 'list' }
      },
      {
        path: 'add',
        name: 'Add',
        component: () => import('@/views/table/add'),
        meta: { title: '好友分享', icon: 'add' }
      },
      {
        path: 'userpublic',
        name: 'Userpublic',
        component: () => import('@/views/table/userpublic'),
        meta: { title: '共享资源', icon: 'userpublic' }
      }
    ]
  },

  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: '联系我们', icon: 'el-icon-s-promotion' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()


export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
