import { post, get } from '@/utils/request';

const api = {
  articlePage: (data: any) => get('/v1/article/articlePage', data),
  articleDelete: (data: any) => post('/v1/article/articleDelete', data),
  articleChangeShow: (data: any) => post('/v1/article/articleChangeShow', data),
  classifyEnum: (data: any) => post('/v1/classify/classifyEnum', data),
  tagEnum: (data: any) => post('/v1/tag/tagEnum', data),
};

export default api;
