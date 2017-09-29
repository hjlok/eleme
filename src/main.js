// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Router from 'vue-router'
import Resource from 'vue-resource'
import '../static/css/reset.css'
import App from './App.vue'
import goods from './components/goods/goods.vue'
import ratings from './components/ratings/ratings.vue'
import sellers from './components/sellers/sellers.vue'

Vue.config.productionTip = false

Vue.use(Router)
Vue.use(Resource)

const router = new Router({
  	routes :[
  		{path: '/', redirect: '/goods'},//默认进入第一个
	  	{ path: '/goods', component: goods },
	  	{ path: '/ratings', component: ratings },
	  	{ path: '/sellers', component: sellers }
		],
	linkActiveClass: "active"
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})

