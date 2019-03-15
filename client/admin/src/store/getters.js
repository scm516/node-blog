const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  username: state => state.user.username,
  user_id: state => state.user.user_id,
  roles: state => state.user.roles
}
export default getters
