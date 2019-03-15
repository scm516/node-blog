import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权
import { whiteList } from '@/utils/auth'
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (store.getters.user_id === '') {
      store.dispatch('GetInfo').then(res => {
      }).catch(err => {
        // 验证失败
        store.dispatch('changeLoginState', false)
        next('/index')
      })
    } else {
      next()
    }
    
  } else {
    let isWhitePath = whiteList.some(item => {
      return item.test(to.path)
    })
    if (isWhitePath) {
      // next脸面不在任何参数不走router.beforeEach
      next()
    } else {
      next('/')
      NProgress.done()
    }
  }
  next()
  NProgress.done()

})

router.afterEach(() => {
  NProgress.done() // 结束Progress
}) 