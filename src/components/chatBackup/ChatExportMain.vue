<script setup lang="ts">
import {ref, defineProps, nextTick, watch} from 'vue';
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

// 这是传递给服务端的参数
const exportType = ref('');
const datetime = ref([]);
const chatType = ref(['文本']);
const key = ref('');
const wx_path = ref('');

const Result = ref(''); // 用于显示返回值
// END 这是传递的参数

const setting = {
  'endb': {
    brief: '加密文件',
    detail: "导出的内容为微信加密数据库（）。\n可还原回微信,但会覆盖微信后续消息。",
    userShow: false,
    timeShow: false,
    chatTypeShow: false,
    keyShow: false,
    wxPathShow: true,
  },
  'dedb': {
    brief: '解密文件',
    detail: "导出的文件为解密后的sqlite数据库，并且会自动合并msg和media数据库为同一个，但是无法还原会微信。",
    userShow: false,
    timeShow: true,
    chatTypeShow: false,
    keyShow: false,
    wxPathShow: false,
  },
  'csv': {
    brief: 'csv(只包含文字)-开发中',
    detail: "只包含文本，但是可以用excel软件（wps，office）打开。",
    userShow: true,
    timeShow: false,
    chatTypeShow: false,
    keyShow: false,
    wxPathShow: false,
  },
  'json': {
    brief: 'json(只包含文字)-开发中',
    detail: "只包含文本，可用于数据分析，情感分析等方面。",
    userShow: true,
    timeShow: true,
    chatTypeShow: false,
    keyShow: false,
    wxPathShow: true,
  },
  'html': {
    brief: 'html-开发中',
    detail: "主要用于浏览器可视化查看。",
    userShow: true,
    timeShow: true,
    chatTypeShow: true,
    keyShow: false,
    wxPathShow: true,
  },
  'pdf': {
    brief: 'pdf-开发中',
    detail: "就是html的pdf版本。",
    userShow: true,
    timeShow: true,
    chatTypeShow: true,
    keyShow: false,
    wxPathShow: true,
  },
  'docx': {
    brief: 'docx-开发中',
    detail: "就是html的docx版本。",
    userShow: true,
    timeShow: true,
    chatTypeShow: true,
    keyShow: false,
    wxPathShow: true,
  },
};

// 用于显示chat选项
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
// END 用于显示选项

// 用于获取子组件的时间返回值
const handDatetimeChildData = (val: any) => {
  datetime.value = val;
}
// END 用于获取子组件的时间返回值

// 监听导出类型,用于确定某些选项是否显示
const userShow = ref(false);
const timeShow = ref(false);
const chatTypeShow = ref(false);
const keyShow = ref(false);
const wxPathShow = ref(false);
// 各个选项的说明
watch(exportType, (val: string) => {
  userShow.value = setting[val].userShow;
  timeShow.value = setting[val].timeShow;
  chatTypeShow.value = setting[val].chatTypeShow;
  keyShow.value = setting[val].keyShow;
  wxPathShow.value = setting[val].wxPathShow;
  Result.value = setting[val].detail;
})

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
      'wx_path': wx_path.value,
    });
    Result.value = body_data;
  } catch (error) {
    console.error('Error fetching data:', error);
    Result.value = String(error) + "\n更多信息请查看控制台；";
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
            <el-select placeholder="请选择导出类型" style="width: 50%;"
                       v-model="exportType">
              <el-option :label="value.brief" :value="index" v-for="(value,index) in setting" :key="index">
                {{ value.brief }}
              </el-option>
            </el-select>
            <br><br>
            <div>
              选项:<br>
              <div v-if="userShow">
                ** 用户(默认全部，从左边选择具体用户)：
                <el-row :gutter="5" style="width: 100%;">
                  <el-col :span="6" style="white-space: nowrap;">
                    <el-text class="label_color mx-1" truncated>原始id:</el-text>&ensp;
                    <el-text class="data_color mx-1" truncated>{{ userData.username }}
                    </el-text>
                  </el-col>
                  <el-col :span="6" style="white-space: nowrap;">
                    <el-text class="label_color mx-1" truncated>账号:</el-text>&ensp;
                    <el-text class="data_color mx-1" truncated>{{ userData.account }}
                    </el-text>
                  </el-col>
                  <el-col :span="6" style="white-space: nowrap;">
                    <el-text class="label_color mx-1" truncated>昵称:</el-text>&ensp;
                    <el-text class="data_color mx-1" truncated>{{ userData.nickname }}</el-text>
                  </el-col>
                  <el-col :span="6" style="white-space: nowrap;">
                    <el-text class="label_color mx-1" truncated>备注:</el-text>&ensp;
                    <el-text class="data_color mx-1" truncated>{{ userData.remark }}</el-text>
                  </el-col>

                </el-row>

              </div>
              <div v-if="timeShow">
                <strong>** 时间(默认全部)：</strong>
                <DateTimeSelect @datetime="handDatetimeChildData"/>
              </div>
              <div v-if="chatTypeShow">
                ** 消息类型：
                <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选
                </el-checkbox>
                <el-checkbox-group v-model="chatType" @change="handleCheckedCitiesChange">
                  <el-checkbox v-for="typeName in chatTypeAll" :key="typeName" :label="typeName">{{ typeName }}
                  </el-checkbox>
                </el-checkbox-group>
              </div>
              <div v-if="keyShow">
                ** 微信文件夹路径：
                <el-input placeholder="密钥key[可为空]" v-model="key"
                          style="width: 50%;"></el-input>
              </div>
              <div v-if="wxPathShow">
                ** 微信文件夹路径：
                <el-input placeholder="微信文件夹路径[可为空](eg: C:\****\WeChat Files\wxid_**** )" v-model="wx_path"
                          style="width: 50%;"></el-input>
              </div>
            </div>

            <el-button style="margin-top: 10px;width: 50%;" type="success" @click="exportData">导出</el-button>
            <el-divider></el-divider>  <!--    分割线    -->
            <el-input type="textarea" :rows="6" readonly placeholder="" v-model="Result"
                      style="width: 100%;"></el-input>
          </div>
        </div>
      </div>
    </el-main>
  </div>
</template>

<style scoped>

</style>