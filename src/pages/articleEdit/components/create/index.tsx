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
import { history } from 'umi';
import api from '../../service';

const Index = (props: any) => {
  const { modal, onClose } = props;
  const { info, visible } = modal;
  const [form] = Form.useForm();
  const [classifyEnum, setClassifyEnum] = useState([]);
  const [tagEnum, setTagEnum] = useState([]);

  useMount(() => {
    classifyEnumRun();
    tagEnumRun();
    if (info?.id) {
      form.setFieldsValue({
        show: info.show,
        classifyId: { value: info?.classifyId, label: info?.classifyName },
        tagId: info?.tagId
          ?.split(',')
          ?.map((item: string, index: number) => ({
            value: item,
            label: info.tagName.split(',')[index],
          })),
      });
    } else {
      form.setFieldsValue({ show: true });
    }
  });

  const { run: articleCreateOrUpdateRun } = useRequest(
    (obj) => (obj?.id ? api.articleUpdate(obj) : api.articleCreate(obj)),
    {
      manual: true,
      onSuccess: (res: any) => {
        if (res.result === 0) {
          history.push('/admin/article');
        } else {
          message.error(res.message || '操作失败');
        }
      },
      onError: (res: any) => {
        message.error(res.message || '操作失败');
      },
    },
  );

  const onFinish = () => {
    let formData = form.getFieldsValue(true);
    let sendData = {
      classifyId: formData?.classifyId?.value,
      classifyName: formData?.classifyId?.label,
      tagId: formData?.tagId?.map((item: any) => item.value).join(','),
      tagName: formData?.tagId?.map((item: any) => item.label).join(','),
      show: formData?.show,
      id: info?.id,
      content: info?.content,
      title: info?.title,
    };
    console.log('新增参数', sendData);
    articleCreateOrUpdateRun(sendData);
  };

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
      </Button>,
    ],
  };

  const { run: classifyEnumRun } = useRequest(() => api.classifyEnum({}), {
    manual: true,
    onSuccess: (res: any) => {
      if (res.result === 0) {
        setClassifyEnum(res.data);
      } else {
        message.error(res.message || '操作失败');
      }
    },
    onError: (res: any) => {
      message.error(res.message || '操作失败');
    },
  });

  const { run: tagEnumRun } = useRequest(() => api.tagEnum({}), {
    manual: true,
    onSuccess: (res: any) => {
      if (res.result === 0) {
        setTagEnum(res.data);
      } else {
        message.error(res.message || '操作失败');
      }
    },
    onError: (res: any) => {
      message.error(res.message || '操作失败');
    },
  });

  return (
    <Modal {...viewModalProps}>
      <Form
        name="create"
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <Form.Item label="分类" name="classifyId">
          <Select
            placeholder="请选择分类"
            allowClear={true}
            labelInValue={true}
          >
            {Array.isArray(classifyEnum) &&
              classifyEnum.map((item: any) => {
                return (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                );
              })}
          </Select>
        </Form.Item>
        <Form.Item label="标签" name="tagId">
          <Select
            placeholder="请选择标签"
            allowClear={true}
            labelInValue={true}
            mode="multiple"
          >
            {Array.isArray(tagEnum) &&
              tagEnum.map((item: any) => {
                return (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                );
              })}
          </Select>
        </Form.Item>
        <Form.Item label="标签" name="show" valuePropName="checked">
          <Switch checkedChildren="开启" unCheckedChildren="关闭" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Index;
