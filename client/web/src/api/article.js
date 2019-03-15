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
export function getArticleList(data) {
  return request({
    url: '/article/list',
    method: 'get',
    params: data
  })
}
export function getRecommendList() {
  return request({
    url: '/article/recommend',
    method: 'get'
  })
}
export function getArticleDetail(id) {
  return request({
    url: '/article/detail',
    method: 'get',
    params: { id }
  })
}
export function searchArticle(data) {
  return request({
    url: '/article/search',
    method: 'post',
    data
  })
}
