import request from '@/utils/request'
import user from '@/views/login'
export function  getList () {
  return request({
    url: '/file/list',
    method: 'post',
    params :{ user }
  })
}

export function getInfo(token) {
  return request({
    url: '/file/info',
    method: 'post',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/file/logout',
    method: 'post'
  })
}
