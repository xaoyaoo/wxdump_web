<script setup lang="ts">
import {defineEmits, defineProps, nextTick, onMounted, ref, watch} from 'vue';
import http from "@/utils/axios.js";
import {ElTable, ElNotification, ElMessage, ElMessageBox} from "element-plus";
import {apiMsgCount, apiMsgCountSolo, apiRealTime, apiUserList} from "@/api/chat";
import {gen_show_name, type User} from "@/utils/common_utils";
import UserInfoShow from "@/components/chat/components/UserInfoShow.vue";

const props = defineProps({
  wxid: {
    type: String,
    required: true,
  }
});

const msg_count = ref<number>(0);
const userinfo = ref<User>({
  wxid: '',
  nOrder: 0,
  nUnReadCount: 0,
  strNickName: '',
  nStatus: 0,
  nIsSend: 0,
  strContent: '',
  nMsgLocalID: 0,
  nMsgStatus: 0,
  nTime: '',
  nMsgType: 0,
  nMsgSubType: 0,
  nickname: '',
  remark: '',
  account: '',
  describe: '',
  headImgUrl: '',
  ExtraBuf: {
    "个性签名": "",
    "企微属性": "",
    "公司名称": "",
    "国": "",
    "备注图片": "",
    "备注图片2": "",
    "市": "",
    "性别[1男2女]": 0,
    "手机号": "",
    "朋友圈背景": "",
    "省": ""
  },
  LabelIDList: [],
  extra: null
});

// 请求数据，赋值 START
const req_user_info = async () => {
  // 请求数据 用户信息
  try {
    const body_data = await apiUserList("", [props.wxid]);
    userinfo.value.wxid = props.wxid;
    userinfo.value.remark = body_data[props.wxid]?.remark;
    userinfo.value.account = body_data[props.wxid]?.account;
    userinfo.value.describe = body_data[props.wxid]?.describe;
    userinfo.value.headImgUrl = body_data[props.wxid]?.headImgUrl;
    userinfo.value.nickname = body_data[props.wxid]?.nickname;
    userinfo.value.LabelIDList = body_data[props.wxid]?.LabelIDList;
    userinfo.value.ExtraBuf = body_data[props.wxid]?.ExtraBuf;
    userinfo.value.extra = body_data[props.wxid]?.extra;
    return body_data;
  } catch (error) {
    console.error('Error fetching data wxid2user :', error);
    return [];
  }
}

const req_msg_count = async () => {
  try {
    msg_count.value = 0;
    const body_data = await apiMsgCountSolo(props.wxid);
    msg_count.value = body_data || 0;
    return body_data;
  } catch (error) {
    console.error('Error fetching data msg_count:', error);
    return [];
  }
}
// 请求数据，赋值 END

// 初始调用函数 START
const init = () => {
  is_export.value = false;
  req_user_info();
  req_msg_count();
}
onMounted(() => {
  console.log('ChatRecprdsHeader onMounted', props.wxid)
  init();
});
watch(() => props.wxid, async (newVal, oldVal) => {
  if (newVal !== oldVal) {
    init();
  }
});
// 初始调用函数 END

// 弹窗展示更多信息 START
const is_show_more = ref(false);
// 获取实时消息 START

const is_getting_real_time_msg = ref(false);
const get_real_time_msg = async () => {
  if (is_getting_real_time_msg.value) {
    console.log("正在获取实时消息，请稍后再试!")
    return;
  }
  is_getting_real_time_msg.value = true;
  try {
    const body_data = await apiRealTime();
    is_getting_real_time_msg.value = false;
    return body_data;
  } catch (error) {
    is_getting_real_time_msg.value = false;
    return [];
  }
}
// 获取实时消息 END

// 导出消息按钮，并传递是否导出给父组件 START
const is_export = ref(false);
const emits = defineEmits(['exporting']);
const export_button = (val: boolean) => {
// 提交参数 is_export 给父组件
  emits('exporting', val);
  is_export.value = val;
}
// 导出消息按钮，并传递是否导出给父组件 END


</script>

<template>
  <el-card class="chat-header-card" shadow="hover">
    <div class="header-content">
      <div class="info-section">
        <div class="info-item">
          <span class="label">wxid:</span>
          <el-tag class="value" size="small" effect="plain">{{ userinfo?.wxid }}</el-tag>
        </div>
        
        <div class="info-item">
          <span class="label">名称:</span>
          <el-tag class="value" size="small" effect="plain">{{ gen_show_name(userinfo) }}</el-tag>
        </div>
        
        <div class="info-item">
          <span class="label">消息数量:</span>
          <el-tag class="value" size="small" type="info" effect="plain">{{ msg_count }}</el-tag>
        </div>
      </div>

      <div class="action-section">
        <el-button 
          type="primary" 
          link 
          @click="is_show_more=!is_show_more"
          :icon="is_show_more ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
        >
          详细信息
        </el-button>

        <el-button 
          type="primary" 
          link 
          @click="export_button(!is_export)"
        >
          {{ is_export ? '聊天查看' : '导出备份' }}
        </el-button>

        <el-button 
          type="primary" 
          link 
          @click="get_real_time_msg()"
          :loading="is_getting_real_time_msg"
        >
          实时消息
        </el-button>
      </div>
    </div>

    <el-dialog 
      v-model="is_show_more" 
      title="详细信息" 
      width="600" 
      center
      class="info-dialog"
    >
      <user-info-show :userinfo="userinfo" :show_all="true"></user-info-show>
    </el-dialog>
  </el-card>
</template>

<style scoped>
.chat-header-card {
  margin-bottom: 20px;
  border-radius: 8px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.info-section {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.label {
  color: #606266;
  font-size: 14px;
  font-weight: 500;
}

.value {
  font-size: 14px;
  padding: 0 8px;
  height: 24px;
  line-height: 24px;
}

.action-section {
  display: flex;
  gap: 16px;
  align-items: center;
}

:deep(.el-button--link) {
  padding: 0 8px;
  height: 24px;
  font-size: 14px;
}

:deep(.el-button--link:hover) {
  color: #409EFF;
}

:deep(.el-dialog) {
  border-radius: 8px;
}

:deep(.el-dialog__header) {
  padding: 20px;
  margin: 0;
  border-bottom: 1px solid #ebeef5;
}

:deep(.el-dialog__body) {
  padding: 20px;
}

@media screen and (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .action-section {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>