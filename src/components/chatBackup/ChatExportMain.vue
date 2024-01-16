<script setup lang="ts">
import {ref, defineProps, nextTick} from 'vue';
import ChatRecprdsHeader from "@/components/messages/ChatRecprdsHeader.vue";
import DateTimeSelect from "@/components/utils/DateTimeSelect.vue";
import http from '@/router/axios.js';

interface User {
  account: string
  describe: string
  headImgUrl: string
  nickname: string
  remark: string
  username: string
  chat_count: number
}

const props = defineProps({
  userData: {
    type: Object as () => User,
    required: true,
  }
});
// 这是传递的参数
const exportType = ref('');
const datetime = ref([]);
const chatType = ref(['文本']);

const Result = ref(''); // 用于显示返回值
// END 这是传递的参数


const chatTypeAll = ['文本', '图片', '语音', '视频', '动画表情', '文件', '卡片式链接', '用户上传的GIF表情',
  '转账消息', '赠送红包封面', '语音通话', '系统通知', '拍一拍', '系统通知', '其他'];
const checkAll = ref(false)
const isIndeterminate = ref(true)

const handleCheckAllChange = (val: boolean) => {
  chatType.value = val ? chatTypeAll : [] // 全选
  isIndeterminate.value = false // 全选后不显示半选状态
}
const handleCheckedCitiesChange = (value: string[]) => {
  const checkedCount = value.length // 选中的个数
  checkAll.value = checkedCount === chatTypeAll.length // 全选
  isIndeterminate.value = checkedCount > 0 && checkedCount < chatTypeAll.length // 半选
}

const handDatetimeChildData = (val: any) => {
  datetime.value = val;
}

// 导出数据
const exportData = async () => {
  try {
    if (exportType.value === '') {
      Result.value = '导出类型不能为空';
      return;
    }
    const body_data = await http.post('/api/export', {
      'export_type': exportType.value,
      'start_time': datetime.value[0],
      'end_time': datetime.value[1],
      'chat_type': chatType.value,
      'username': props.userData.username,
    });
    Result.value = body_data;
  } catch (error) {
    console.error('Error fetching data:', error);
    Result.value = String(error);
  }
}
</script>

<template>
  <div id="chat_export" style="background-color: #d2d2fa;padding:0;">
    <el-header style="height: 65px; max-height: 65px; width: 100%;padding-top: 5px;">
      <ChatRecprdsHeader :userData="userData"/>
    </el-header>
    <!--      分割线 -->
    <el-main style="overflow-y: auto; height: calc(100vh - 65px);padding: 0">
      <div style="background-color: #d2d2fa;height: calc(100vh - 65px); display: grid; place-items: center; ">
        <div
            style="background-color: #fff; width: 70%; height: 70%; border-radius: 10px; padding: 20px; overflow: auto;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="font-size: 20px; font-weight: bold;">导出与备份(未完待续...）</div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <!--          <el-button style="margin-right: 10px;" @click="exportData">导出</el-button>-->
            </div>
          </div>
          <div style="margin-top: 20px;">
            导出类型:
            <el-select v-model="exportType" placeholder="请选择导出类型" style="width: 50%;">
              <el-option label="加密文件(可还原回微信)-开发中" value="endb"></el-option>
              <el-option label="解密文件-开发中" value="dedb"></el-option>
              <el-option label="csv(只包含文字)-开发中" value="csv"></el-option>
              <el-option label="json(只包含文字)-开发中" value="json"></el-option>
              <el-option label="html-开发中" value="html"></el-option>
              <el-option label="pdf-开发中" value="pdf"></el-option>
              <!--              <el-option label="docx-开发中" value="docx"></el-option>-->
            </el-select>
            <br><br>
            <div>
              选项:<br>
              <div>
                ① 时间(默认全部)：
                <DateTimeSelect @datetime="handDatetimeChildData"/>
              </div>
              <div>
                ② 消息类型：
                <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选
                </el-checkbox>
                <el-checkbox-group v-model="chatType" @change="handleCheckedCitiesChange">
                  <el-checkbox v-for="typeName in chatTypeAll" :key="typeName" :label="typeName">{{ typeName }}
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </div>

            <el-button style="margin-top: 10px;width: 50%;" type="success" @click="exportData">导出</el-button>
            <el-divider></el-divider>  <!--    分割线    -->
            <el-input type="textarea" :rows="8" readonly placeholder="导出结果" v-model="Result"
                      style="width: 100%;"></el-input>
          </div>
        </div>
      </div>
    </el-main>
  </div>
</template>

<style scoped>

</style>