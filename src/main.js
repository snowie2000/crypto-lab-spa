import Vue from 'vue'
import App from './App.vue'
import r from "@/config/routes"

Vue.config.productionTip = false

new Vue({
  router: r,
  render: h => h(App),
}).$mount('#app')
