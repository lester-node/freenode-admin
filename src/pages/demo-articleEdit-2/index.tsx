//用react-markdown去展示，用左边div去编辑
//问题：左边div编辑保存数据格式，右边展示高亮样式

import React, { useState, useRef } from 'react';
import styles from './index.less';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { LeftOutlined } from '@ant-design/icons';
import useRequest from '@ahooksjs/use-request';
import { history } from 'umi';
import { Input, Button, message } from 'antd';
import api from './service';
import { useMount } from 'ahooks';
import Create from './components/create';

export default (props: any) => {
  const divRef = useRef<any>();
  const state = props.location.state;
  const [articleData, setArticleData] = useState<any>({});
  const [createModal, setCreateModal] = useState({
    info: {},
    visible: false,
  });

  const components = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={oneDark}
          language={match[1]}
          PreTag="div"
          children={String(children).replace(/\n$/, '')}
          {...props}
        />
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    h2(props: any) {
      return <h2 style={{ color: 'red' }} {...props} />;
    },
  };

  useMount(() => {
    if (state?.id) {
      articleSelectOneRun({ id: state?.id });
    }
  });

  const { run: articleSelectOneRun } = useRequest(
    (obj) => api.articleSelectOne(obj),
    {
      manual: true,
      onSuccess: (res: any) => {
        if (res.result === 0) {
          setArticleData(res.data);
          divRef.current.innerText = res.data.content;
        } else {
          message.error(res.message || '操作失败');
        }
      },
      onError: (res: any) => {
        message.error(res.message || '操作失败');
      },
    },
  );

  const handleEditorChange = (e: any) => {
    setArticleData({ ...articleData, content: e.target.innerText });
  };

  const changeTitle = (e: any) => {
    setArticleData({ ...articleData, title: e.target.value });
  };

  const goArticleList = () => {
    history.push('/admin/article');
  };

  const goSubmitArticle = () => {
    if (!articleData?.title || !articleData?.content) {
      message.error('标题或内容不能为空');
      return;
    }
    setCreateModal({
      info: {
        id: state?.id,
        ...articleData,
      },
      visible: true,
    });
  };

  const goSubmitDraft = () => {
    if (!articleData?.title || !articleData?.content) {
      message.error('标题或内容不能为空');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Button
          className={styles.topText}
          icon={<LeftOutlined />}
          shape="round"
          onClick={goArticleList}
        >
          文章列表
        </Button>
        <Input
          className={styles.topTitle}
          placeholder="请输入标题"
          value={articleData?.title}
          onChange={changeTitle}
        />
        <Button
          className={styles.topSubmit}
          type="primary"
          onClick={goSubmitArticle}
        >
          发布文章
        </Button>
        <Button className={styles.topSubmit} onClick={goSubmitDraft}>
          保存草稿
        </Button>
      </div>
      <div className={styles.markdownClass}>
        <div
          ref={divRef}
          className={styles.leftClass}
          contentEditable="plaintext-only"
          suppressContentEditableWarning
          onInput={handleEditorChange}
        />
        <ReactMarkdown
          children={articleData?.content}
          remarkPlugins={[gfm]}
          rehypePlugins={[rehypeRaw]}
          components={components}
          className={styles.rightClass}
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
