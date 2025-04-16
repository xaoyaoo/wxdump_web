<script setup lang="ts">
import {ref} from "vue";
import HomeView from "@/views/HomeView.vue";
import ContactsList from "@/components/chat/ContactsList.vue";
import ChatExportMain from "@/components/chatBackup/ChatExportMain.vue";
import { ElMessage } from 'element-plus';
</script>

<template>
  <div class="cleanup-container">
    <el-card class="cleanup-card">
      <template #header>
        <div class="card-header">
          <span class="title">微信存储空间清理</span>
        </div>
      </template>

      <div class="content">
        <div class="description">
          <el-alert
            title="功能介绍"
            type="info"
            :closable="false"
            class="alert-box"
          >
            <template #default>
              <p class="description-text">
                通过选择某个人或群，把这群里的聊天记录中涉及的图片、视频、文件、语音等的媒体文件找出来。<br>
                以群对话为单位有选择性的（比如时间段）或按群会话批量从电脑的缓存中清除。
              </p>
            </template>
          </el-alert>

          <el-alert
            title="使用说明"
            type="warning"
            :closable="false"
            class="alert-box"
          >
            <template #default>
              <p class="description-text">
                打开电脑微信，点击左下角的菜单，选择设置->通用设置->存储空间管理->清理空间，即可查看微信占用的空间，点击清理即可清理微信占用的空间。<br>
                如果这些自带功能无法满足需要，请提交issue，我会增加点新的功能。
              </p>
            </template>
          </el-alert>
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

        <div class="support-text">
          <el-tag type="success" effect="light">
            如需提前体验更多功能，请多多支持，多多鼓励！
          </el-tag>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.cleanup-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cleanup-card {
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
  padding: 20px;
}

.description {
  margin-bottom: 30px;
}

.alert-box {
  margin-bottom: 20px;
}

.description-text {
  margin: 10px 0;
  line-height: 1.6;
  color: #606266;
}

.github-link {
  text-align: center;
  margin: 20px 0;
}

.github-link .el-icon {
  margin-right: 5px;
}

.support-text {
  text-align: center;
  margin-top: 20px;
}

:deep(.el-link) {
  font-size: 16px;
}

:deep(.el-tag) {
  font-size: 16px;
  padding: 8px 16px;
}

:deep(.el-alert) {
  margin-bottom: 20px;
}

:deep(.el-alert__title) {
  font-size: 18px;
  font-weight: bold;
}
</style>