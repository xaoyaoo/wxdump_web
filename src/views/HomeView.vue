<script setup lang="ts">
import http from '@/utils/axios.js';
import {onMounted, ref} from "vue";
import {apiVersion} from "@/api/base";
import { ElMessage } from 'element-plus';

const version = ref(''); // 用于显示返回值

const getVersion = async () => {
  try {
    const data = await apiVersion();
    version.value = data;
  } catch (error) {
    console.error('Error fetching API version:', error);
    ElMessage.error('获取版本信息失败');
  }
}

onMounted(getVersion);
</script>

<template>
  <div class="home-container">
    <el-card class="welcome-card">
      <template #header>
        <div class="card-header">
          <span class="title">欢迎使用 PyWxDump</span>
        </div>
      </template>

      <div class="content">
        <div class="logo">
          <el-icon class="icon"><ChatDotRound /></el-icon>
        </div>
        
        <div class="text-content">
          <h2 class="welcome-text">
            微信聊天记录查看工具
          </h2>
          
          <div class="version-info">
            <el-tag type="info" size="large">
              当前版本：{{ version }}
            </el-tag>
          </div>

          <div class="github-link">
            <el-link 
              type="primary" 
              href="https://github.com/xaoyaoo/PyWxDump.git"
              target="_blank"
            >
              <el-icon><Link /></el-icon>
              访问 GitHub 项目
            </el-link>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.home-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.welcome-card {
  width: 90%;
  max-width: 800px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: center;
  align-items: center;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
}

.logo {
  margin-bottom: 30px;
}

.icon {
  font-size: 64px;
  color: #409EFF;
}

.text-content {
  text-align: center;
}

.welcome-text {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 20px;
}

.version-info {
  margin: 20px 0;
}

.github-link {
  margin-top: 30px;
}

.github-link .el-icon {
  margin-right: 5px;
}

:deep(.el-link) {
  font-size: 16px;
}

:deep(.el-tag) {
  font-size: 16px;
  padding: 8px 16px;
}
</style>