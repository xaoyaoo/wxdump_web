<script setup lang="ts">
import {ref, onMounted, getCurrentInstance} from 'vue';
import axios from 'axios';

const tableData = ref([]);

const fetchData = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/contact_list');
    tableData.value = response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

onMounted(fetchData);

const name = 'ContactsList';

</script>

<template>
  <el-table :data="tableData" style="width: 100%" height="250">
    <el-table-column fixed prop="date" label="Date" width="150"/>
    <el-table-column prop="name" label="Name" width="120"/>
    <el-table-column prop="state" label="State" width="120"/>
    <el-table-column prop="city" label="City" width="320"/>
    <el-table-column prop="address" label="Address" width="600"/>
    <el-table-column prop="zip" label="Zip" width="120"/>
  </el-table>
</template>

<style scoped>

</style>