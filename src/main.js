import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import wx from 'weixin-js-sdk';

import RongIMLib from '@/assets/rongyun/RongIMLib-2.4.0.min.js'

Vue.config.productionTip = false

console.log('fffffffffffffffffff',RongIMLib)
Vue.prototype.RongIMLib = RongIMLib
Vue.prototype.wx = wx

new Vue({
  el: "#app",
  router,
  wx,
  render: h => h(App)
});
