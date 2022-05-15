import React from 'react'
import MarkdownIt from 'markdown-it'
import Editor, { Plugins } from 'react-markdown-editor-lite'
import 'react-markdown-editor-lite/lib/index.css'

const mdParser = new MarkdownIt()
Editor.use(Plugins.TabInsert, {
  /**
   * 用户按下 Tab 键时输入的空格的数目
   * 特别地，1 代表输入一个'\t'，而不是一个空格
   * 默认值是 1
   */
  tabMapValue: 4
})

export default () => {
  function handleEditorChange ({ html, text }) {
    console.log('handleEditorChange', html, text)
  }

  return (
    // <MdEditor
    //   style={{ height: '500px' }}
    //   renderHTML={(text) => mdParser.render(text)}
    //   onChange={handleEditorChange}
    // />
    <Editor
      style={{ height: '500px' }}
      onImageUpload={(file) => {
        console.log('file', file)
        return new Promise((resolve) => {
          resolve('localhost:3000/upload_5c07cadc18053db7ae008f5508305484.png')
        })
      }}
      renderHTML={(text) => mdParser.render(text)}
      onChange={handleEditorChange}
    />
  )
}
