<script setup lang="ts">
import {defineProps} from 'vue';

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
const userDict = [
  {
    wxid: 'username',
    账号: 'account',
    昵称: 'nickname',
  },
  {
    备注: 'remark',
    描述: 'describe',
    数量: 'chat_count',
  }
];

</script>

<template>
  <el-row :gutter="5" style="width: 100%;" v-for="(dict, index) in userDict" :key="index">
    <template v-for="(value, key) in dict" :key="key">
      <el-col :span="8" style="white-space: nowrap;">
        <el-text class="label_color mx-1" truncated>{{ key }}:</el-text>&ensp;
        <el-text class="data_color mx-1" truncated :title="userData[value]">{{ userData[value] }}</el-text>
      </el-col>
    </template>
  </el-row>
</template>

<style scoped>
.label_color {
  color: #333; /* 调整字体颜色 */
  font-size: 15px;
  padding-left: 15px;
  padding-right: 0;
}


.data_color {
  color: #08488c;
  background-color: #f4f4f4; /* 调整背景颜色 */
  font-size: 15px;
  padding-left: 6px;
  padding-right: 6px;
  font-weight: bold; /* 使用 bold 表示加粗 */
  white-space: nowrap;
  max-width: 80%;
}
</style>