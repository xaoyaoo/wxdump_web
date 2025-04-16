<script setup lang="ts">
import http from "@/utils/axios.js";
import ProgressBar from "@/components/utils/ProgressBar.vue";
import {defineEmits, onMounted, ref, watch} from "vue";
import {ElTable, ElTableColumn, ElMessage, ElMessageBox} from "element-plus";
import type {Action} from 'element-plus'
import router from "@/router";
import { Clock, MagicStick, Setting } from '@element-plus/icons-vue'

interface wxinfo {
  pid: string;
  version: string;
  account: string;
  mobile: string;
  nickname: string;
  mail: string;
  wxid: string;
  wx_dir: string;
  key: string;
}

interface LocalWxid {
  wxid: string;
}

const percentage = ref(0);
const startORstop = ref(-1);  // 用于进度条的开始和停止 0表示0% 1表示100%

type InitType = 'last' | 'auto' | 'custom'| '';
const init_type = ref<InitType>('');

const is_init = ref(false);
const wxinfoData = ref<wxinfo[]>([]);

const oneWx = ref("");
const decryping = ref(false);
const isErrorShow = ref(false);
const isUseKey = ref("false");

const merge_path = ref("");
const wx_path = ref("");
const key = ref("");
const my_wxid = ref("");

const local_wxids = ref<LocalWxid[]>([]);

const db_init = (init: boolean) => {
  if (init) {
    localStorage.setItem('isDbInit', "t");
    // router.push('/');
    ElMessage({
      type: 'success',
      message: '初始化成功！',
      duration: 3000,
    })
    init_type.value = '';
  }
}

const showError = (error: unknown) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  ElMessageBox.alert(errorMessage, '错误', {
    confirmButtonText: '确认',
    callback: (action: Action) => {
      ElMessage({
        type: 'error',
        message: `操作: ${action}`,
      })
    },
  });
}

// ** 是否使用key的初始化** START
const init_key = async () => {
  if (decryping.value) {
    console.log("正在解密中，请稍后再试！")
    return;
  }
  decryping.value = true;
  try {
    decryping.value = true;
    startORstop.value = 0; // 进度条开始
    let reqdata = {
      "wx_path": wx_path.value,
      "key": key.value,
      "my_wxid": my_wxid.value
    }
    const body_data = await http.post('/api/ls/init_key', reqdata);
    is_init.value = body_data.is_init;
    if (body_data.is_init) {
      percentage.value = 100; // 进度条 100%
    }
    decryping.value = false;
    db_init(body_data.is_init);
  } catch (error) {
    percentage.value = 0; // 进度条 0%
    isErrorShow.value = true;
    decryping.value = false;
    showError(error);
    return [];
  }
  decryping.value = false;
}

const init_nokey = async () => {
  try {
    let reqdata = {
      "wx_path": wx_path.value,
      "merge_path": merge_path.value,
      "my_wxid": my_wxid.value
    }
    const body_data = await http.post('/api/ls/init_nokey', reqdata);
    is_init.value = body_data.is_init;
    if (body_data.is_init) {
      percentage.value = 100; // 进度条 100%
    }
    decryping.value = false;
    db_init(body_data.is_init);
  } catch (error) {
    percentage.value = 0; // 进度条 0%
    isErrorShow.value = true;
    decryping.value = false;
    showError(error);
    return [];
  }
  decryping.value = false;
}
// ** 是否使用key的初始化** END

// ** 使用上次数据部分** START
const selectLastWx = async (row: wxinfo) => {
  my_wxid.value = row.wxid;
}

const get_init_last_local_wxid = async () => {
  try {
    const body_data = await http.post('/api/ls/init_last_local_wxid');
    local_wxids.value = body_data.local_wxids.map((item: string) => {
      return {wxid: item}
    });
    if (local_wxids.value.length === 1) {
      my_wxid.value = local_wxids.value[0].wxid;
      await init_last();
    }
  } catch (error) {
    showError(error);
    return [];
  }
}

const init_last = async () => {
  try {
    let reqdata = {
      "wx_path": wx_path.value,
      "merge_path": merge_path.value,
      "my_wxid": my_wxid.value
    }
    const body_data = await http.post('/api/ls/init_last', reqdata);
    is_init.value = body_data.is_init;
    if (body_data.is_init) {
      percentage.value = 100; // 进度条 100%
      decryping.value = false;
      db_init(body_data.is_init);
    } else {
      isErrorShow.value = true;
      decryping.value = false;
      ElMessageBox.alert("未发现上次的设置数据！", '错误', {
        confirmButtonText: '确认',
        callback: (action: Action) => {
          init_type.value = "";// 刷新
        },
      })
    }
    decryping.value = false;
  } catch (error) {
    isErrorShow.value = true;
    decryping.value = false;
    showError(error);
    return [];
  }
  decryping.value = false;
}

// ** 使用上次数据部分** END

// **自动解密微信部分** START 查看有多少个微信正在登录 ， 并调用init_key解密初始化
const get_wxinfo = async () => {
  try {
    wxinfoData.value = await http.post('/api/ls/wxinfo');
    if (wxinfoData.value.length === 1) {
      selectWx(wxinfoData.value[0]);
      oneWx.value = " (检测到只有一个微信，将在5秒后自动选择) ";
      setTimeout(okWx, 5000);
    }
  } catch (error) {
    showError(error);
    return [];
  }
}

const selectWx = async (row: wxinfo) => {
  merge_path.value = "";
  wx_path.value = row.wx_dir;
  key.value = row.key;
  my_wxid.value = row.wxid;
}

const okWx = () => {
  if (wx_path.value === '' && key.value === '' && my_wxid.value === '') {
    console.log("请填写完整信息! ")
    return;
  }
  if (decryping.value) {
    console.log("正在解密...，请稍后再试！")
    return;
  }
  init_key();
}

// **自动解密微信部分**  END 查看有多少个微信正在登录 ， 并调用init_key解密初始化

// 监测isAutoShow是否为aoto，如果是则执行get_wxinfo
watch(init_type, (val) => {
  if (val === 'auto') {
    get_wxinfo();
  } else if (val === 'custom') {
    // init();
  } else if (val === 'last') {
    get_init_last_local_wxid();
  }
})

</script>

<template>
  <div class="db-init-container">
    <!-- 初始选择界面 -->
    <div v-if="!init_type" class="init-options">
      <el-card 
        class="option-card" 
        @click="init_type = 'last'"
        shadow="hover"
      >
        <div class="option-content">
          <el-icon class="option-icon"><Clock /></el-icon>
          <div class="option-title">使用历史数据</div>
          <div class="option-desc">使用上次的配置信息进行初始化</div>
        </div>
      </el-card>

      <el-card 
        class="option-card" 
        @click="init_type = 'auto'"
        shadow="hover"
      >
        <div class="option-content">
          <el-icon class="option-icon"><MagicStick /></el-icon>
          <div class="option-title">自动解密已登录微信</div>
          <div class="option-desc">自动检测并解密当前登录的微信</div>
        </div>
      </el-card>

      <el-card 
        class="option-card" 
        @click="init_type = 'custom'"
        shadow="hover"
      >
        <div class="option-content">
          <el-icon class="option-icon"><Setting /></el-icon>
          <div class="option-title">自定义配置</div>
          <div class="option-desc">手动配置微信路径和密钥</div>
        </div>
      </el-card>
    </div>

    <!-- 历史数据初始化 -->
    <div v-if="init_type === 'last'" class="init-form">
      <el-card class="form-card" shadow="hover">
        <template #header>
          <div class="form-header">
            <span>使用历史数据初始化</span>
            <el-button type="primary" link @click="init_type = ''">返回</el-button>
          </div>
        </template>
        <el-table :data="local_wxids" @row-click="selectLastWx" highlight-current-row>
          <el-table-column prop="wxid" label="微信ID" />
        </el-table>
        <div class="form-footer">
          <el-button type="primary" @click="init_last" :loading="decryping">开始初始化</el-button>
        </div>
      </el-card>
    </div>

    <!-- 自动解密初始化 -->
    <div v-if="init_type === 'auto'" class="init-form">
      <el-card class="form-card" shadow="hover">
        <template #header>
          <div class="form-header">
            <span>自动解密已登录微信</span>
            <el-button type="primary" link @click="init_type = ''">返回</el-button>
          </div>
        </template>
        <el-table :data="wxinfoData" @row-click="selectWx" highlight-current-row>
          <el-table-column prop="account" label="账号" />
          <el-table-column prop="nickname" label="昵称" />
          <el-table-column prop="wxid" label="微信ID" />
        </el-table>
        <div class="form-footer">
          <el-button type="primary" @click="okWx" :loading="decryping">开始初始化</el-button>
        </div>
      </el-card>
    </div>

    <!-- 自定义配置初始化 -->
    <div v-if="init_type === 'custom'" class="init-form">
      <el-card class="form-card" shadow="hover">
        <template #header>
          <div class="form-header">
            <span>自定义配置初始化</span>
            <el-button type="primary" link @click="init_type = ''">返回</el-button>
          </div>
        </template>
        <el-form label-position="top">
          <el-form-item label="微信路径">
            <el-input v-model="wx_path" placeholder="请输入微信路径" />
          </el-form-item>
          <el-form-item label="合并路径">
            <el-input v-model="merge_path" placeholder="请输入合并路径" />
          </el-form-item>
          <el-form-item label="微信ID">
            <el-input v-model="my_wxid" placeholder="请输入微信ID" />
          </el-form-item>
          <el-form-item>
            <el-radio-group v-model="isUseKey">
              <el-radio label="true">使用密钥</el-radio>
              <el-radio label="false">不使用密钥</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="isUseKey === 'true'" label="密钥">
            <el-input v-model="key" placeholder="请输入密钥" />
          </el-form-item>
        </el-form>
        <div class="form-footer">
          <el-button type="primary" @click="isUseKey === 'true' ? init_key() : init_nokey()" :loading="decryping">
            开始初始化
          </el-button>
        </div>
      </el-card>
    </div>

    <!-- 进度条 -->
    <ProgressBar v-if="decryping" :percentage="percentage" :startORstop="startORstop" />
  </div>
</template>

<style scoped>
.db-init-container {
  height: 100%;
  /* background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%); */
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.init-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 1200px;
  margin-bottom: 20px;
}

.option-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
}

.option-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.option-card.selected {
  border: 2px solid #409EFF;
}

.option-content {
  padding: 20px;
  text-align: center;
}

.option-icon {
  font-size: 32px;
  color: #409EFF;
  margin-bottom: 16px;
}

.option-title {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 8px;
}

.option-desc {
  font-size: 14px;
  color: #606266;
}

.init-form {
  width: 100%;
  max-width: 800px;
}

.form-card {
  border-radius: 12px;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
}

.form-footer {
  margin-top: 20px;
  text-align: center;
}

:deep(.el-table) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.el-table__row) {
  cursor: pointer;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

@media screen and (max-width: 768px) {
  .init-options {
    grid-template-columns: 1fr;
  }
  
  .init-form {
    width: 95%;
  }
}
</style>