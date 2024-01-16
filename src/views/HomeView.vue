<script setup lang="ts">
import http from '@/router/axios.js';
import {onMounted, ref} from "vue";

const version = ref(''); // 用于显示返回值

const getVersion = async () => {
  try {
    const body_data = await http.get('/api/version');
    version.value = body_data;
  } catch (e) {
    version.value = '获取版本失败';
    console.log(e);
  }
}

onMounted(getVersion);

</script>

<template>
  <div style="background-color: #d2d2fa; height: 100vh; display: grid; place-items: center; ">
    <h2 style="text-align: center">欢迎使用<a href="https://github.com/xaoyaoo/PyWxDump.git">PyWxDump</a>聊天记录查看工具!
      <p style="text-align: center">当前版本：{{ version }}</p>
    </h2>
  </div>
</template>

<style scoped>

</style>