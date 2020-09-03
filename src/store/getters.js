const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  username: state => state.user.username,
  account: state => state.user.account,
  email: state => state.user.email,
  role: state => state.user.role
}
export default getters
