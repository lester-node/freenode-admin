import { post } from '@/utils/request'

// 登录
const api = {
  login: (data: any) => post('/v1/user/login', data)
}

export default api
