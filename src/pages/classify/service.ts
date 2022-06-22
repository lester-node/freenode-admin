import { post, get } from '@/utils/request';

const api = {
  classifyPage: (data: any) => get('/v1/classify/classifyPage', data),
  classifyDelete: (data: any) => post('/v1/classify/classifyDelete', data),
  classifyChangeShow: (data: any) =>
    post('/v1/classify/classifyChangeShow', data),
  classifyCreate: (data: any) => post('/v1/classify/classifyCreate', data),
  classifyUpdate: (data: any) => post('/v1/classify/classifyUpdate', data),
};

export default api;
