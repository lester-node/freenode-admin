// //用react-markdown去展示，用左边上传按钮上传md文件解析出来给mark-markdown展示
// //问题：左边上传成功后的读取文件？FileReader？后端新建个字段保存上传成功后的url？

// import React, { useState, useRef } from 'react';
// import styles from './index.less';
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import ReactMarkdown from 'react-markdown';
// import gfm from 'remark-gfm';
// import rehypeRaw from 'rehype-raw';
// import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
// import { LeftOutlined, UploadOutlined } from '@ant-design/icons';
// import useRequest from '@ahooksjs/use-request';
// import { history } from 'umi';
// import { Input, Button, message, Upload } from 'antd';
// import api from './service';
// import { useMount } from 'ahooks';
// import Create from './components/create';

// export default (props: any) => {
//   const state = props.location.state;
//   const [articleData, setArticleData] = useState<any>({});
//   const [createModal, setCreateModal] = useState({
//     info: {},
//     visible: false,
//   });

//   const components = {
//     code({ node, inline, className, children, ...props }: any) {
//       const match = /language-(\w+)/.exec(className || '');
//       return !inline && match ? (
//         <SyntaxHighlighter
//           style={dark}
//           language={match[1]}
//           PreTag="div"
//           children={String(children).replace(/\n$/, '')}
//           {...props}
//         />
//       ) : (
//         <code className={className} {...props}>
//           {children}
//         </code>
//       );
//     },
//     h2(props: any) {
//       return <h2 style={{ color: 'red' }} {...props} />;
//     },
//   };

//   useMount(() => {
//     if (state?.id) {
//       articleSelectOneRun({ id: state?.id });
//     }
//   });

//   const { run: articleSelectOneRun } = useRequest(
//     (obj) => api.articleSelectOne(obj),
//     {
//       manual: true,
//       onSuccess: (res: any) => {
//         if (res.result === 0) {
//           setArticleData(res.data);
//         } else {
//           message.error(res.message || '操作失败');
//         }
//       },
//       onError: (res: any) => {
//         message.error(res.message || '操作失败');
//       },
//     },
//   );

//   const changeTitle = (e: any) => {
//     setArticleData({ ...articleData, title: e.target.value });
//   };

//   const goArticleList = () => {
//     history.push('/admin/article');
//   };

//   const goSubmitArticle = () => {
//     if (!articleData?.title || !articleData?.content) {
//       message.error('标题或内容不能为空');
//       return;
//     }
//     setCreateModal({
//       info: {
//         id: state?.id,
//         ...articleData,
//       },
//       visible: true,
//     });
//   };

//   const goSubmitDraft = () => {
//     if (!articleData?.title || !articleData?.content) {
//       message.error('标题或内容不能为空');
//     }
//   };

//   const uploadProps: any = {
//     name: 'file',
//     action: `${window.location.host}/v1/common/upload`,
//     headers: {
//       authorization: localStorage.getItem('token'),
//     },
//     maxCount: 1,
//     accept: '.md',
//     onChange(info) {
//       console.log('info', info);
//       // if (info.file.status !== 'uploading') {
//       //   console.log(info.file, info.fileList);
//       // }
//       // if (info.file.status === 'done') {
//       //   message.success(`${info.file.name} file uploaded successfully`);
//       // } else if (info.file.status === 'error') {
//       //   message.error(`${info.file.name} file upload failed.`);
//       // }
//     },
//   };

//   const download = () => {};

//   // const imgUpload = async (file: any) => {
//   //   let img = '';
//   //   return await api
//   //     .upload({
//   //       file,
//   //     })
//   //     .then((res: any) => {
//   //       img = res.data.path;
//   //       return new Promise((resolve) => {
//   //         resolve(res.data.path);
//   //       });
//   //     });
//   // };

//   return (
//     <div className={styles.container}>
//       <div className={styles.top}>
//         <Button
//           className={styles.topText}
//           icon={<LeftOutlined />}
//           shape="round"
//           onClick={goArticleList}
//         >
//           文章列表
//         </Button>
//         <Input
//           className={styles.topTitle}
//           placeholder="请输入标题"
//           value={articleData?.title}
//           onChange={changeTitle}
//         />
//         <Button
//           className={styles.topSubmit}
//           type="primary"
//           onClick={goSubmitArticle}
//         >
//           发布文章
//         </Button>
//         <Button className={styles.topSubmit} onClick={goSubmitDraft}>
//           保存草稿
//         </Button>
//       </div>
//       <div className={styles.markdownClass}>
//         <div className={styles.leftClass}>
//           <Upload {...uploadProps} className={styles.upload}>
//             <Button icon={<UploadOutlined />}>上传文件</Button>
//           </Upload>
//           <Button className={styles.download} onClick={download}>
//             下载文件
//           </Button>
//         </div>
//         <ReactMarkdown
//           children={articleData?.content}
//           remarkPlugins={[gfm]}
//           rehypePlugins={[rehypeRaw]}
//           components={components}
//           className={styles.rightClass}
//         />
//       </div>
//       {createModal?.visible ? (
//         <Create
//           modal={createModal}
//           onClose={() => {
//             setCreateModal({ ...createModal, visible: false });
//           }}
//         />
//       ) : null}
//     </div>
//   );
// };
