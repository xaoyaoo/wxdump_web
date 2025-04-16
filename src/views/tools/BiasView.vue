<script setup lang="ts">
import {ref} from "vue";
import http from '@/utils/axios.js';
import { ElMessage } from 'element-plus';

const mobile = ref<string>('');
const name = ref<string>('');
const account = ref<string>('');
const key = ref<string>('');
const wxdbPath = ref<string>('');
const result = ref<string>('');
const loading = ref<boolean>(false);

const decrypt = async () => {
  try {
    if (key.value === '' && wxdbPath.value === '') {
      ElMessage.warning('key与wxdbPath必须填写一个');
      return;
    }
    
    loading.value = true;
    result.value = await http.post('/api/ls/biasaddr', {
      mobile: mobile.value,
      name: name.value,
      account: account.value,
      key: key.value,
      wxdbPath: wxdbPath.value
    });
    result.value = "{版本号:昵称,账号,手机号,邮箱,KEY}\n"+result.value;
  } catch (error) {
    result.value = 'Error fetching data: \n' + error;
    console.error('Error fetching data:', error);
    ElMessage.error('获取数据失败');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="bias-container">
    <el-card class="bias-card">
      <template #header>
        <div class="card-header">
          <span class="title">基址偏移工具</span>
        </div>
      </template>
      
      <el-form label-position="top" class="bias-form">
        <el-form-item label="手机号">
          <el-input 
            v-model="mobile" 
            placeholder="请输入手机号"
            clearable
          />
        </el-form-item>
        
        <el-form-item label="昵称">
          <el-input 
            v-model="name" 
            placeholder="请输入昵称"
            clearable
          />
        </el-form-item>
        
        <el-form-item label="微信账号">
          <el-input 
            v-model="account" 
            placeholder="请输入微信号"
            clearable
          />
        </el-form-item>
        
        <el-form-item label="密钥（key）">
          <el-input 
            v-model="key" 
            placeholder="请输入密钥（key）（可选）"
            clearable
          />
        </el-form-item>
        
        <el-form-item label="微信数据库路径">
          <el-input 
            v-model="wxdbPath" 
            placeholder="请输入微信数据库路径（可选）"
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
            开始偏移
          </el-button>
        </el-form-item>
      </el-form>

      <el-divider content-position="center">结果展示</el-divider>
      
      <el-input
        type="textarea"
        :rows="8"
        v-model="result"
        readonly
        placeholder="偏移结果将在这里显示"
        class="result-textarea"
      />
    </el-card>
  </div>
</template>

<style scoped>
.bias-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: top;
}

.bias-card {
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

.bias-form {
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