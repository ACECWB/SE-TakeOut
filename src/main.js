import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'
import swal from 'sweetalert'
import TreeTable from 'vue-table-with-tree-grid'

Vue.component('tree-table', TreeTable)
// axios.defaults.baseURL = 'http://27f8645n62.zicp.vip/rest-api/v1/'
axios.defaults.baseURL = 'http://121.4.77.69:3170/rest-api/v1/'

axios.interceptors.request.use(config => {
  console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
