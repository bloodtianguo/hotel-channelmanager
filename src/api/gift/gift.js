import request from '@/utils/request_hotel'
// 列表查询
export function relationList(params) {
  return request({
    url: '/hotel/server/spree/list',
    method: 'post',
    data: params,
  })
}
// 新增礼包
export function spreeAdd(params) {
  return request({
    url: '/hotel/server/spree/add',
    method: 'post',
    data: params,
  })
}
//下架
export function spreeOffline(params) {
  return request({
    url: '/hotel/server/spree/offline',
    method: 'post',
    params
  })
}
//上架
export function spreeonline(params) {
  return request({
    url: '/hotel/server/spree/online',
    method: 'post',
    params
  })
}

