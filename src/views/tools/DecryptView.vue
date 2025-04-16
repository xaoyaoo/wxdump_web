<script setup lang="ts">
import {ref} from "vue";
import http from '@/utils/axios.js';
import { ElMessage } from 'element-plus';

const wxdbPath = ref<string>('');
const key = ref<string>('');
const outPath = ref<string>('');
const decryptResult = ref<string>('');
const loading = ref<boolean>(false);

const decrypt = async () => {
  try {
    loading.value = true;
    decryptResult.value = await http.post('/api/ls/decrypt', {
      wxdbPath: wxdbPath.value,
      key: key.value,
      outPath: outPath.value
    });
  } catch (error) {
    decryptResult.value = 'Error fetching data: \n' + error;
    console.error('Error fetching data:', error);
    ElMessage.error('解密失败');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="decrypt-container">
    <el-card class="decrypt-card">
      <template #header>
        <div class="card-header">
          <span class="title">微信数据库解密工具</span>
        </div>
      </template>
      
      <el-form label-position="top" class="decrypt-form">
        <el-form-item label="密钥（key）">
          <el-input 
            v-model="key" 
            placeholder="请输入密钥（key）"
            clearable
          />
        </el-form-item>
        
        <el-form-item label="微信数据库路径">
          <el-input 
            v-model="wxdbPath" 
            placeholder="请输入微信数据库路径"
            clearable
          />
        </el-form-item>
        
        <el-form-item label="解密后输出文件夹路径">
          <el-input 
            v-model="outPath" 
            placeholder="请输入解密后输出文件夹路径"
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
            开始解密
          </el-button>
        </el-form-item>
      </el-form>

      <el-divider content-position="center">解密结果</el-divider>
      
      <el-input
        type="textarea"
        :rows="8"
        v-model="decryptResult"
        readonly
        placeholder="解密结果将在这里显示"
        class="result-textarea"
      />
    </el-card>
  </div>
</template>

<style scoped>
.decrypt-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: top;
}

.decrypt-card {
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

.decrypt-form {
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