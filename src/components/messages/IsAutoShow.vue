<script setup lang="ts">
import http from "@/router/axios";
import {defineEmits, onMounted, ref, watch} from "vue";
import {ElTable, ElTableColumn, ElMessage, ElMessageBox} from "element-plus";
import type {Action} from 'element-plus'

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
  if (isErrorShow.value) {
    return;
  }
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
const isErrorShow = ref(false);
const isUseKey = ref("false");

const msg_path = ref("");
const micro_path = ref("");
const media_path = ref("");
const wx_path = ref("");
const key = ref("");
const my_wxid = ref("");
const init_type = ref("");


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
    let reqdata = {
      "msg_path": msg_path.value,
      "micro_path": micro_path.value,
      "media_path": media_path.value,
      "wx_path": wx_path.value,
      "key": key.value,
      "my_wxid": my_wxid.value,
      "init_type": init_type.value,
    }
    const body_data = await http.post('/api/init', reqdata);
    is_init.value = body_data.is_init;
    if (body_data.is_init) {
      percentage.value = 100; // 进度条 100%
    }
    emits('isAutoShow', body_data.is_init);
  } catch (error) {
    percentage.value = 0; // 进度条 0%
    isErrorShow.value = true;
    ElMessageBox.alert(error, 'error', {
      confirmButtonText: '确认',
      callback: (action: Action) => {
        ElMessage({
          type: 'error',
          message: `action: ${action}`,
        })
      },
    })
    // console.error('Error fetching data:', error);
    return [];
  }
}

// 监测isAutoShow是否为aoto，如果是则执行get_wxinfo
watch(init_type, (val) => {
  if (val === 'auto') {
    get_wxinfo();
  } else if (val === 'custom') {
    // init();
  } else if (val === 'last') {
    init();
  }
})

</script>

<template>
  <div style="background-color: #d2d2fa; height: 100vh; display: flex; justify-content: center; align-items: center;">
    <!-- 自动解密和显示 -->
    <div v-if="init_type==='auto'">

      <el-progress v-if="decryping && !isErrorShow" type="dashboard" :percentage="percentage" :color="colors"/>

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
          <el-button style="margin-right: 10px;margin-top: 10px;width: 100%;" type="success" @click="okWx">确定{{
              oneWx
            }}
          </el-button>
        </div>
      </div>
    </div>
    <!-- END -->

    <!-- 用于自定义参数 -->
    <div v-else-if="init_type==='custom'">
      <div
          style="background-color: #fff; width: 80%;min-width: 800px; height: 70%; border-radius: 10px; padding: 20px; overflow: auto;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="font-size: 20px; font-weight: bold;">自定义-文件位置</div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <!--          <el-button style="margin-right: 10px;" @click="exportData">导出</el-button>-->
          </div>
        </div>
        <div style="margin-top: 20px;">
          <!--    单选按钮      -->
          <input type="radio" v-model="isUseKey" value="true"> 使用 KEY [自动根据key解密微信文件夹下的数据库] &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <input type="radio" v-model="isUseKey" value="false"> 不使用 [表示数据库已解密]

          <el-divider></el-divider>  <!-- 分割线-->
          <div v-if="isUseKey=='false'">
            <label>MicroMsg.db 路径: </label>
            <el-input placeholder="MicroMsg.db" v-model="micro_path" style="width: 80%;"></el-input>
            <br>
          </div>
          <div v-if="isUseKey=='false'">
            <label>MSG.db 路径: </label>
            <el-input placeholder="MSG.db" v-model="msg_path" style="width: 80%;"></el-input>
            <br>
          </div>
          <div v-if="isUseKey=='false'">
            <label>MediaMSG.db 路径: </label>
            <el-input placeholder="MediaMSG.db" v-model="media_path" style="width: 80%;"></el-input>
            <br>
          </div>
          <label>微信文件夹路径: </label>
          <el-input placeholder="C:\***\WeChat Files\wxid_*******" v-model="wx_path" style="width: 80%;"></el-input>
          <br>
          <label>微信原始id: </label>
          <el-input placeholder="wxid_*******" v-model="my_wxid" style="width: 80%;"></el-input>
          <br>
          <div v-if="isUseKey=='true'">
            <label>密钥key(可空): </label>
            <el-input placeholder="密钥key (64位)" v-model="key" style="width: 80%;"></el-input>
            <br>
          </div>

          <el-button style="margin-top: 10px;width: 100%;" type="success" @click="init">确定</el-button>
        </div>
      </div>
    </div>
    <!-- END -->

    <!-- 上次数据 -->
    <div v-else-if="init_type==='last'"></div>
    <!-- END -->

    <!-- 初始选择界面 -->
    <div v-else-if="init_type === ''" style="display: flex; justify-content: space-between;">
      <label
          style="width: 200px; height: 150px; background-color: #fff; display: flex; flex-direction: column; align-items: center; border-radius: 10px; margin-right: 20px;">
        <input type="radio" v-model="init_type" value="last"/>
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%;">
          <div>使用上次数据</div>
        </div>
      </label>
      <label
          style="width: 200px; height: 150px; background-color: #fff; display: flex; flex-direction: column; align-items: center; border-radius: 10px; margin-right: 20px;">
        <input type="radio" v-model="init_type" value="auto"/>
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%;">
          <div>自动解密已登录微信</div>
        </div>
      </label>
      <label
          style="width: 200px; height: 150px; background-color: #fff; display: flex; flex-direction: column; align-items: center; border-radius: 10px;">
        <input type="radio" v-model="init_type" value="custom"/>
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%;">
          <div>自定义文件位置</div>
        </div>
      </label>
    </div>
    <!-- END -->
  </div>
</template>

<style scoped>

</style>