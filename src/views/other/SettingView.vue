<script setup lang="ts">
import { Setting, DataLine, Timer } from '@element-plus/icons-vue'
import DbInitComponent from "@/components/utils/DbInitComponent.vue";
import { ref } from "vue";

const setting_selected = ref("db_init")

const MeneSelect = (val: string) => {
  setting_selected.value = val
}
</script>

<template>
  <div class="setting-container">
    <el-container class="setting-layout">
      <el-aside width="240px" class="setting-aside">
        <el-menu :default-active="setting_selected" class="setting-menu" @select="MeneSelect">

          <el-menu-item index="db_init">
            <el-icon>
              <DataLine />
            </el-icon>
            <span>初始化设置</span>
          </el-menu-item>

          <el-menu-item index="title">
            <el-icon>
              <Setting />
            </el-icon>
            <span>设置中心</span>
          </el-menu-item>

          <!-- <el-menu-item index="coming_soon" disabled>
            <el-icon>
              <Timer />
            </el-icon>
            <span>更多功能即将上线</span>
          </el-menu-item> -->
        </el-menu>
      </el-aside>

      <el-main class="setting-main">
        <el-card class="setting-card" shadow="hover">
          <template #header>
            <div class="setting-header">
              <h2 class="setting-title">
                欢迎使用
                <a href="https://github.com/xaoyaoo/PyWxDump.git" class="project-link">
                  PyWxDump
                </a>
                聊天记录查看工具
              </h2>
              <div class="setting-subtitle">
                <el-tag type="info" effect="plain" size="small">
                  如需提前体验更多功能请开通超级vip
                </el-tag>
              </div>
            </div>
          </template>

          <transition name="fade" mode="out-in">
            <db-init-component v-if="setting_selected === 'db_init'" />
            <div v-else class="coming-soon">
              <el-card class="coming-soon-card" shadow="hover">
                <div class="coming-soon-content">
                  <el-icon class="coming-soon-icon">
                    <Timer />
                  </el-icon>
                  <h1 class="coming-soon-title">更多功能即将上线</h1>
                  <p class="coming-soon-text">我们正在努力开发更多精彩功能，敬请期待！</p>
                  <!-- <div class="coming-soon-features">
                    <el-tag type="info" effect="plain" class="feature-tag">新功能 1</el-tag>
                    <el-tag type="info" effect="plain" class="feature-tag">新功能 2</el-tag>
                    <el-tag type="info" effect="plain" class="feature-tag">新功能 3</el-tag>
                  </div> -->
                </div>
              </el-card>
            </div>
          </transition>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
.setting-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%);
}

.setting-layout {
  height: 100vh;
}

.setting-aside {
  background-color: #fff;
  border-right: 1px solid #ebeef5;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.setting-menu {
  height: 100%;
  border-right: none;
}

.setting-main {
  padding: 20px;
  overflow-y: auto;
}

.setting-card {
  border-radius: 12px;
  /* min-height: calc(100vh - 40px); */
}

.setting-header {
  text-align: center;
  padding: 20px 0;
}

.setting-title {
  font-size: 24px;
  color: #303133;
  margin-bottom: 16px;
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

.setting-subtitle {
  margin-top: 12px;
}

:deep(.el-menu-item.is-disabled) {
  opacity: 1;
  cursor: default;
}

:deep(.el-menu-item [class^="el-icon-"]) {
  margin-right: 8px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.coming-soon {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.coming-soon-card {
  width: 100%;
  max-width: 600px;
  border-radius: 16px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%);
  border: none;
}

.coming-soon-content {
  padding: 40px;
  text-align: center;
}

.coming-soon-icon {
  font-size: 64px;
  color: #409EFF;
  margin-bottom: 24px;
  animation: pulse 2s infinite;
}

.coming-soon-title {
  font-size: 28px;
  color: #303133;
  margin-bottom: 16px;
  font-weight: bold;
}

.coming-soon-text {
  font-size: 16px;
  color: #606266;
  margin-bottom: 32px;
  line-height: 1.6;
}

.coming-soon-features {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.feature-tag {
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.feature-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@media screen and (max-width: 768px) {
  .setting-aside {
    width: 100% !important;
    height: auto !important;
  }

  .setting-layout {
    flex-direction: column;
  }

  .setting-main {
    padding: 10px;
  }

  .coming-soon-content {
    padding: 24px;
  }
  
  .coming-soon-title {
    font-size: 24px;
  }
  
  .coming-soon-icon {
    font-size: 48px;
  }
}
</style>