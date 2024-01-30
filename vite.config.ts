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
        open: false,
        port: 5171,
        https: undefined,
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
