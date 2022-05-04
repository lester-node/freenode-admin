import axios, { Method } from 'axios'

interface Response<T> {
  data: T;
  message: string;
  result: number;
}

function requestLogin<T> (url: string, type: Method, data?: any) {
  return new Promise<Response<T>>((resolve, reject) => {
    const requestOption = {
      url,
      data,
      method: type,
      params: {},
      headers: {
        'Content-Type': 'application/json'
      }
    }

    axios(requestOption)
      .then((res) => {
        const { data } = res
        if (data.result === 0) {
          const { access_token = null } = JSON.parse(
            res.headers['access-token']
          )
            ? JSON.parse(res.headers['access-token'])
            : {}
          resolve({
            ...data,
            access_token: access_token
          })
        } else {
          reject(res.data)
        }
      })
      .catch((err) => reject(err))
  })
}

function request<T> (url: string, type: Method, data?: any) {
  return new Promise<Response<T>>((resolve, reject) => {
    const requestOption = {
      url,
      data,
      method: type,
      params: {},
      headers: {
        // Authorization: 'Bearer' + ' ' + token,
        // access_token: token,
        'Content-Type': 'application/json'
      }
    }

    type.toUpperCase() === 'GET' && (requestOption.params = data)

    axios(requestOption)
      .then((res) => {
        const { data } = res
        resolve(data)
      })
      .catch((err) => reject(err))
  })
}

export function postLogin<T> (url: string, data?: any) {
  return requestLogin<T>(url, 'POST', data)
}

export function get<T> (url: string, data?: any) {
  return request<T>(url, 'GET', data)
}

export function post<T> (url: string, data?: any) {
  return request<T>(url, 'POST', data)
}
