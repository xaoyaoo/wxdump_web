// 创建一个 axios 实例
import axios from 'axios';

const http = axios.create({
    baseURL: 'http://localhost:5000', // 根据你的实际情况设置基础URL
    // 表示跨域请求时是否需要使用凭证，开启后，后端服务器要设置允许开启
    withCredentials: true,
    headers: {
        'token': localStorage.getItem('token') || '',
        'msg_path': app.config.globalProperties.$msg_path,
        'micro_path': app.config.globalProperties.$micro_path,
        'media_path': app.config.globalProperties.$media_path,
        'filestorage_path': app.config.globalProperties.$filestorage_path,

    },
});

// 请求拦截器
http.interceptors.request.use(
    (config) => {
        // 在发送请求之前做些什么，比如添加请求头

        // 补全路径
        config.url = config.baseURL + config.url;
        console.log('config.url', config.url);
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
        return response.data;
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
