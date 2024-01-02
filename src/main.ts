import './assets/main.css'

import {createApp} from 'vue'
import App from './App.vue'
import router from './router'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)

app.use(router)
app.use(ElementPlus)


app.config.globalProperties.$msg_path = ''
app.config.globalProperties.$micro_path = ''
app.config.globalProperties.$media_path = ''
app.config.globalProperties.$filestorage_path = ''
app.config.globalProperties.$user_list = []

app.mount('#app')
