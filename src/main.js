// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// 入口文件
// 1.初始化了vue实例对象
// 2.插件的引用
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import VCharts from 'v-charts'
import GlobalConfig from './global_conf'

Vue.use(ElementUI)
Vue.use(VCharts)

Vue.prototype.global = GlobalConfig
Vue.prototype.$axios = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
