import request from '@/utils/request_hotel'
//房型条件分页查询
export function roomlist(params) {
  return request({
    url: '/hotel/server/room/list',
    method: 'post',
    data: params,
  })
}
// 查询详情
export function roomget(params) {
  return request({
    url: '/hotel/server/room/get',
    method: 'post',
    params
  })
}
