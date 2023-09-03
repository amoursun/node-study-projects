import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const Upload = () => import('@/components/upload.vue');
const Main = () => import('@/components/main.vue');

const routes: Array<RouteRecordRaw> = [
  {
        path: '/',
        name: 'index',
        meta: {
            title: '首页',
        },
        component: Main,
  },
  {
        path: '/upload',
        name: 'upload',
        meta: {
            title: '上传',
        },
        component: Upload,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;