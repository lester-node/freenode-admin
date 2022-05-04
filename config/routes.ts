export default [
  {
    title: '登录',
    path: '/',
    component: '@/pages/login',
  },
  {
    path: '/admin',
    component: '@/pages/layouts',
    routes: [
      {
        title: '前言',
        path: './preface',
        component: '@/pages/preface',
      },
      {
        title: '文章-HTML',
        path: './articleHtml',
        component: '@/pages/articleHtml',
      },
      {
        title: '文章-CSS',
        path: './articleCss',
        component: '@/pages/articleCss',
      },
    ],
  },
];
