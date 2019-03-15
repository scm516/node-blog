import request from '@/utils/request'

export function getCategoryList(params) {
  return request({
    url: '/category/list',
    method: 'get',
    params
  })
}
export function addCategory(data) {
  return request({
    url: '/category/create',
    method: 'post',
    data
  })
}
export function updateCategory(data) {
  return request({
    url: '/category/update',
    method: 'post',
    data
  })
}
export function deleteCategory(id) {
  return request({
    url: '/category/delete',
    method: 'post',
    data: { id }
  })
}
