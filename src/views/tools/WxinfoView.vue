<script setup lang="ts">
import { defineComponent, reactive, ref, onMounted, toRefs } from 'vue'
import { ElNotification, ElTable, ElTableColumn } from 'element-plus'
import http from '@/utils/axios.js';

interface wxinfo {
  pid: string;
  version: string;
  account: string;
  mobile: string;
  name: string;
  mail: string;
  wxid: string;
  filePath: string;
  key: string;
}

const wxinfoData = ref<wxinfo[]>([]);

const get_wxinfo = async () => {
  try {
    wxinfoData.value = await http.post('/api/ls/wxinfo');
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}
onMounted(get_wxinfo); // 初始化时获取数据

const refreshData = async () => {
  await get_wxinfo();
};

const exportData = () => {
  const csvContent = convertToCSV(wxinfoData.value);
  downloadCSV(csvContent, 'wxinfo_data.csv');
};

const convertToCSV = (data: wxinfo[]) => {
  const header = Object.keys(data[0]).join(',');
  const rows = data.map((item) => Object.values(item).join(','));
  return `${header}\n${rows.join('\n')}`;
};

const downloadCSV = (csvContent: string, fileName: string) => {
  const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  if ((navigator as any).msSaveBlob) {
    (navigator as any).msSaveBlob(blob, fileName);
  } else {
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  ElNotification.success({
    title: 'Success',
    message: 'CSV file exported successfully!',
  });
};
</script>

<template>
  <div class="merge-container">
    <el-card class="merge-card">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div style="font-size: 20px; font-weight: bold;">微信信息（已经登录）</div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <el-button style="margin-right: 10px;" @click="refreshData">刷新</el-button>
          <el-button style="margin-right: 10px;" @click="exportData">导出</el-button>
        </div>
      </div>
      <div style="margin-top: 20px;">
        <el-table :data="wxinfoData" style="width: 100%">
          <el-table-column :min-width="30" prop="pid" label="进程id"></el-table-column>
          <el-table-column :min-width="40" prop="version" label="微信版本"></el-table-column>
          <el-table-column :min-width="40" prop="account" label="账号"></el-table-column>
          <el-table-column :min-width="45" prop="mobile" label="手机号"></el-table-column>
          <el-table-column :min-width="40" prop="nickname" label="昵称"></el-table-column>
          <el-table-column :min-width="30" prop="mail" label="邮箱"></el-table-column>
          <el-table-column :min-width="50" prop="wxid" label="微信原始id"></el-table-column>
          <el-table-column prop="wx_dir" label="微信文件夹路径"></el-table-column>
          <el-table-column prop="key" label="密钥(key)"></el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.merge-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: top;
}

.merge-card {
  width: 90%;
  /* max-width: 800px; */
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>