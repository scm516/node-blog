import request from '@/utils/request'

export function getUserList(params) {
  return request({
    url: '/user/list',
    method: 'get',
    params
  })
}
export function updateUser(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data
  })
}
export function deleteUser(id) {
  return request({
    url: '/user/delete',
    method: 'post',
    data: { id }
  })
}
