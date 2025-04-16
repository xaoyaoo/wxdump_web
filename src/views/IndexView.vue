<script setup lang="ts">
import http from '@/utils/axios.js';
import {onMounted, ref} from "vue";
import {apiVersion} from "@/api/base";

const version = ref(''); // 用于显示返回值

const getVersion = () => {
  apiVersion().then((data: string) => {
    version.value = data;
  }).catch((error: string) => {
    console.error('Error fetching API version:', error);
  });
}

onMounted(getVersion);

</script>

<template>
  <div class="index-container">
    <el-card class="welcome-card" shadow="hover">
      <div class="welcome-content">
        <h2 class="welcome-title">
          欢迎使用
          <a href="https://github.com/xaoyaoo/PyWxDump.git" class="project-link">
            PyWxDump
          </a>
          聊天记录查看工具
        </h2>
        <div class="version-info">
          <el-tag type="info" effect="plain" size="large">
            当前版本：{{ version }}
          </el-tag>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.index-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%);
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.welcome-card {
  width: 80%;
  max-width: 600px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.welcome-content {
  text-align: center;
  padding: 40px 20px;
}

.welcome-title {
  font-size: 28px;
  color: #303133;
  margin-bottom: 20px;
  line-height: 1.5;
}

.project-link {
  color: #409EFF;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s ease;
}

.project-link:hover {
  color: #66b1ff;
  text-decoration: underline;
}

.version-info {
  margin-top: 20px;
}

:deep(.el-tag) {
  font-size: 16px;
  padding: 8px 16px;
}

@media screen and (max-width: 768px) {
  .welcome-card {
    width: 95%;
  }
  
  .welcome-title {
    font-size: 24px;
  }
}
</style>