import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vueJsx(),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    base: './',
    server: {
        // 访问项目的IP地址，可以设置为“0.0.0.0”来使项目外部可访问
        host: "0.0.0.0",
        // 访问项目的端口号
        port: 8080,
        // 自动启动浏览器
        open: true,
        // 配置反向代理处理跨域请求
        proxy: {
            "/api": {
                target: "http://127.0.0.1:5000",
                changeOrigin: true, //是否跨域
                // rewrite: (path) => path.replace(/^\/mis/, ""), //因为后端接口有mis前缀，所以不需要替换
                // ws: true,                       //是否代理 websockets
                // secure: true, //是否https接口
            },
        },
    },
})
