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
    path: '/home',
    component: Layout,
    children: [{
      path: '',
      name: 'Home',
      component: () => import('@/views/dashboard/index'),
      meta: {
        title: '工作台',
        icon: 'workbench'
      }
    }]
  },
  {
    path: '/hotel',
    component: Layout,
    meta: {
      title: '酒店管理',
      icon: 'hotel'
    },
    children: [{
        path: 'bind',
        name: 'Bind',
        component: () => import('@/views/hotelmanage/bind'),
        meta: {
          title: '绑定管理'}
      },
      {
        path: 'manage',
        name: 'Hotelmanage',
        component: () => import('@/views/hotelmanage/index'),
        meta: {title: '酒店管理'},
      },
      {
        path: 'details',
        name: 'Hoteldetails',
        component: () => import('@/views/hotelmanage/details'),
        meta: {
          title: '酒店详情'
        },
        hidden: true
      }
    ]
  },

  {
    path: '/ordermanage',
    component: Layout,
    children: [{
        path: 'manage',
        name: 'Ordermanage',
        component: () => import('@/views/ordermanage/manager'),
        meta: {
          title: '订单管理',
          icon: 'order'
        }
      },
      {
        path: 'details',
        name: 'Orderdetails',
        component: () => import('@/views/ordermanage/details'),
        meta: {
          title: '订单详情'
        },
        hidden: true
      }
    ]
  },

  {
    path: '/roommanage',
    component: Layout,
    children: [{
        path: 'manage',
        name: 'Roommanage',
        component: () => import('@/views/roommanage/manager'),
        meta: {
          title: '房型管理',
          icon: 'room'
        }
      },
      {
        path: 'details',
        name: 'Roomdetails',
        component: () => import('@/views/roommanage/details'),
        meta: {
          title: '房型详情'
        },
        hidden: true
      }
    ]
  },
  {
    path: '/giftmanage',
    component: Layout,
    children: [{
        path: 'manage',
        name: 'Giftmanage',
        component: () => import('@/views/giftmanage/manager'),
        meta: {
          title: '礼包管理',
          icon: 'room'
        }
      },
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
