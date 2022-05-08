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
        title: '文章',
        path: './article',
        component: '@/pages/article',
      },
      {
        title: '分类',
        path: './classify',
        component: '@/pages/classify',
      },
      {
        title: '标签',
        path: './tag',
        component: '@/pages/tag',
      },
      {
        title: '作品',
        path: './works',
        component: '@/pages/works',
      },
      {
        title: '留言',
        path: './information',
        component: '@/pages/information',
      }
    ],
  },
];
