import {createRouter, createWebHashHistory} from 'vue-router'

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import((`@/views/HomeView.vue`))
        },
        {
            path: '/chat',
            name: 'chat',
            component: () => import((`@/views/ChatView.vue`))
        },
        {
            path: '/export',
            name: 'export',
            component: () => import((`@/views/ExportView.vue`))
        },
        {
            path: '/statistics',
            name: 'statistics',
            component: () => import((`@/views/StatisticsView.vue`))
        },

        // 专业工具
        {
            path: '/wxinfo',
            name: 'wxinfo',
            component: () => import((`@/views/tools/WxinfoView.vue`))
        },
        {
            path: '/bias',
            name: 'bias',
            component: () => import((`@/views/tools/BiasView.vue`))
        },
        {
            path: '/merge',
            name: 'merge',
            component: () => import((`@/views/tools/MergeView.vue`))
        },
        {
            path: '/decrypt',
            name: 'decrypt',
            component: () => import((`@/views/tools/DecryptView.vue`))
        },

        // 其他 关于、帮助、设置
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import((`@/views/other/AboutView.vue`))
        },
        {
            path: '/help',
            name: 'help',
            component: () => import((`@/views/other/HelpView.vue`))
        },
        {
            path: '/setting',
            name: 'setting',
            component: () => import((`@/views/other/SettingView.vue`))
        },
    ]
})


export default router
