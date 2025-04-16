<script setup lang="ts">
import {ref} from "vue";
import http from '@/utils/axios.js';
import { ElMessage } from 'element-plus';

const dbPath = ref<string>('');
const outPath = ref<string>('');
const Result = ref<string>('');
const loading = ref<boolean>(false);

const decrypt = async () => {
  try {
    loading.value = true;
    Result.value = await http.post('/api/ls/merge', {
      dbPath: dbPath.value,
      outPath: outPath.value
    });
  } catch (error) {
    Result.value = 'Error fetching data: \n' + error;
    console.error('Error fetching data:', error);
    ElMessage.error('合并失败');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="merge-container">
    <el-card class="merge-card">
      <template #header>
        <div class="card-header">
          <span class="title">微信数据库合并工具</span>
        </div>
      </template>
      
      <el-form label-position="top" class="merge-form">
        <el-form-item label="数据库路径">
          <el-input 
            v-model="dbPath" 
            placeholder="数据库路径（文件夹，并且确保文件夹下的db文件已经解密）"
            clearable
          />
        </el-form-item>
        
        <el-form-item label="输出路径">
          <el-input 
            v-model="outPath" 
            placeholder="输出合并后的数据库路径"
            clearable
          />
        </el-form-item>
        
        <el-form-item>
          <el-button 
            type="primary" 
            @click="decrypt"
            :loading="loading"
            class="submit-btn"
          >
            开始合并
          </el-button>
        </el-form-item>
      </el-form>

      <el-divider content-position="center">合并结果</el-divider>
      
      <el-input
        type="textarea"
        :rows="8"
        v-model="Result"
        readonly
        placeholder="合并结果将在这里显示"
        class="result-textarea"
      />
    </el-card>
  </div>
</template>

<style scoped>
.merge-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: top;
}

.merge-card {
  width: 90%;
  /* max-width: 800px; */
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 20px;
  font-weight: bold;
  color: #303133;
}

.merge-form {
  padding: 20px 0;
}

.submit-btn {
  width: 100%;
  margin-top: 10px;
}

.result-textarea {
  font-family: monospace;
  color: #409EFF;
}

:deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #dcdfe6;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #c0c4cc;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #409EFF;
}
</style>