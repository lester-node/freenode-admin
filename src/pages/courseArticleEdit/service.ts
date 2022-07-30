import { post, postFormData } from '@/utils/request'

const api = {
  courseArticleCreate: (data: any) =>
    post('/v1/courseArticle/courseArticleCreate', data),
  courseArticleUpdate: (data: any) =>
    post('/v1/courseArticle/courseArticleUpdate', data),
  courseArticleSelectOne: (data: any) =>
    post('/v1/courseArticle/courseArticleSelectOne', data),
  courseList: (data: any) => post('/v1/course/courseList', data),
};

export default api
