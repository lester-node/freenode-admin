import React, { useState } from "react";
import { useMount } from "ahooks";
import useRequest from "@ahooksjs/use-request";
import { Modal, Button, Form, Select, message, Switch } from "antd";
import { history } from "umi";
import api from "../../service";

const Index = (props: any) => {
  const { modal, onClose } = props;
  const { info, visible } = modal;
  const [form] = Form.useForm();
  const [classifyEnum, setClassifyEnum] = useState([]);
  const [tagList, setTagList] = useState([]);

  useMount(() => {
    if (info?.id) {
      form.setFieldsValue({
        show: info.show,
        classifyId: info.classifyId
          ? { value: info?.classifyId, label: info?.classifyName }
          : undefined,
        tagId: info?.tagId?.split(",")?.map((item: string, index: number) => ({
          value: item,
          label: info.tagName.split(",")[index],
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
      onSuccess: (res: { result: number; data: any; message: string }) => {
        if (res.result === 0) {
          message.success(res.message || "操作成功");
          history.push("/admin/article");
        } else {
          message.error(res.message || "操作失败");
        }
      },
      onError: (res: { message: string }) => {
        message.error(res.message || "操作失败");
      },
    }
  );

  const onFinish = () => {
    const formData = form.getFieldsValue(true);
    const sendData = {
      classifyId: formData?.classifyId?.value,
      classifyName: formData?.classifyId?.label,
      tagId: formData?.tagId?.length
        ? formData?.tagId
            ?.map((item: { value: string }) => item.value)
            .join(",")
        : undefined,
      tagName: formData?.tagId?.length
        ? formData?.tagId
            ?.map((item: { label: string }) => item.label)
            .join(",")
        : undefined,
      show: formData?.show,
      id: info?.id,
      content: info?.content,
      title: info?.title,
    };
    console.log("新增参数", sendData);
    articleCreateOrUpdateRun(sendData);
  };

  const viewModalProps = {
    title: "发布文章",
    visible: visible,
    destroyOnClose: true,
    width: "500px",
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

  const { run: classifyListRun } = useRequest(() => api.classifyList({}), {
    manual: false,
    onSuccess: (res: { result: number; data: any; message: string }) => {
      if (res.result === 0) {
        setClassifyEnum(res.data);
      } else {
        message.error(res.message || "操作失败");
      }
    },
    onError: (res: { message: string }) => {
      message.error(res.message || "操作失败");
    },
  });

  const { run: tagListRun } = useRequest(() => api.tagList({}), {
    manual: false,
    onSuccess: (res: { result: number; data: any; message: string }) => {
      if (res.result === 0) {
        setTagList(res.data);
      } else {
        message.error(res.message || "操作失败");
      }
    },
    onError: (res: { message: string }) => {
      message.error(res.message || "操作失败");
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
              classifyEnum.map((item: { id: string; name: string }) => {
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
            {Array.isArray(tagList) &&
              tagList.map((item: { id: string; name: string }) => {
                return (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                );
              })}
          </Select>
        </Form.Item>
        <Form.Item label="展示" name="show" valuePropName="checked">
          <Switch checkedChildren="开启" unCheckedChildren="关闭" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Index;
