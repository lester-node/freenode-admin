import styles from './index.less'
import React from 'react'
import api from './service'
import useRequest from '@ahooksjs/use-request'
import { history } from 'umi'
import { Form, Input, Button, Checkbox, message } from 'antd'

const Index = () => {
  const onFinish = (values: any) => {
    console.log('Success:', values)
    loginRun({
      username: values.username,
      password: values.password
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
      <Form
        name="basic"
        labelCol={{
          span: 8
        }}
        wrapperCol={{
          span: 16
        }}
        initialValues={{
          remember: true
        }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="用户名"
          name="username"
          rules={[
            {
              required: true,
              message: '请输入用户名!'
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="密码"
          name="password"
          rules={[
            {
              required: true,
              message: '请输入密码!'
            }
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16
          }}
        >
          <Button type="primary" htmlType="submit">
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Index
