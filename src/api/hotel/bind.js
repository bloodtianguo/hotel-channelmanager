import request from '@/utils/request_hotel'
// 绑定列表查询
export function relationList(params) {
  return request({
    url: '/hotel/server/relation/list',
    method: 'post',
    data: params,
  })
}
//解绑
export function relaunbind(params) {
  return request({
    url: '/hotel/server/relation/unbind',
    method: 'post',
    params
  })
}
//单个绑定
export function relabind(params) {
  return request({
    url: '/hotel/server/relation/bind',
    method: 'post',
    params
  })
}

