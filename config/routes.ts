export default [
  {
    title: "登录",
    path: "/",
    component: "@/pages/login",
  },
  {
    title: "后台管理",
    path: "/admin",
    component: "@/pages/layouts",
    routes: [
      {
        title: "教程",
        path: "./course",
        component: "@/pages/course",
      },
      {
        title: "教程文章",
        path: "./courseArticle",
        component: "@/pages/courseArticle",
      },
      {
        title: "文章",
        path: "./article",
        component: "@/pages/article",
      },
      {
        title: "分类",
        path: "./classify",
        component: "@/pages/classify",
      },
      {
        title: "标签",
        path: "./tag",
        component: "@/pages/tag",
      },
    ],
  },
  {
    title: "文章编辑",
    path: "./articleEdit",
    component: "@/pages/articleEdit",
  },
  {
    title: "教程文章编辑",
    path: "./courseArticleEdit",
    component: "@/pages/courseArticleEdit",
  },
];
