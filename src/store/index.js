import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: { // 放数据
    isAdmin: false,
    shopName: '',
    shopId: ''
  },
  mutations: {  // 唯一改变state值的方法

  },
  actions: {

  },
  getters: { // 给数据state时做变化

  },
  modules: {

  }
})

export default store