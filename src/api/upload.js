import request from '@/utils/request_upload'
export function uploadImg(data){
  return request({
    headers:{Authorization:''},
    url:'/api/v1/basic/uploadFile',
    method:'POST',
    data
  })
}
