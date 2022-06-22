import { post, get } from '@/utils/request';

const api = {
  tagPage: (data: any) => get('/v1/tag/tagPage', data),
  tagDelete: (data: any) => post('/v1/tag/tagDelete', data),
  tagChangeShow: (data: any) =>
    post('/v1/tag/tagChangeShow', data),
  tagCreate: (data: any) => post('/v1/tag/tagCreate', data),
  tagUpdate: (data: any) => post('/v1/tag/tagUpdate', data),
};

export default api;
