import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Users from '../components/user/Users'
import Cate from '../components/goods/Cate'
import GoodsList from '../components/goods/List'
import Add from '../components/goods/Add'
import Shops from '../components/user/Shops'
import Order from '../components/Order/Order'
import ShoperGoods from '../components/goods/goodsList'

Vue.use(VueRouter)

const routes = [
  {
    path: '',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/goodslist',
        component: ShoperGoods
      },
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/shops',
        component: Shops
      },
      {
        path: '/categories',
        component: Cate,
      },
      {
        path: '/goods',
        component: GoodsList
      },
      {
        path: '/goods/add',
        component: Add
      },
      {
        path: '/orders',
        component: Order
      },
      {
        path: '/statistic',
        component: Welcome
      }

    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login')
    next();
  const token = window.sessionStorage.getItem('token');
  if (!token)
    return next('/login')
  next()
})

export default router

