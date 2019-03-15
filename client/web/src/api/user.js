import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/user/login',
    method: 'post',
    data: { username, password }
  })
}
export function register(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}
export function logout() {
  return request({
    url: '/user/logout',
    method: 'post',
  })
}
export function getInfo() {
  return request({
    url: '/user/info',
    method: 'get',
  })
}
export function updateInfo(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data
  })
}