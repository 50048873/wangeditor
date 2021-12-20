import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import {Modal} from 'ant-design-vue'
import 'ant-design-vue/lib/modal/style/css'
Vue.use(Modal)
Vue.prototype.$confirm = Modal.confirm
Vue.prototype.$info = Modal.info

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
