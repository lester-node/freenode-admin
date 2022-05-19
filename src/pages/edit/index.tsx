import React, { useState } from 'react'
import styles from './index.less'
import MarkdownIt from 'markdown-it'
import Editor, { Plugins } from 'react-markdown-editor-lite'
import 'react-markdown-editor-lite/lib/index.css'
import { LeftOutlined } from '@ant-design/icons'
import { history } from 'umi'
import { Input, Button, message } from 'antd'

const mdParser = new MarkdownIt()
Editor.use(Plugins.TabInsert, {
  tabMapValue: 4
})

export default () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  function handleEditorChange ({ html, text }: any) {
    console.log('handleEditorChange', html, text)
    setContent(text)
  }

  const goArticleList = () => {
    history.push('/admin/article')
  }

  const goSubmitArticle = () => {
    if (!title) {
      message.error('标题不能为空')
    }
  }

  const goSubmitDraft = () => {
    if (!title) {
      message.error('标题不能为空')
    }
  }

  const changeTitle = (e: any) => {
    setTitle(e.target.value)
  }

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
          onChange={changeTitle}
        />
        <Button
          className={styles.topSubmit}
          type="primary"
          onClick={goSubmitArticle}
        >
          保存草稿
        </Button>
        <Button className={styles.topSubmit} onClick={goSubmitDraft}>
          发布文章
        </Button>
      </div>
      <Editor
        value={content}
        style={{ height: 'calc(100% - 42px)' }}
        onImageUpload={(file) => {
          console.log('file', file)
          return new Promise((resolve) => {
            resolve(
              'localhost:3000/upload_5c07cadc18053db7ae008f5508305484.png'
            )
          })
        }}
        renderHTML={(text) => mdParser.render(text)}
        onChange={handleEditorChange}
      />
    </div>
  )
}
