import React, { useEffect, useRef, useState } from 'react';
import {
  Form,
  Row,
  Col,
  Input,
  Button,
  Select,
  Table,
  message,
  Space,
  Switch,
  Modal,
  Pagination,
  Tag,
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import type { TableRowSelection } from 'antd/lib/table/interface';
import useRequest from '@ahooksjs/use-request';
import styles from './index.less';
import { history } from 'umi';
import api from './service';
import config from './config';
import { useMount, useSize } from 'ahooks';
import moment from 'moment';

export default () => {
  const ref: any = useRef();
  const size: any = useSize(ref);
  let tableHeight = { y: size ? size.height - 240 : window.innerHeight - 310 };

  const [form] = Form.useForm();
  const [classifyEnum, setClassifyEnum] = useState([]);
  const [tagEnum, setTagEnum] = useState([]);
  const [pageData, setPageData] = useState(config.PAGEDATA);
  const [tableParams, setTableParams] = useState(config.TABLEPARAMS);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);

  useEffect(() => {
    articlePageRun(pageData);
  }, [
    pageData.page,
    pageData.rows,
    pageData.title,
    pageData.classifyId,
    pageData.tagId,
  ]);

  useMount(() => {
    classifyEnumRun();
    tagEnumRun();
  });

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

  const { run: articlePageRun } = useRequest((obj) => api.articlePage(obj), {
    manual: true,
    onSuccess: (res: any) => {
      if (res.result === 0) {
        setTableParams({
          dataList: res.data.rows,
          total: res.data.total,
        });
      } else {
        message.error(res.message || '操作失败');
      }
    },
    onError: (res: any) => {
      message.error(res.message || '操作失败');
    },
  });

  const { run: articleDeleteRun } = useRequest(
    (obj) => api.articleDelete(obj),
    {
      manual: true,
      onSuccess: (res: any) => {
        if (res.result === 0) {
          let num = tableParams.total - (pageData.page - 1) * pageData.rows;
          if (pageData.page != 1 && num == 1) {
            setPageData({ ...pageData, page: pageData.page - 1 });
          } else {
            articlePageRun(pageData);
          }
          setSelectedRowKeys([]);
          message.success(res.message || '删除成功');
        } else {
          message.error(res.message || '操作失败');
        }
      },
      onError: (res: any) => {
        message.error(res.message || '操作失败');
      },
    },
  );

  const { run: articleChangeShowRun } = useRequest(
    (obj) => api.articleChangeShow(obj),
    {
      manual: true,
      onSuccess: (res: any) => {
        if (res.result === 0) {
          articlePageRun(pageData);
          message.success(res.message || '修改展示成功');
        } else {
          message.error(res.message || '操作失败');
        }
      },
      onError: (res: any) => {
        message.error(res.message || '操作失败');
      },
    },
  );

  const goEdit = () => {
    history.push('/articleEdit');
  };

  const onFinish = () => {
    let values = form.getFieldsValue(true);
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

  const editRecord = (record: any) => {
    history.push({ pathname: '/articleEdit', state: { id: record.id } });
  };

  const deleteRecord = (ids: any) => {
    Modal.confirm({
      title: '确定删除吗?',
      icon: <ExclamationCircleOutlined />,
      content: '',
      okType: 'danger',
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
      title: '序号',
      dataIndex: 'staffName',
      width: 100,
      render: (value: any, record: any, index: number) => {
        return (pageData.page - 1) * pageData.rows + index + 1;
      },
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 100,
    },
    {
      title: '分类',
      dataIndex: 'classifyName',
      width: 100,
    },
    {
      title: '标签',
      dataIndex: 'tagName',
      width: 100,
      render: (value: string) => {
        return value?.split(',')?.map((item: string, index: number) => {
          return (
            <Tag color={config.COLOR[index]} key={index}>
              {item}
            </Tag>
          );
        });
      },
    },
    {
      title: '是否展示',
      dataIndex: 'show',
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
      title: '最后更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 120,
      render: (value: any) => {
        return moment(value).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 100,
      fixed: 'right',
      render: (value: any, record: any) => {
        return (
          <Space>
            <a onClick={() => editRecord(record)}>编辑</a>
            <a onClick={() => deleteRecord([record.id])}>删除</a>
          </Space>
        );
      },
    },
  ];

  return (
    <div className={styles.content} ref={ref}>
      <Form form={form} name="article_search" className={styles.articleForm}>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item name="title" label="标题">
              <Input placeholder="请输入标题" allowClear={true} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="classifyId" label="分类">
              <Select placeholder="请选择分类" allowClear={true}>
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
          </Col>
          <Col span={8}>
            <Form.Item name="tagId" label="标签">
              <Select placeholder="请选择标签" allowClear={true}>
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
          </Col>
        </Row>
        <Row>
          <Col
            span={12}
            style={{
              textAlign: 'left',
            }}
          >
            <Button type="primary" onClick={goEdit}>
              新增文章
            </Button>
            <Button
              style={{
                margin: '0 8px',
              }}
              danger
              disabled={selectedRowKeys.length ? false : true}
              onClick={() => deleteRecord(selectedRowKeys)}
            >
              删除
            </Button>
          </Col>
          <Col
            span={12}
            style={{
              textAlign: 'right',
            }}
          >
            <Button type="primary" onClick={onFinish}>
              查询
            </Button>
            <Button
              style={{
                margin: '0 8px',
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
      <div className={styles.articleTable}>
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
    </div>
  );
};
