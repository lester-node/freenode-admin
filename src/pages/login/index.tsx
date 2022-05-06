import styles from './index.less'
import React, { useState } from 'react'
import api from './service'
import useRequest from '@ahooksjs/use-request'
import { history } from 'umi'
import { Form, Input, Button, Checkbox, message } from 'antd'

const Index = () => {
  const [userInfo, setUserInfo] = useState({ username: '', password: '' })

  const onFinish = () => {
    loginRun({
      username: userInfo.username,
      password: userInfo.password
    })
  }

  const { run: loginRun } = useRequest((obj) => api.login(obj), {
    manual: true,
    onSuccess: (res: any) => {
      if (res.result === 0) {
        history.push('/admin')
      } else {
        message.error(res.message || '操作失败')
      }
    },
    onError: (res: any) => {
      console.log('res', res)
      message.error(res.message || '操作失败')
    }
  })

  return (
    <div className={styles.login}>
      <div className={styles.modal}>
        <div className={styles.top}>freenode后台管理系统</div>
        <div className={styles.middle}>
          <input
            type="text"
            name="username"
            placeholder="请输入账号/用户名"
            className={styles.inputItem}
            onChange={(e) => {
              setUserInfo({
                ...userInfo,
                username: e.target.value
              })
            }}
          />
          <input
            type="password"
            name="password"
            placeholder="请输入密码"
            className={styles.inputItem}
            onChange={(e) => {
              setUserInfo({
                ...userInfo,
                password: e.target.value
              })
            }}
          />
          <div className={styles.btn} onClick={onFinish}>
            登录
          </div>
        </div>
        <div className={styles.msg}>
          没有账号?&nbsp;
          <a href="#">游客登录</a>
        </div>
      </div>
    </div>
  )
}

export default Index
