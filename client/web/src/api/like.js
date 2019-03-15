import request from '@/utils/request'

export function updateLike(data) {
  return request({
    url: '/like/update',
    method: 'post',
    data
  })
}

