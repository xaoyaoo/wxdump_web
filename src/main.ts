import './assets/main.css'

import {createApp} from 'vue'
import App from './App.vue'
import router from './router'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'


const app = createApp(App)

app.use(router)
app.use(ElementPlus)

app.provide('msg_path', '');
app.provide('micro_path', '');
app.provide('media_path', '');
app.provide('filestorage_path', '');
app.provide('user_list', []);

app.mount('#app')
