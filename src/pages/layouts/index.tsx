import { Layout, Menu, MenuProps, ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import {
  HeartOutlined,
  DashboardOutlined,
  BugOutlined,
  DesktopOutlined,
  CloudOutlined,
  ScissorOutlined,
  CompassOutlined,
  HighlightOutlined,
  KeyOutlined,
} from '@ant-design/icons';
import styles from './index.less'
import React, { useEffect, useState } from 'react'
import { history } from 'umi'
const { Content, Footer, Sider } = Layout

type MenuItem = Required<MenuProps>['items'][number];

function getItem (
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type
  } as MenuItem
}

export default (props: any) => {
  const [collapsed, setCollapsed] = useState(false)
  const [selectMenu, setSelectMenu] = useState<any>([]);

  useEffect(() => {
    setSelectMenu([window.location.pathname])
  },[window.location.pathname])

  const items: MenuItem[] = [
    getItem('前言', '/admin/preface', <HeartOutlined />),
    getItem('教程', '/admin/course', <HighlightOutlined />),
    getItem('教程文章', '/admin/courseArticle', <KeyOutlined />),
    getItem('文章', '/admin/article', <BugOutlined />),
    getItem('分类', '/admin/classify', <DashboardOutlined />),
    getItem('标签', '/admin/tag', <DesktopOutlined />),
    getItem('作品', '/admin/works', <ScissorOutlined />),
    getItem('留言', '/admin/information', <CompassOutlined />),
  ];

  const menuSelect = (val: any) => {
    history.push(val.key)
  }

  const onCollapse = (collapsed: boolean) => {
    setCollapsed(collapsed)
  }

  return (
    <Layout className={styles.layout}>
      <Sider
        className={styles.sider}
        collapsible
        theme="light"
        collapsed={collapsed}
        onCollapse={onCollapse}
      >
        <div className={styles.logoBig}>
          <CloudOutlined
            className={collapsed ? styles.logoClass : styles.logoActiveClass}
          />
          <div
            className={collapsed ? styles.textClass : styles.textActiveClass}
          >
            高效率开发学习
          </div>
        </div>
        <Menu
          mode="inline"
          theme="light"
          items={items}
          onSelect={menuSelect}
          selectedKeys={selectMenu}
          defaultSelectedKeys={[`${window.location.pathname}`]}
        />
      </Sider>
      <Layout>
        <Content className={styles.content}>
          <ConfigProvider locale={zhCN}>{props.children}</ConfigProvider>
        </Content>
        <Footer className={styles.footer}>
          <a
            target="_blank"
            href="https://beian.miit.gov.cn/#/Integrated/index"
            rel="noreferrer"
          >
            浙ICP备20011916号-1
          </a>
        </Footer>
      </Layout>
    </Layout>
  );
}
