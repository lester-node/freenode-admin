import React, { useRef, useState } from 'react'
import { useMount } from 'ahooks'
import useRequest from '@ahooksjs/use-request'
import {
  Modal,
  Button,
  Form,
  message,
  Switch,
  Select,
  InputNumber
} from 'antd'
import { history } from 'umi'
import api from '../../service'

const Index = (props: any) => {
  const { modal, onClose } = props
  const { info, visible } = modal
  const [form] = Form.useForm()
  const [courseEnum, setCourseEnum] = useState([])

  useMount(() => {
    if (info?.id) {
      form.setFieldsValue({
        show: info.show,
        courseId: info.courseId,
        weight: info.weight
      })
    } else {
      form.setFieldsValue({ show: true })
    }
  })

  const { run: courseArticleCreateOrUpdateRun } = useRequest(
    (obj) =>
      obj?.id ? api.courseArticleUpdate(obj) : api.courseArticleCreate(obj),
    {
      manual: true,
      onSuccess: (res: any) => {
        if (res.result === 0) {
          message.success(res.message || '操作成功')
          history.push('/admin/courseArticle')
        } else {
          message.error(res.message || '操作失败')
        }
      },
      onError: (res: any) => {
        message.error(res.message || '操作失败')
      }
    }
  )

  const { run: courseListRun } = useRequest(() => api.courseList({}), {
    manual: false,
    onSuccess: (res: any) => {
      if (res.result === 0) {
        setCourseEnum(res.data)
      } else {
        message.error(res.message || '操作失败')
      }
    },
    onError: (res: any) => {
      message.error(res.message || '操作失败')
    }
  })

  const onFinish = async () => {
    try {
      await form.validateFields()
      const formData = form.getFieldsValue(true)
      const sendData = {
        courseId: formData?.courseId?.value,
        courseName: formData?.courseId?.label,
        weight: formData?.weight,
        show: formData?.show,
        id: info?.id,
        content: info?.content,
        title: info?.title
      }
      console.log('新增参数', sendData)
      courseArticleCreateOrUpdateRun(sendData)
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    }
  }

  const viewModalProps = {
    title: '发布文章',
    visible: visible,
    destroyOnClose: true,
    width: '500px',
    onCancel: onClose,
    footer: [
      <Button key="cancal" onClick={onClose}>
        取消
      </Button>,
      <Button key="publish" onClick={onFinish} type="primary">
        发布文章
      </Button>
    ]
  }

  return (
    <Modal {...viewModalProps}>
      <Form
        name="create"
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <Form.Item
          label="教程分类"
          name="courseId"
          rules={[{ required: true, message: '请输入教程分类!' }]}
        >
          <Select
            placeholder="请选择教程分类"
            allowClear={true}
            labelInValue={true}
          >
            {Array.isArray(courseEnum)
              && courseEnum.map((item: any) => {
                return (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                )
              })}
          </Select>
        </Form.Item>
        <Form.Item
          label="权重"
          name="weight"
          rules={[{ required: true, message: '请输入权重!' }]}
        >
          <InputNumber
            min={1}
            style={{ width: '100%' }}
            placeholder="请输入权重"
          />
        </Form.Item>
        <Form.Item label="展示" name="show" valuePropName="checked">
          <Switch checkedChildren="开启" unCheckedChildren="关闭" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default Index
