import './assets/main.css'

import {createApp} from 'vue'
import App from './App.vue'
import Appexport from "@/Appexport.vue";

import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import Markdown from 'vue3-markdown-it';

// const app = createApp(App)
const app = createApp(Appexport)

app.use(router)
app.use(ElementPlus)
app.use(Markdown)

app.provide('msg_path', '');
app.provide('micro_path', '');
app.provide('media_path', '');
app.provide('filestorage_path', '');
app.provide('user_list', []);

app.mount('#app')
