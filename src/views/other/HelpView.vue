<template>
  <div class="help-container">
    <el-card class="help-card" shadow="hover">
      <div class="help-content">
        <h1 class="help-title">
          PyWxDump 使用指南 & 常见问题
        </h1>
        
        <div class="doc-links">
          <el-card 
            v-for="(link, index) in docLinks" 
            :key="index"
            class="doc-card"
            shadow="hover"
            @click="openLink(link.url)"
          >
            <div class="doc-item">
              <el-icon class="doc-icon"><Document /></el-icon>
              <span class="doc-text">{{ link.text }}</span>
            </div>
          </el-card>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { Document } from '@element-plus/icons-vue'

const docLinks = [
  {
    text: '使用教程',
    url: 'https://github.com/xaoyaoo/PyWxDump/blob/master/doc/UserGuide.md'
  },
  {
    text: '常见问题',
    url: 'https://github.com/xaoyaoo/PyWxDump/blob/master/doc/FAQ.md'
  },
  {
    text: 'CE获取基址',
    url: 'https://github.com/xaoyaoo/PyWxDump/blob/master/doc/CE%E8%8E%B7%E5%8F%96%E5%9F%BA%E5%9D%80.md'
  },
  {
    text: 'wx数据库简述',
    url: 'https://github.com/xaoyaoo/PyWxDump/blob/master/doc/wx%E6%95%B0%E6%8D%AE%E5%BA%93%E7%AE%80%E8%BF%B0.md'
  },
  {
    text: 'MAC数据库解密',
    url: 'https://github.com/xaoyaoo/PyWxDump/blob/master/doc/MAC%E6%95%B0%E6%8D%AE%E5%BA%93%E8%A7%A3%E5%AF%86.md'
  }
]

const openLink = (url: string) => {
  window.open(url, '_blank')
}
</script>

<style scoped>
.help-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%);
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.help-card {
  width: 80%;
  max-width: 800px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.help-content {
  padding: 40px 20px;
}

.help-title {
  text-align: center;
  color: #303133;
  font-size: 28px;
  margin-bottom: 40px;
}

.doc-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.doc-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
}

.doc-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.doc-item {
  display: flex;
  align-items: center;
  padding: 15px;
}

.doc-icon {
  font-size: 24px;
  color: #409EFF;
  margin-right: 12px;
}

.doc-text {
  font-size: 16px;
  color: #303133;
}

@media screen and (max-width: 768px) {
  .help-card {
    width: 95%;
  }
  
  .help-title {
    font-size: 24px;
  }
  
  .doc-links {
    grid-template-columns: 1fr;
  }
}
</style>