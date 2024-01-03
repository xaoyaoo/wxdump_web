// 创建一个 axios 实例
import axios from 'axios';
// import {inject, onMounted} from 'vue';

const http = axios.create({
    baseURL: 'http://localhost:5000', // 根据你的实际情况设置基础URL
    // 表示跨域请求时是否需要使用凭证，开启后，后端服务器要设置允许开启
    withCredentials: true,
});

// 请求拦截器
http.interceptors.request.use(
    (config) => {
        // 在发送请求之前做些什么，比如添加请求头
        config.headers['Content-Type'] = 'application/json';  // 根据您的需求设置其他请求头
        // config.headers['msg_path'] = inject("msg_path");
        // config.headers['micro_path'] = inject("micro_path");
        // config.headers['media_path'] = inject("media_path");
        // config.headers['filestorage_path'] = inject("filestorage_path");
        // 补全路径
        // console.log('config.url', config.url);
        return config;
    },
    (error) => {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);

// 响应拦截器
http.interceptors.response.use(
    (response) => {
        // 对响应数据做点什么
        if (response.data.code === 0) {
            // 如果后端返回的状态码是 200，说明接口请求成功
            // 这里直接返回后端返回的数据
            return response.data.body;
        } else {
            // 如果不是 200，说明接口请求失败，弹出后端给的错误提示
            console.error('Error Message:', response.data.msg);
            return Promise.reject(response.data.msg);
        }
    },
    (error) => {
        // 对响应错误做点什么
        if (error.response) {
            // 请求已发出，但服务器响应的状态码不在 2xx 范围内
            console.error('HTTP Error Response:', error.response.status);
        } else if (error.request) {
            // 请求已发出，但没有收到响应
            console.error('No response received:', error.request);
        } else {
            // 发送请求时发生了一些事情，触发了错误
            console.error('Error sending request:', error.message);
        }

        // 把错误传递给调用者
        return Promise.reject(error);
    }
);
export default http;
