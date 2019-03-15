import Cookies from 'js-cookie'

const TokenKey = 'User-Token'
const whiteList = [/index/, /article\/detail\/\d/ ] // 不重定向白名单

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token, { expires: 7 })
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
export { whiteList }