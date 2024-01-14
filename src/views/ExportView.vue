<script setup lang="ts">
import {ref} from "vue";
import HomeView from "@/views/HomeView.vue";
import ContactsList from "@/components/ContactsList.vue";
import ChatExportMain from "@/components/chatBackup/ChatExportMain.vue";

interface User {
  account: string
  describe: string
  headImgUrl: string
  nickname: string
  remark: string
  username: string
  chat_count: number
}

const userData = ref<User>({
  account: '',
  describe: '',
  headImgUrl: '',
  nickname: '',
  remark: '',
  username: '',
  chat_count: 0,
});
const handleChildData = (val: any) => {
  userData.value = val;
}
</script>

<template>
    <div id="chat_view" class="common-layout">
    <el-container>

      <!--  这是左边的list    -->
      <el-aside width="266px" style="overflow-y: auto; height: calc(100vh);">
        <ContactsList @userData="handleChildData"/>
      </el-aside>

      <!--这是右边的具体聊天记录-->
      <div v-if="userData.username != ''" style="height: calc(100vh);width: 100%;background-color: #d2d2fa;">
        <ChatExportMain :userData="userData"/>
      </div>

      <div v-else style="width: 100%;height: 100%">
        <HomeView/>
      </div>
      <!-- END 这是右边的具体聊天记录 -->
    </el-container>
  </div>
</template>

<style scoped>

</style>