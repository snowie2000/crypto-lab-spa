import Vue from 'vue'
import App from './App.vue'
import r from "@/config/routes"

(function () {
  if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
})()

Vue.config.productionTip = false

new Vue({
  router: r,
  render: h => h(App),
}).$mount('#app')
