import { post, postFormData } from '@/utils/request'

const api = {
  articleCreate: (data: any) => post('/v1/article/articleCreate', data),
  articleUpdate: (data: any) => post('/v1/article/articleUpdate', data),
  articleSelectOne: (data: any) => post('/v1/article/articleSelectOne', data),
  classifyList: (data: any) => post('/v1/classify/classifyList', data),
  tagList: (data: any) => post('/v1/tag/tagList', data),
};

export default api
