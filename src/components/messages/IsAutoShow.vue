<script setup lang="ts">
import http from "@/router/axios";
import {defineEmits, onMounted, ref, watch} from "vue";
import {ElTable, ElTableColumn} from "element-plus";

interface wxinfo {
  pid: string;
  version: string;
  account: string;
  mobile: string;
  name: string;
  mail: string;
  wxid: string;
  filePath: string;
  key: string;
}

// 进度条
const percentage = ref(0);
const timeout = ref(500);
const colors = [
  {color: '#f56c6c', percentage: 20},
  {color: '#e6a23c', percentage: 40},
  {color: '#5cb87a', percentage: 60},
  {color: '#1989fa', percentage: 80},
  {color: '#6f7ad3', percentage: 100},
]
const last_time = ref(new Date().getTime());
const updateProgress = () => {
  console.log(percentage.value);
  console.log(timeout.value);
  console.log(last_time.value, new Date().getTime() - last_time.value);
  last_time.value = new Date().getTime();

  if (percentage.value >= 99) {
    return;
  }
  if (percentage.value >= 80) {
    timeout.value = timeout.value + 50;
  }
  percentage.value = percentage.value + 1;
  // 调用自身并计算下一个延迟时长
  setTimeout(updateProgress, timeout.value);
};
// END 进度条

const is_init = ref(false);
const wxinfoData = ref<wxinfo[]>([]);
const oneWx = ref("");
const decryping = ref(false);

const isAutoShow = ref("");
const msg_path = ref("");
const micro_path = ref("");
const media_path = ref("");
const wx_path = ref("");
const key = ref("");
const my_wxid = ref("");


const emits = defineEmits(['isAutoShow']);


// 查看有多少个微信正在登录
const get_wxinfo = async () => {
  try {
    wxinfoData.value = await http.post('/api/wxinfo');
    if (wxinfoData.value.length === 1) {
      selectWx(wxinfoData.value[0]);
      oneWx.value = " (检测到只有一个微信，将在5秒后自动选择) ";
      setTimeout(okWx, 5000);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

const selectWx = async (row: wxinfo) => {
  msg_path.value = "";
  micro_path.value = "";
  media_path.value = "";
  wx_path.value = row.filePath;
  key.value = row.key;
  my_wxid.value = row.wxid;
}

const okWx = () => {
  if (wx_path.value === '' && key.value === '' && my_wxid.value === '') {
    return;
  }
  if (decryping.value) {
    return;
  }
  console.log(wx_path.value, key.value, my_wxid.value);
  decryping.value = true;
  init();
  updateProgress();
}

// 初始化，提交数据
const init = async () => {
  try {
    const body_data = await http.post('/api/init', {
      "is_auto_show": isAutoShow.value,
      "msg_path": msg_path.value,
      "micro_path": micro_path.value,
      "media_path": media_path.value,
      "wx_path": wx_path.value,
      "key": key.value,
      "my_wxid": my_wxid.value,
    });
    is_init.value = body_data.is_init;
    if (body_data.is_init) {
      percentage.value = 100; // 进度条 100%
    }
    emits('isAutoShow', body_data.is_init);
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

// 监测isAutoShow是否为aoto，如果是则执行get_wxinfo
watch(isAutoShow, (val) => {
  if (val === 'auto') {
    get_wxinfo();
  } else if (val === 'custom') {
    // init();
  }
})

</script>

<template>
  <div style="background-color: #d2d2fa; height: 100vh; display: flex; justify-content: center; align-items: center;">
    <!-- 自动解密和显示 -->
    <div v-if="isAutoShow==='auto'">

      <el-progress v-if="decryping" show-text="加载中" type="dashboard" :percentage="percentage" :color="colors"/>

      <div v-else
           style="background-color: #fff; width: 90%;min-width: 800px; height: 80%; border-radius: 10px; padding: 20px; overflow: auto;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="font-size: 20px; font-weight: bold;">选择要查看的微信</div>
        </div>
        <div style="margin-top: 20px;">
          <el-table :data="wxinfoData" @current-change="selectWx" highlight-current-row style="width: 100%">
            <el-table-column :min-width="30" prop="pid" label="进程id"></el-table-column>
            <el-table-column :min-width="40" prop="version" label="微信版本"></el-table-column>
            <el-table-column :min-width="40" prop="account" label="账号"></el-table-column>
            <el-table-column :min-width="40" prop="name" label="昵称"></el-table-column>
            <el-table-column :min-width="50" prop="wxid" label="微信原始id"></el-table-column>
          </el-table>
        </div>
        <div style="margin-top: 20px;">
          <el-button style="margin-right: 10px;" @click="okWx">确定{{ oneWx }}</el-button>
        </div>
      </div>
    </div>
    <!-- END -->

    <!-- 用于自定义参数 -->
    <div v-else-if="isAutoShow==='custom'">
      <el-button @click="init">确定2{{ isAutoShow }}</el-button>
    </div>
    <!-- END -->

    <!-- 初始选择界面 -->
    <div v-else-if="isAutoShow === ''">
      <label style="display: flex; flex-direction: column; align-items: center; margin-right: 20px;">
        <input type="radio" v-model="isAutoShow" value="auto"/>
        自动解密并显示当前微信
      </label>
      <label style="display: flex; flex-direction: column; align-items: center;">
        <input type="radio" v-model="isAutoShow" value="custom"/>
        显示自定义文件
      </label>
    </div>
    <!-- END -->
  </div>
</template>

<style scoped>

</style>