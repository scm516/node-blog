// 通过函数返回state相应的值，方便取数据
const getters = {
  isLogin: state => state.user.isLogin,
  user_id: state => state.user.user_id,
  username: state => state.user.username,
  avatar: state => state.user.avatar,
  category: state => state.app.category,
  isEditProfile: state => state.app.isEditProfile,
  searchParam: state => state.app.searchParam,
  scrollTop: state => state.app.scrollTop
}
export default getters