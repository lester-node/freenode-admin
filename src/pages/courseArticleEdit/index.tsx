import React, { useState, useRef } from "react";
import styles from "./index.less";
import { LeftOutlined } from "@ant-design/icons";
import useRequest from "@ahooksjs/use-request";
import { history } from "umi";
import { Input, Button, message } from "antd";
import api from "./service";
import { useMount } from "ahooks";
import Create from "./components/create";
import { Editor } from "@toast-ui/react-editor";
import "../../style/toastui-editor.css";
import "@toast-ui/editor/dist/i18n/zh-cn";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.min.css";
import "prismjs/components/prism-clojure.js";
import codeSyntaxHighlight from "@toast-ui/editor-plugin-code-syntax-highlight";

export default (props: any) => {
  const editorRef = useRef<any>();
  const query = props.location.query;
  const [courseArticleData, setCourseArticleData] = useState<any>({});
  const [createModal, setCreateModal] = useState({
    info: {},
    visible: false,
  });

  useMount(() => {
    if (query?.id) {
      courseArticleSelectOneRun({ id: query?.id });
    }
  });

  const { run: courseArticleSelectOneRun } = useRequest(
    (obj) => api.courseArticleSelectOne(obj),
    {
      manual: true,
      onSuccess: (res: { result: number; data: any; message: string }) => {
        if (res.result === 0) {
          setCourseArticleData(res.data);
          editorRef.current.getInstance().setMarkdown(res.data.content);
        } else {
          message.error(res.message || "操作失败");
        }
      },
      onError: (res: { message: string }) => {
        message.error(res.message || "操作失败");
      },
    }
  );

  const handleEditorChange = () => {
    setCourseArticleData({
      ...courseArticleData,
      content: editorRef.current.getInstance().getMarkdown(),
    });
  };

  const changeTitle = (e: any) => {
    setCourseArticleData({ ...courseArticleData, title: e.target.value });
  };

  const goCourseArticleList = () => {
    history.push("/admin/courseArticle");
  };

  const goSubmitCourseArticle = () => {
    if (!courseArticleData?.title || !courseArticleData?.content) {
      message.error("标题或内容不能为空");
      return;
    }
    setCreateModal({
      info: {
        id: query?.id,
        ...courseArticleData,
      },
      visible: true,
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Button
          className={styles.topText}
          icon={<LeftOutlined />}
          shape="round"
          onClick={goCourseArticleList}
        >
          文章列表
        </Button>
        <Input
          className={styles.topTitle}
          placeholder="请输入标题"
          value={courseArticleData?.title}
          onChange={changeTitle}
        />
        <Button
          className={styles.topSubmit}
          type="primary"
          onClick={goSubmitCourseArticle}
        >
          发布文章
        </Button>
      </div>
      <div className={styles.markdownClass}>
        <Editor
          previewStyle="vertical"
          height="calc(100vh - 62px)"
          initialEditType="markdown" // wysiwyg、markdown
          language="zh-CN"
          onChange={handleEditorChange}
          hideModeSwitch={true}
          useCommandShortcut={true} // 是否使用键盘快捷键执行命令
          ref={editorRef}
          plugins={[[codeSyntaxHighlight, { highlighter: Prism }]]}
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
