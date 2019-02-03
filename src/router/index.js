import Vue from 'vue'
import Router from 'vue-router'
import useEle from '@/components/common/useEle.vue'
import Login from '@/components/login/login.vue'
import Home from '@/components/pages/home.vue'
import User from '@/components/pages/user/user.vue'
import Rights from '@/components/pages/rights/rights.vue'
import Roles from '@/components/pages/roles/roles.vue'
import Goods from '@/components/pages/goods/goods.vue'
import GoodsAdd from '@/components/pages/goods/add.vue'
import Categories from '@/components/pages/categories/categories.vue'
import Orders from '@/components/pages/orders/orders.vue'
import Reports from '@/components/pages/reports/reports.vue'

// 单独引用 message
import { Message } from 'element-ui'

Vue.use(Router)

var router = new Router({
  routes: [
    // 设置默认首页，重定向到 home
    {
      path: '/',
      redirect: '/home'
    },
    {
      name: 'ele',
      path: '/ele',
      component: useEle
    },
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/home',
      component: Home,
      children: [
        {
          path: '/users', // /user
          component: User
        },
        {
          path: '/rights',
          component: Rights
        },
        {
          path: '/roles',
          component: Roles
        },
        {
          path: '/goods',
          component: Goods
        },
        {
          path: '/goods/add',
          component: GoodsAdd
        },
        {
          path: '/categories',
          component: Categories
        },
        {
          path: '/orders',
          component: Orders
        },
        {
          path: '/reports',
          component: Reports
        }
      ]
    }
  ]
})
// 添加一个前置导航守卫
//  这句代码会在路由发生改变之前执行，如果不调用 next 方法，后续的代码不会执行
router.beforeEach((to, from, next) => {
  // 在判断时，需要将 login 路由排除掉
  if (to.path !== '/login') {
    // 判断用户是否登录:验证 token
    var token = window.localStorage.getItem('token')
    if (!token) {
      // 提示用户没有登录
      // eslint-disable-next-line no-undef
      Message.error('您还没有登录，请先登录')
      router.push('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})
export default router
