import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    isLogin: !!getToken(),
    user_id: '',
    username: '',
    avatar: ''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_ID: (state, user_id) => {
      state.user_id = user_id
    },
    SET_NAME: (state, username) => {
      state.username = username
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    CHANGE_LOGIN_STATE: (state, loginState) => {
      state.isLogin = loginState
    },
    
  },

  actions: {

    changeLoginState({ commit }, loginState) {
      commit('CHANGE_LOGIN_STATE', loginState)
    },

    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          var data = response.data
          setToken(data.token)
          // commit('SET_TOKEN', data.token)
          // commit('SET_ID', data.id)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        let token = getToken()
        getInfo(state.token).then(response => {
          const data = response.data
          commit('SET_TOKEN', data.token)
          commit('SET_ID', data.id)
          commit('SET_AVATAR', data.avatar)
          commit('SET_NAME', data.username)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
        commit('SET_ID', null)
        commit('SET_NAME', '')
        commit('SET_AVATAR', '')
        commit('CHANGE_LOGIN_STATE', false)
        removeToken()
        resolve()
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
