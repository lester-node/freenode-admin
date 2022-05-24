import { post, postFormData } from '@/utils/request'

// 登录
const api = {
  articleCreate: (data: any) => post('/v1/article/articleCreate', data),
  upload: (data: any) => postFormData('/v1/common/upload', data)
}

export default api
