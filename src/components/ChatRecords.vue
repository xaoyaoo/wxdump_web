<script setup lang="ts">
import ChatRecprdsHeader from '@/components/messages/ChatRecprdsHeader.vue';
import ChatRecordsMain from '@/components/messages/ChatRecordsMain.vue';
import {ref, defineProps} from 'vue';

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

</script>

<template>
  <el-container>
    <el-header style="height: 65px; max-height: 65px; width: 100%;background-color: #d2d2fa;padding-top: 5px;">
      <ChatRecprdsHeader :userData="userData"/>
    </el-header>

    <el-main style="overflow-y: auto;padding: 10px;">
      <ChatRecordsMain :userData="userData"/>
    </el-main>
  </el-container>
</template>

<style scoped>

</style>