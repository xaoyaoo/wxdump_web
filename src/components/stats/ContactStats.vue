<script setup lang="ts">
import * as echarts from "echarts";
import {onMounted, ref, shallowRef} from "vue";
import {apiDateCount, apiTalkerCount, apiWordcloud} from "@/api/stat";
import {apiUserList} from "@/api/chat";
import {gen_show_name, type User} from "@/utils/common_utils";
import DateTimeSelect from "@/components/utils/DateTimeSelect.vue";
import ColorSelect from "@/components/utils/ColorSelect.vue";
import ChartInit from "@/components/stats/components/ChartInit.vue";
import { ElMessage } from 'element-plus';


// https://echarts.apache.org/examples/en/editor.html

interface gender_face {
  男: number
  女: number
  未知: number
}

const user = ref<{ [key: string]: User }>({});
const gender_data = ref<gender_face>({
  男: 0,
  女: 0,
  未知: 0
});
const signature_count_dict = ref<{ [key: string]: number }>({});

const is_update = ref(false);
const chart_option = ref({
  backgroundColor: "",
  tooltip: {
    trigger: 'item'
  },
  title: {
    left: 'center',
    text: '联系人画像'
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  series: [
    {
      name: '性别',
      type: 'pie',
      radius: ["10%", "20%"],
      center: ['50%', '200px'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 40,
          fontWeight: 'bold'
        }
      },
      data: <any>[]
    }, {
      name: '个性签名词云',
      type: 'wordCloud',
      sizeRange: [15, 80],
      rotationRange: [0, 0],
      rotationStep: 45,
      gridSize: 8,
      shape: 'cardioid',
      keepAspect: false,
      width: '100%',
      height: '100%',
      drawOutOfBound: false,
      textStyle: {
        normal: {
          color: function () {
            return 'rgb(' + [
              Math.round(Math.random() * 160),
              Math.round(Math.random() * 160),
              Math.round(Math.random() * 160)
            ].join(',') + ')';
          },
          fontFamily: 'sans-serif',
          fontWeight: 'normal'
        },
        emphasis: {
          shadowBlur: 10,
          shadowColor: '#333'
        }
      },
      data: <any>[]
    }
  ]
});


const get_data = async () => {
  user.value = await apiUserList();
  signature_count_dict.value = await apiWordcloud("signature");

  let gender_data1 = {'男': 0, '女': 0, '未知': 0};
  let province_data: { [key: string]: number } = {};
  let city_data: { [key: string]: number } = {};
  let signature_data: { [key: string]: number } = {};
  for (let key in user.value) {
    let u = user.value[key];
    let ExtraBuf = u.ExtraBuf;
    if (ExtraBuf) {
      if (ExtraBuf["性别[1男2女]"] == 1) {
        gender_data1['男'] += 1;
      } else if (ExtraBuf["性别[1男2女]"] == 2) {
        gender_data1['女'] += 1
      } else {
        gender_data1['未知'] += 1
      }
    } else {
      gender_data1['未知'] += 1
    }
  }
  gender_data.value = gender_data1;
}

// 刷新图表 START
const refreshChart = async (is_get_data: boolean = true) => {
  if (is_get_data) {
    await get_data();
  }
  // 渲染图表
  chart_option.value.series[0].data = [
    {'value': gender_data.value["男"], 'name': '男', itemStyle: {color: '#4F6FE8'}},
    {'value': gender_data.value["女"], 'name': '女', itemStyle: {color: '#FF6347'}}
  ]

  chart_option.value.series[1].data = Object.keys(signature_count_dict.value).map((key) => {
    return {name: key, value: signature_count_dict.value[key]}
  });
  is_update.value = !is_update.value;
}
// 刷新图表 END

onMounted(() => {
  refreshChart();
});


// 搜索联系人相关 END

</script>

<template>
  <div class="contact-container">
    <el-card class="contact-card">
      <template #header>
        <div class="card-header">
          <span class="title">联系人画像</span>
        </div>
      </template>

      <div class="content">
        <div class="control-panel">
          <div class="control-group">
            <div class="control-item">
              <span class="label">背景色：</span>
              <color-select
                @updateColors="(val:any)=>{val?chart_option.backgroundColor=val:'';refreshChart(false)}"
              />
            </div>
          </div>
        </div>

        <div class="stats-info">
          <div class="gender-stats">
            <div class="stat-item">
              <span class="stat-label">男性：</span>
              <span class="stat-value">{{ gender_data["男"] }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">女性：</span>
              <span class="stat-value">{{ gender_data["女"] }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">未知：</span>
              <span class="stat-value">{{ gender_data["未知"] }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">总计：</span>
              <span class="stat-value">{{ gender_data["男"] + gender_data["女"] + gender_data["未知"] }}</span>
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
.contact-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.contact-card {
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

.stats-info {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.gender-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.stat-label {
  font-weight: bold;
  color: #606266;
}

.stat-value {
  font-size: 18px;
  font-weight: bold;
  color: #409EFF;
}

.chart-container {
  height: 600px;
  width: 100%;
  margin-top: 20px;
}

:deep(.el-card__header) {
  padding: 15px 20px;
  border-bottom: 1px solid #ebeef5;
}

:deep(.el-card__body) {
  padding: 20px;
}
</style>