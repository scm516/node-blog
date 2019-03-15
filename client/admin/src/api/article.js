import request from '@/utils/request'

export function createArticle(data) {
  return request({
    url: '/article/create',
    method: 'post',
    data
  })
}
export function updateArticle(data) {
  return request({
    url: '/article/update',
    method: 'post',
    data
  })
}
export function deleteArticle(id) {
  return request({
    url: '/article/delete',
    method: 'post',
    data: { id }
  })
}
export function getArticleList(data) {
  return request({
    url: '/article/list',
    method: 'get',
    params: data
  })
}
export function getArticleDetail(id) {
  return request({
    url: '/article/detail',
    method: 'get',
    params: { id }
  })
}

