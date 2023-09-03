import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router';

const Main = () => import('@/components/main.vue');
const Login = () => import('@/components/login.vue');
const Register = () => import('@/components/register.vue');

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
        path: '/login',
        name: 'login',
        meta: {
            title: '登录',
        },
        component: Login,
    },
    {
        path: '/register',
        name: 'register',
        meta: {
            title: '注册',
        },
        component: Register,
    },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;