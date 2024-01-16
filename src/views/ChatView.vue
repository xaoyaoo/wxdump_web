<script setup lang="ts">
import ContactsList from '@/components/ContactsList.vue';
import ChatRecords from '@/components/ChatRecords.vue';
import {ref} from "vue";
import HomeView from "@/views/HomeView.vue";
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


const is_init = ref(false);
const selectedOption = ref('auto');

</script>
<template>
  <div id="chat_view" class="common-layout">
    <div v-if="!is_init">
      <div style="background-color: #d2d2fa; height: 100vh; display: grid; place-items: center; ">
        <label>
          <input type="radio" v-model="selectedOption" value="auto"/> 自动解密并显示当前微信
        </label>
        <br/>
        <label>
          <input type="radio" v-model="selectedOption" value="custom"/> 显示自定义文件
        </label>
      </div>
    </div>
    <div v-else>
      <el-container>
        <!--  这是左边的list    -->
        <el-aside width="266px" style="overflow-y: auto; height: calc(100vh);">
          <ContactsList @userData="handleChildData"/>
        </el-aside>
        <!-- END 这是左边的list -->

        <!--这是右边的具体聊天记录-->
        <div v-if="userData.username != ''" style="height: calc(100vh);width: 100%;">
          <ChatRecords :userData="userData"/>
        </div>

        <div v-else style="width: 100%;height: 100%">
          <HomeView/>
        </div>
        <!-- END 这是右边的具体聊天记录 -->
      </el-container>

    </div>
  </div>
</template>

<style scoped>

</style>