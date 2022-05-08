import { post } from '@/utils/request'

// 登录
const api = {
  getArticleById: (data: any) => post('/v1/article/getArticleById', data)
}

export default api
