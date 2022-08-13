import { post, get } from '@/utils/request'

const api = {
  courseArticlePage: (data: any) =>
    get('/v1/courseArticle/courseArticlePage', data),
  courseArticleDelete: (data: any) =>
    post('/v1/courseArticle/courseArticleDelete', data),
  courseArticleChangeShow: (data: any) =>
    post('/v1/courseArticle/courseArticleChangeShow', data),
  courseList: (data: any) => post('/v1/course/courseList', data)
}

export default api
