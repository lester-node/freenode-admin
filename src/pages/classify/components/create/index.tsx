import React, { useRef, useState } from 'react';
import { useMount } from 'ahooks';
import useRequest from '@ahooksjs/use-request';
import {
  Spin,
  Modal,
  Row,
  Col,
  Button,
  Form,
  Input,
  Select,
  message,
  Switch,
} from 'antd';
import api from '../../service';

const Index = (props: any) => {
  const { modal, onClose } = props;
  const { info, visible, onReset } = modal;
  const [form] = Form.useForm();

  useMount(() => {
    if (info?.id) {
      form.setFieldsValue({
        name: info.name,
        show: info.show,
      });
    } else {
      form.setFieldsValue({ show: true });
    }
  });

  const { run: classifyCreateOrUpdateRun } = useRequest(
    (obj) => (obj?.id ? api.classifyUpdate(obj) : api.classifyCreate(obj)),
    {
      manual: true,
      onSuccess: (res: any) => {
        if (res.result === 0) {
          message.success('新增成功');
          onReset();
          onClose();
        } else {
          message.error(res.message || '操作失败');
        }
      },
      onError: (res: any) => {
        message.error(res.message || '操作失败');
      },
    },
  );

  const onFinish = async () => {
    try {
      await form.validateFields();
      let formData = form.getFieldsValue(true);
      let sendData = {
        show: formData?.show,
        id: info?.id,
        name: formData?.name,
      };
      console.log('新增参数', sendData);
      classifyCreateOrUpdateRun(sendData);
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  const modalProps = {
    title: '新增',
    visible: visible,
    destroyOnClose: true,
    width: '500px',
    onCancel: onClose,
    footer: [
      <Button key="cancal" onClick={onClose}>
        取消
      </Button>,
      <Button key="publish" onClick={onFinish} type="primary">
        新增
      </Button>,
    ],
  };

  return (
    <Modal {...modalProps}>
      <Form
        name="create"
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <Form.Item
          label="分类名称"
          name="name"
          rules={[{ required: true, message: '请输入分类名称!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="展示" name="show" valuePropName="checked">
          <Switch checkedChildren="开启" unCheckedChildren="关闭" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Index;
