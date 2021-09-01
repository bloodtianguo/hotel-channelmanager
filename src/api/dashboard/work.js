import request from '@/utils/request_hotel'
// 平台工作台统计
export function getwork (uid) {
  return request({
    url: '/hotel/server/work/get',
    method: 'post',
    params:{
      _uid:uid
    }
  })
}
