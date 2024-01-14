<script setup lang="ts">
import {ref, defineProps, nextTick} from 'vue';
import ChatRecprdsHeader from "@/components/messages/ChatRecprdsHeader.vue";
import DateTimeSelect from "@/components/utils/DateTimeSelect.vue";

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

const exportType = ref('');
const outPath = ref('');
const datetime = ref([]);



const Result = ref('');

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
            <div style="font-size: 20px; font-weight: bold;">导出与备份</div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <!--          <el-button style="margin-right: 10px;" @click="exportData">导出</el-button>-->
            </div>
          </div>
          <div style="margin-top: 20px;">
            导出类型:
            <el-select v-model="exportType" placeholder="请选择导出类型" style="width: 50%;">
              <el-option label="加密db文件" value="endb"></el-option>
              <el-option label="解密db文件" value="dedb"></el-option>
              <el-option label="csv" value="csv"></el-option>
              <el-option label="json" value="json"></el-option>
              <el-option label="html" value="html"></el-option>
              <el-option label="pdf" value="pdf"></el-option>
              <el-option label="docx" value="docx"></el-option>
            </el-select>
            <br>
            导出路径:
            <el-input placeholder="请输入导出路径" v-model="outPath" style="width: 50%;"></el-input>
            <br>
            其他选项:<br>
            ① 时间：  <DateTimeSelect @datetime="handleChildData"/>
            <br>
            ② 消息类型： <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
              <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
            </el-checkbox-group>


            <br>
            <el-button style="margin-top: 10px;width: 50%;" type="success" @click="exportData">导出</el-button>
            <el-divider></el-divider>  <!--    分割线    -->
            <el-input type="textarea" :rows="10" readonly placeholder="导出结果" v-model="exportResult"
                      style="width: 100%;"></el-input>
          </div>
        </div>
      </div>
    </el-main>
  </div>
</template>

<style scoped>

</style>