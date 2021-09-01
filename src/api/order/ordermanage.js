import request from '@/utils/request_hotel'
// 订单条件分页查询
export function orderList (params) {
  return request({
    url: '/hotel/server/order/list',
    method: 'post',
    data:params,
  })
}

// 订单详情查询
export function orderdetail (params) {
  return request({
    url: '/hotel/server/order/get',
    method: 'post',
    params
  })
}
// 导出地址礼包
export function orderexport () {
  return request({
    url: '/hotel/server/order/export/export',
    method: 'post',
    responseType: 'blob'
  })
}
