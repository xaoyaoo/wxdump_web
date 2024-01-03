<script setup lang="ts">
import {defineProps, ref, onMounted} from "vue";
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

const messages = ref([]);


const req = async (start: number, limit: number) => {
  try {
    return await http.post('/api/msgs', {
      'start': start,
      'limit': limit,
      'wxid': props.userData.username,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

const fetchData = async () => {
  try {
    const body_data = await req(0, 100);
    tableData.value = body_data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

onMounted(fetchData);

</script>

<template>
  <el-text>这是聊天记录 {{ userData.username }}</el-text>
</template>

<style scoped>
.sent-message {
  text-align: right;
  background-color: #e6f7ff; /* Light blue for sent messages */
}

.received-message {
  text-align: left;
  background-color: #f2f2f2; /* Light gray for received messages */
}
</style>