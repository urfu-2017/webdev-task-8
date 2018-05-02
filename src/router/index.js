import Vue from 'vue'
import Router from 'vue-router'
import Pig from '../components/Pig'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Pig',
      component: Pig
    }
  ]
})
