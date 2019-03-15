
const app = {
  state: {
    isEditProfile: false,
    category: '',
    searchParam: null,
    scrollTop: 0 // 文章列表页面滚动条距离
  },
  mutations: {
    TOGGLE_PROFILE_PAGE(state, token) {
      state.isEditProfile = token
    },
    CHANGE_CATEGORY(state, token) {
      state.category = token
    },
    CHANGE_SEARCH_PARAM(state, token) {
      state.searchParam = token
    },
    CHANGE_SCROLL_TOP(state, token) {
      state.scrollTop = token
    }
   },
  actions: {
    toggleProfilePage({ commit }, info) {
      console.log(info)
      commit('TOGGLE_PROFILE_PAGE', info)
    },
    changeCategory({ commit }, category) {
      commit('CHANGE_CATEGORY', category)
    },
    changeSearchParam({ commit }, param) {
      commit('CHANGE_SEARCH_PARAM', param)
    },
    changeScrollTop({ commit }, param) {
      commit('CHANGE_SCROLL_TOP', param)
    }
  }
}

export default app