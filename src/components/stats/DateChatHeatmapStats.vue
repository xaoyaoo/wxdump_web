<script setup lang="ts">
import * as echarts from "echarts";
import {onMounted, ref, shallowRef} from "vue";
import {apiDateCount, apiTalkerCount} from "@/api/stat";
import {apiUserList} from "@/api/chat";
import {gen_show_name, type User} from "@/utils/common_utils";
import DateTimeSelect from "@/components/utils/DateTimeSelect.vue";
import ColorSelect from "@/components/utils/ColorSelect.vue";
import NumberInput from "@/components/utils/NumberInput.vue";
import ChartInit from "@/components/stats/components/ChartInit.vue";
import { ElMessage } from 'element-plus';

// https://echarts.apache.org/examples/en/editor.html

interface CountData {
  sender_count: number
  receiver_count: number
  total_count: number
}

interface calendar_face {
  top: number
  left: number
  orient: string
  range: string
  dayLabel: any
  monthLabel: any
  yearLabel: any
}

interface series_face {
  type: string
  coordinateSystem: string
  calendarIndex: number
  data: any[]
}


const datetime = ref([0, 0]);
const word = ref("");
const loading = ref(false);
const user_options = ref<User[]>([]);

const date_count_data = ref<any>({});
const top_user = ref<{ [key: string]: User }>({});
const top_user_count = ref<{ [key: string]: CountData }>({});

const is_update = ref(false);
const chart_option = ref({
  backgroundColor: "#ffffff",
  title: {
    left: 'center',
    text: '聊天记录（不包括群聊）'
  },
  toolbox: {
    feature: {saveAsImage: {}}
  },
  tooltip: {
    position: 'top',
    formatter: function (p: any) {
      return p.data[0] + '<br>聊天数量：' + p.data[1];
    }
  },
  visualMap: {
    min: 0,
    max: 500,
    calculable: true,
    orient: 'vertical',
    right: '0',
    top: 'center'
  },
  calendar: <calendar_face[]>[],
  series: <series_face[]>[],

});


const get_date_count_data = async () => {
  // {"2024-12-20":{ "sender_count": sender_count,  "receiver_count": receiver_count, "total_count": total_count  },....}
  date_count_data.value = await apiDateCount(word.value, datetime.value[0] / 1000, datetime.value[1] / 1000);

  // 根据key排序
  date_count_data.value = Object.fromEntries(Object.entries(date_count_data.value).sort());

}

const get_top_user_count = async () => {
  // {"wxid":{ "sender_count": sender_count,  "receiver_count": receiver_count, "total_count": total_count  },....}
  const body_data = await apiTalkerCount();
  top_user.value = await apiUserList("", Object.keys(body_data));
  top_user_count.value = body_data;
  // 根据total_count排序
  top_user_count.value = Object.fromEntries(Object.entries(top_user_count.value).sort((a, b) => b[1].total_count - a[1].total_count));
}

// 刷新图表 START
const refreshChart = async (is_get_data: boolean = true) => {
  if (is_get_data) {
    await get_date_count_data();
  }
  // 渲染图表
  let min_date = Object.keys(date_count_data.value)[0];
  let max_date = Object.keys(date_count_data.value)[Object.keys(date_count_data.value).length - 1];

  let min_year = parseInt(min_date.split("-")[0]);
  let max_year = parseInt(max_date.split("-")[0]);

  chart_option.value.calendar = [];
  chart_option.value.series = [];
  for (let i = min_year; i < max_year + 1; i++) {
    chart_option.value.calendar.push({
      top: 100,
      left: 50 + 200 * (i - min_year),
      orient: 'vertical',
      range: i.toString(),
      dayLabel: {
        margin: 5, firstDay: 1, nameMap: ['日', '一', '二', '三', '四', '五', '六'],
      },
      monthLabel: {
        margin: 5,
        nameMap: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
      },
      yearLabel: {"color": "#000"}
    });
    chart_option.value.series.push({
      type: 'heatmap', coordinateSystem: 'calendar', calendarIndex: i - min_year, data: []
    });
  }

  // refreshData();
  Object.keys(date_count_data.value).map(date => {
    let year = parseInt(date.split("-")[0]);
    let index = year - min_year;
    chart_option.value.series[index].data.push([date, date_count_data.value[date].total_count]);
  });
  is_update.value = !is_update.value;
}
// 刷新图表 END

onMounted(() => {
  get_top_user_count();
  refreshChart();
});


// 搜索联系人相关 START
const search_user = async (query: string) => {
  try {
    loading.value = true;
    if (query === '') {
      user_options.value = [];
      return;
    }
    const body_data = await apiUserList(query);
    loading.value = false;
    user_options.value = Object.values(body_data);
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

const set_top_user = async (wxid: string) => {
  try {
    word.value = wxid;
    await refreshChart();
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}
// 搜索联系人相关 END

</script>

<template>
  <div class="heatmap-container">
    <el-card class="heatmap-card">
      <template #header>
        <div class="card-header">
          <span class="title">聊天记录热力图</span>
        </div>
      </template>

      <div class="content">
        <div class="control-panel">
          <div class="control-group">
            <div class="control-item">
              <span class="label">时间范围：</span>
              <DateTimeSelect @datetime="(val: any) => {datetime = val;}"/>
            </div>
            
            <div class="control-item">
              <span class="label">联系人：</span>
              <el-select
                v-model="word"
                filterable
                remote
                reserve-keyword
                placeholder="输入想查看的联系人"
                remote-show-suffix
                clearable
                :remote-method="search_user"
                :loading="loading"
                class="user-select"
              >
                <el-option 
                  v-for="item in user_options" 
                  :key="item.wxid" 
                  :label="gen_show_name(item)" 
                  :value="item.wxid"
                />
              </el-select>
            </div>

            <div class="control-item">
              <el-button type="primary" @click="refreshChart">查看</el-button>
            </div>
          </div>

          <div class="control-group">
            <div class="control-item">
              <span class="label">背景色：</span>
              <color-select
                @updateColors="(val:any)=>{val?chart_option.backgroundColor=val:'';refreshChart(false)}"
              />
            </div>

            <div class="control-item">
              <span class="label">最小值：</span>
              <number-input 
                :n="chart_option.visualMap.min" 
                :step="100"
                @updateNumber="(val:any)=>{val?chart_option.visualMap.min=val:'';refreshChart(false)}"
              />
            </div>

            <div class="control-item">
              <span class="label">最大值：</span>
              <number-input 
                :n="chart_option.visualMap.max" 
                :step="100"
                @updateNumber="(val:any)=>{val?chart_option.visualMap.max=val:'';refreshChart(false)}"
              />
            </div>
          </div>

          <div class="top-users">
            <span class="label">TOP10[总:(收/发)]：</span>
            <div class="user-buttons">
              <el-button 
                v-for="wxid in Object.keys(top_user_count)" 
                :key="wxid"
                type="primary" 
                plain 
                @click="set_top_user(wxid)" 
                size="small"
                class="user-button"
              >
                {{ gen_show_name(top_user[wxid]) }} 
                [{{ top_user_count[wxid]?.total_count }}
                ({{ top_user_count[wxid]?.receiver_count }}/{{ top_user_count[wxid]?.sender_count }})]
              </el-button>
            </div>
          </div>
        </div>

        <div class="chart-container">
          <chart-init :option="chart_option" :update="is_update"/>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.heatmap-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.heatmap-card {
  width: 95%;
  max-width: 1200px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: center;
  align-items: center;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.content {
  padding: 20px;
}

.control-panel {
  margin-bottom: 20px;
}

.control-group {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
  align-items: center;
}

.control-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.label {
  font-weight: bold;
  color: #606266;
  white-space: nowrap;
}

.user-select {
  width: 240px;
}

.top-users {
  margin-top: 20px;
}

.user-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.user-button {
  margin: 5px;
}

.chart-container {
  height: 600px;
  width: 100%;
  margin-top: 20px;
}

:deep(.el-select) {
  width: 240px;
}

:deep(.el-button) {
  margin: 0;
}

:deep(.el-card__header) {
  padding: 15px 20px;
  border-bottom: 1px solid #ebeef5;
}

:deep(.el-card__body) {
  padding: 20px;
}
</style>