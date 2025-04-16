<template>
  <div class="about-container">
    <el-card class="about-card" shadow="hover">
      <template #header>
        <div class="about-header">
          <h1 class="about-title">
            PyWxDump
            <el-button 
              type="primary" 
              link 
              @click="check_update"
              class="update-btn"
            >
              <el-icon><Refresh /></el-icon>
              检查更新
            </el-button>
          </h1>
        </div>
      </template>

      <div class="about-content">
        <el-skeleton :rows="10" animated v-if="loading" />
        <Markdown 
          v-else 
          :source="source" 
          class="markdown-content"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import Markdown from 'vue3-markdown-it';
import http from '@/utils/axios.js';
import { type Action, ElMessage, ElMessageBox } from "element-plus";
import { onMounted, ref } from "vue";
import { Refresh } from '@element-plus/icons-vue'

const loading = ref(true);
const source = ref("# 加载中");

const check_update = async () => {
  try {
    loading.value = true;
    const body_data = await http.post('/api/rs/check_update');
    const latest_version = body_data.latest_version;
    const msg = body_data.msg;
    const url = body_data.latest_url;
    const showtext = `${msg}：${latest_version} \n ${url || ''}`;

    ElMessageBox.alert(showtext, '更新信息', {
      confirmButtonText: '确认',
      callback: (action: Action) => {
        ElMessage({
          type: 'info',
          message: `操作: ${action}`,
        })
      },
    })
  } catch (error) {
    ElMessage.error('检查更新失败');
  } finally {
    loading.value = false;
  }
}

const get_readme_md = async () => {
  try {
    loading.value = true;
    const body_data = await http.post('/api/rs/get_readme');
    source.value = body_data;
  } catch (error) {
    ElMessage.error('获取文档失败');
    source.value = "# 获取文档失败，请稍后重试";
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  get_readme_md();
})
</script>

<style scoped>
.about-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%);
  padding: 20px;
  display: flex;
  justify-content: center;
}

.about-card {
  width: 90%;
  max-width: 1200px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.about-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.about-title {
  font-size: 24px;
  color: #303133;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 16px;
}

.update-btn {
  font-size: 14px;
}

.about-content {
  padding: 20px 0;
}

.markdown-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

:deep(.markdown-content h1) {
  font-size: 24px;
  color: #303133;
  margin-bottom: 20px;
}

:deep(.markdown-content h2) {
  font-size: 20px;
  color: #409EFF;
  margin: 16px 0;
}

:deep(.markdown-content p) {
  line-height: 1.6;
  color: #606266;
  margin-bottom: 16px;
}

:deep(.markdown-content code) {
  background-color: #f5f7fa;
  padding: 2px 6px;
  border-radius: 4px;
  color: #409EFF;
}

:deep(.markdown-content pre) {
  background-color: #f5f7fa;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
}

@media screen and (max-width: 768px) {
  .about-card {
    width: 95%;
  }
  
  .about-title {
    font-size: 20px;
  }
}
</style>