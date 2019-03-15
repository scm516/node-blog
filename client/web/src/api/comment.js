import request from '@/utils/request'

export function addComment(data) {
  return request({
    url: '/comment/add',
    method: 'post',
    data
  })
}
export function getArticleCommentList(article_id) {
  return request({
    url: '/comment/articleComment',
    method: 'get',
    params: { article_id }
  })
}

