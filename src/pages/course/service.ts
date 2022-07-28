import { post, get } from '@/utils/request'

const api = {
  coursePage: (data: any) => get('/v1/course/coursePage', data),
  courseDelete: (data: any) => post('/v1/course/courseDelete', data),
  courseChangeShow: (data: any) => post('/v1/course/courseChangeShow', data),
  courseCreate: (data: any) => post('/v1/course/courseCreate', data),
  courseUpdate: (data: any) => post('/v1/course/courseUpdate', data)
}

export default api
