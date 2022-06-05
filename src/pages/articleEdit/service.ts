import { post, postFormData } from '@/utils/request'

const api = {
  articleCreate: (data: any) => post('/v1/article/articleCreate', data),
  articleUpdate: (data: any) => post('/v1/article/articleUpdate', data),
  upload: (data: any) => postFormData('/v1/common/upload', data),
  articleSelectOne: (data: any) => post('/v1/article/articleSelectOne', data),
};

export default api
