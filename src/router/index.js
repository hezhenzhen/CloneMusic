import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Index from '@/components/Index'
import RecommendDetail from '@/components/RecommendDetail'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/recommend/:id',
      name: 'RecommendDetail',
      component: RecommendDetail
    }
  ]
})
