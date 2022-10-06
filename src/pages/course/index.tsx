import React, { useEffect, useRef, useState } from "react";
import {
  Form,
  Row,
  Col,
  Input,
  Button,
  Table,
  message,
  Space,
  Switch,
  Modal,
  Pagination,
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import type { TableRowSelection } from "antd/lib/table/interface";
import useRequest from "@ahooksjs/use-request";
import styles from "./index.less";
import api from "./service";
import config from "./config";
import { useMount, useSize } from "ahooks";
import moment from "moment";
import { history } from "umi";
import Create from "./components/create";

export default () => {
  const ref: any = useRef();
  const size: any = useSize(ref);
  const tableHeight = {
    y: size ? size.height - 240 : window.innerHeight - 310,
  };

  const [form] = Form.useForm();
  const [pageData, setPageData] = useState(config.PAGEDATA);
  const [tableParams, setTableParams] = useState(config.TABLEPARAMS);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const [createModal, setCreateModal] = useState({
    info: {},
    visible: false,
    onReset: () => {},
  });

  useEffect(() => {
    coursePageRun(pageData);
  }, [pageData.page, pageData.rows, pageData.name]);

  const { run: coursePageRun } = useRequest((obj) => api.coursePage(obj), {
    manual: true,
    onSuccess: (res: { result: number; data: any; message: string }) => {
      if (res.result === 0) {
        setTableParams({
          dataList: res.data.rows,
          total: res.data.total,
        });
      } else {
        message.error(res.message || "操作失败");
      }
    },
    onError: (res: { message: string }) => {
      message.error(res.message || "操作失败");
    },
  });

  const { run: articleDeleteRun } = useRequest((obj) => api.courseDelete(obj), {
    manual: true,
    onSuccess: (res: { result: number; data: any; message: string }) => {
      if (res.result === 0) {
        const num = tableParams.total - (pageData.page - 1) * pageData.rows;
        if (pageData.page !== 1 && num === 1) {
          setPageData({ ...pageData, page: pageData.page - 1 });
        } else {
          coursePageRun(pageData);
        }
        setSelectedRowKeys([]);
        message.success(res.message || "删除成功");
      } else {
        message.error(res.message || "操作失败");
      }
    },
    onError: (res: { message: string }) => {
      message.error(res.message || "操作失败");
    },
  });

  const { run: articleChangeShowRun } = useRequest(
    (obj) => api.courseChangeShow(obj),
    {
      manual: true,
      onSuccess: (res: { result: number; data: any; message: string }) => {
        if (res.result === 0) {
          coursePageRun(pageData);
          message.success(res.message || "修改展示成功");
        } else {
          message.error(res.message || "操作失败");
        }
      },
      onError: (res: { message: string }) => {
        message.error(res.message || "操作失败");
      },
    }
  );

  const goCreate = (record?: any) => {
    setCreateModal({
      info: record.id ? record : {},
      visible: true,
      onReset: () => {
        coursePageRun(pageData);
      },
    });
  };

  const goArticle = (record: any) => {
    history.push(`/admin/courseArticle?id=${record.id}`);
  };

  const onFinish = () => {
    const values = form.getFieldsValue(true);
    console.log("value", values);
    setPageData({
      ...pageData,
      ...values,
    });
  };

  const rowSelection: TableRowSelection<any> = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const deleteRecord = (ids: any) => {
    Modal.confirm({
      title: "确定删除吗?",
      icon: <ExclamationCircleOutlined />,
      content: "",
      okType: "danger",
      onOk() {
        articleDeleteRun({ ids: ids });
      },
      onCancel() {},
    });
  };

  const switchChange = (value: any, record: any) => {
    articleChangeShowRun({ show: value, id: record.id });
  };

  const columns: any = [
    {
      title: "序号",
      dataIndex: "staffName",
      width: 100,
      render: (value: any, record: any, index: number) => {
        return (pageData.page - 1) * pageData.rows + index + 1;
      },
    },
    {
      title: "教程名称",
      dataIndex: "name",
      width: 100,
    },
    {
      title: "展示的文章数",
      dataIndex: "articleTotal",
      width: 100,
    },
    {
      title: "总文章数",
      dataIndex: "articleTotalNum",
      width: 100,
    },
    {
      title: "权重",
      dataIndex: "weight",
      width: 100,
    },
    {
      title: "是否展示",
      dataIndex: "show",
      width: 100,
      render: (value: any, record: any, index: number) => {
        return (
          <Switch
            checked={value}
            checkedChildren="开启"
            unCheckedChildren="关闭"
            onChange={(value) => switchChange(value, record)}
          />
        );
      },
    },
    {
      title: "最后更新时间",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 120,
      render: (value: any) => {
        return moment(value).format("YYYY-MM-DD HH:mm:ss");
      },
    },
    {
      title: "操作",
      dataIndex: "action",
      width: 120,
      fixed: "right",
      render: (value: any, record: any) => {
        return (
          <Space>
            <a onClick={() => goArticle(record)}>文章</a>
            <a onClick={() => goCreate(record)}>编辑</a>
            <a onClick={() => deleteRecord([record.id])}>删除</a>
          </Space>
        );
      },
    },
  ];

  return (
    <div className={styles.content} ref={ref}>
      <Form form={form} name="article_search" className={styles.form}>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item name="name" label="名称">
              <Input placeholder="请输入名称" allowClear={true} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col
            span={12}
            style={{
              textAlign: "left",
            }}
          >
            <Button type="primary" onClick={goCreate}>
              新增教程
            </Button>
            <Button
              style={{
                margin: "0 8px",
              }}
              danger
              disabled={!selectedRowKeys.length}
              onClick={() => deleteRecord(selectedRowKeys)}
            >
              删除
            </Button>
          </Col>
          <Col
            span={12}
            style={{
              textAlign: "right",
            }}
          >
            <Button type="primary" onClick={onFinish}>
              查询
            </Button>
            <Button
              style={{
                margin: "0 8px",
              }}
              onClick={() => {
                setPageData(config.PAGEDATA);
                form.resetFields();
              }}
            >
              重置
            </Button>
          </Col>
        </Row>
      </Form>
      <div className={styles.table}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={tableParams.dataList}
          scroll={tableHeight}
          pagination={false}
          rowSelection={rowSelection}
        />
        <Pagination
          className={styles.tablePagination}
          total={tableParams.total}
          pageSize={pageData.rows}
          current={pageData.page}
          showQuickJumper={true}
          showSizeChanger={true}
          onChange={async (page: number, pageSize: number) => {
            setPageData({
              ...pageData,
              page: page,
              rows: pageSize,
            });
          }}
        />
      </div>
      {createModal?.visible ? (
        <Create
          modal={createModal}
          onClose={() => {
            setCreateModal({ ...createModal, visible: false });
          }}
        />
      ) : null}
    </div>
  );
};
