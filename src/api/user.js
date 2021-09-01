import request from '@/utils/request_hotel'
//获取验证码
export function getSms(params){
  return request({
    url: '/hotel/server/login/getPhoneSms2Login',
    method: 'get',
    params
  })
}
// 登录
export function login(params) {
  return request({
    url: '/hotel/server/login/login',
    method: 'post',
    params
  })
}

// 扫码登陆:获取创建二维码数据
export function getCreateScanData(data) {
  return request({
    url: '/hotel/server/login/getCreateScanData',
    method: 'post',
  })
}

// 扫码登陆：扫码轮询
export function getScanForInfo(data) {
  return request({
    url: '/hotel/server/login/getScanForInfo',
    method: 'post',
    params:{code:data}
  })
}
//扫码回调

export function getscanCallback(data) {
  return request({
    url: '/hotel/server/login/scanCallback',
    method: 'post',
    params:{code:data}
  })
}
