
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') }
    ]
  },
  { path: '/faqs', redirect: '/' },
  {
    path: '/search',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/search/:id', component: () => import('pages/Search.vue') }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
