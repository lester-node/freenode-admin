import React, { useState } from 'react';
import styles from './index.less';
import MarkdownIt from 'markdown-it';
import Editor, { Plugins } from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { LeftOutlined } from '@ant-design/icons';
import useRequest from '@ahooksjs/use-request';
import { history } from 'umi';
import { Input, Button, message } from 'antd';
import api from './service';
import { useMount } from 'ahooks';
import Create from './components/create';

const mdParser = new MarkdownIt();
Editor.use(Plugins.TabInsert, {
  tabMapValue: 4,
});

export default (props: any) => {
  const state = props.location.state;
  const [articleData, setArticleData] = useState<any>({});
  const [createModal, setCreateModal] = useState({
    info: {},
    visible: false,
  });

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
        } else {
          message.error(res.message || '操作失败');
        }
      },
      onError: (res: any) => {
        message.error(res.message || '操作失败');
      },
    },
  );

  const handleEditorChange = ({ html, text }: any) => {
    console.log('handleEditorChange', html, text);
    setArticleData({ ...articleData, content: text });
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

  const imgUpload = async (file: any) => {
    let img = '';
    await api
      .upload({
        file,
      })
      .then((res: any) => {
        img = res.data.path;
        // 在这里返回promise为什么不行？
      });
    return new Promise((resolve) => {
      resolve(img);
    });
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
      <Editor
        value={articleData?.content}
        style={{ height: 'calc(100% - 42px)' }}
        onImageUpload={imgUpload}
        renderHTML={(text) => mdParser.render(text)}
        onChange={handleEditorChange}
      />
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
