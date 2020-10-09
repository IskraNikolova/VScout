
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
      { path: '/search/:id', component: () => import('pages/NotFound.vue') }
    ]
  },
  {
    path: '/validator',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/validator/:id', component: () => import('pages/Validator.vue') }
    ]
  },
  {
    path: '/address',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/address/:id', component: () => import('pages/PAddress.vue') }
    ]
  },
  {
    path: '/peers',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/peers/:nodeID', component: () => import('pages/Peers.vue') }
    ]
  },
  {
    path: '/tx',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/tx/:txID', component: () => import('pages/Tx.vue') }
    ]
  },
  {
    path: '/subnet',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/subnet/:id', component: () => import('pages/Subnet.vue') }
    ]
  },
  {
    path: '/blockchain',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/blockchain/:id', component: () => import('pages/Blockchain.vue') }
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
