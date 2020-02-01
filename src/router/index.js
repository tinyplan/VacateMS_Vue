import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'

Vue.use(Router)
/* 解决vue-router的bug */
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/index',
      name: 'Index',
      component: resolve => require(['@/components/Index'], resolve),
      redirect: '/home',
      children: [
        {
          path: '/home',
          name: 'Home',
          component: resolve => require(['@/components/Home'], resolve)
        },
        {
          path: '/search/:index',
          name: 'Search',
          component: resolve => require(['@/components/Search'], resolve)
        },
        {
          path: '/vacate',
          name: 'Vacate',
          component: resolve => require(['@/components/Vacate'], resolve)
        },
        {
          path: '/userSetting',
          name: 'UserSetting',
          component: resolve => require(['@/components/UserSetting'], resolve)
        },
        {
          path: '/feature',
          name: 'Feature',
          component: resolve => require(['@/components/Feature'], resolve)
        }
      ]
    }
  ]
})
