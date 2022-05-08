import React from 'react'
import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
import 'react-markdown-editor-lite/lib/index.css'

const mdParser = new MarkdownIt()

export default () => {
  function handleEditorChange ({ html, text }) {
    console.log('handleEditorChange', html, text)
  }

  return (
    <MdEditor
      style={{ height: '500px' }}
      renderHTML={(text) => mdParser.render(text)}
      onChange={handleEditorChange}
    />
  )
}
