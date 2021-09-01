import request from '@/utils/request_hotel'
// 酒店申请条件分页查询
export function hotelList(params) {
  return request({
    url: '/hotel/server/hotel/list',
    method: 'post',
    data: params,
  })
}
// 查询酒店详情接口
export function hotelGet(params) {
  return request({
    url: '/hotel/server/hotel/get',
    method: 'post',
    params
  })
}
