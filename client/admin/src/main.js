import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store';

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import '@/icons' // icon
import '@/permission' // permission control
Vue.use(mavonEditor)
Vue.use(ElementUI, { locale, size: 'medium' })

Vue.config.productionTip = false
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
