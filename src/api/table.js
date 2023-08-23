import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/file/list',
    method: 'get',
    params
  })
}
