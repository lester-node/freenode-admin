import { post, get } from '@/utils/request'

const api = {
  articlePage: (data: any) => get('/v1/article/articlePage', data),
  articleDelete: (data: any) => post('/v1/article/articleDelete', data),
  articleChangeShow: (data: any) => post('/v1/article/articleChangeShow', data),
  classifyList: (data: any) => post('/v1/classify/classifyList', data),
  tagList: (data: any) => post('/v1/tag/tagList', data)
}

export default api
