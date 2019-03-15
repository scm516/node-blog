import Vue from 'vue'
import App from './App.vue'
import store from '@/store'
import router from '@/router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'minireset.css'
import '@/assets/style/index.scss'
import '@/permission'
import '@/icons'
import VueAwesomeSwiper from 'vue-awesome-swiper'
// require styles
import 'swiper/dist/css/swiper.css'
import 'github-markdown-css/github-markdown.css'

Vue.use(VueAwesomeSwiper, /* { default global options } */)


Vue.use(ElementUI, { size: 'medium' })



Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
