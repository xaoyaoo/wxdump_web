<script setup lang="ts">
import {ref, onMounted, defineProps, defineEmits} from 'vue';
import http from '@/router/axios.js';

const tableData = ref([]);

interface User {
  account: string
  describe: string
  headImgUrl: string
  nickname: string
  remark: string
  username: string
  chat_count: number
}

const req = async (start: number, limit: number, word: string = '') => {
  try {
    const body_data = await http.post('/api/contact_count_list', {
      'start': start,
      'limit': limit,
      'word': word,
    });
    return body_data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

const fetchData = async () => {
  try {
    const body_data = await req(0, 800);
    tableData.value = body_data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

onMounted(fetchData);

const search_word = ref('');
const search = async () => {
  try {
    const body_data = await req(0, 100, search_word.value);
    tableData.value = body_data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

const props = defineProps(['tableData']);
const emits = defineEmits(['userData']);
const handleCurrentChange = (val: User | undefined) => {
  // 触发自定义事件，并传递数据
  if (val !== undefined) {
    // 处理user数据
    emits('userData', val);
  }
}

</script>

<template>
  <div>
    <!-- 搜索框以及按钮   -->
    <div style="padding: 10px 10px;">
      <el-input placeholder="请输入关键字" v-model="search_word" @keyup.enter="search" style="width: 180px;margin-left: 15px;"></el-input>
      <el-button type="primary" @click="search" style="width: 70px;">搜索</el-button>
    </div>
    <!--  这是联系人的list    -->
    <el-table :data="tableData" stripe style="width: 100%" max-height="100%" height="100%" highlight-current-row
              @current-change="handleCurrentChange">
      <el-table-column  width="57">
        <template v-slot="{ row }">
          <el-avatar :size="33" :src=row.headImgUrl v-if="row.headImgUrl!==''">
          </el-avatar>
          <el-avatar :size="33" v-else>
            群聊
          </el-avatar>
        </template>
      </el-table-column>
      <el-table-column label="name" width="180">
        <template v-slot="{ row }">
          <span v-if="row.remark !== null && row.remark !== ''">{{ row.remark }}</span>
          <span v-else>{{ row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="chat_count" label="num" width="70"/>
    </el-table>
  </div>
</template>

<style scoped>

</style>