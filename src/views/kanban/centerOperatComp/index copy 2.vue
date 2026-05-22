<template>
  <div class="w-full h-full flex flex-col bg-[#011428]">
    <!-- 头部标题区域（不变） -->
    <div class="flex h-[80px] w-full relative">
      <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-4xl pt-2">
        星宇电子智能制造工厂-中区运营管理看板
      </div>
      <div class="absolute bottom-[-10px] right-1 ml-auto text-white text-[24px] flex items-center pr-5">
        {{ currentTime }}
      </div>
    </div>

    <!-- 主要内容区域：占满剩余高度，两行卡片 -->
    <div class="flex-1 flex flex-col px-2 pt-1 pb-2">
      <!-- 第一行：安全生产日期、月度产能、月度目标 -->
      <div class="h-1/2 mb-2">
        <el-row :gutter="6" class="h-full">
          <el-col :span="4" class="h-full">
            <div class="card-container h-full">
              <div class="card-header">
                <i class="fa fa-tasks"></i>安全生产日期
              </div>
              <div class="card-production">
                <div class="main-number">
                  <span class="number">{{ safeDays }}</span>
                  <span class="unit">天</span>
                </div>
                <div class="text-white text-lg mt-2">从1月28日开始统计</div>
              </div>
            </div>
          </el-col>

          <el-col :span="12" class="h-full">
            <div class="card-container h-full">
              <div class="card-header">
                <i class="fa fa-tasks"></i>当月月度产能
              </div>
              <div class="output-chart-area">
                <MonthGaugeChart class="output-gauge" :value="monthlyActual" :max="2018855" />
                <MonthBarChart class="output-bar" :actual="monthlyActual" :target="2018855" />
              </div>
            </div>
          </el-col>

          <el-col :span="8" class="h-full">
            <div class="card-container h-full">
              <div class="card-header">
                <i class="fa fa-tasks"></i>历史月度目标
              </div>
              <MonthTargetChart
                class="chart-container"
                :months="['1月','2月','3月','4月']"
                :targetData="[89.16, 96.0, 96.0, 110.0]"
                :actualData="[89.16, 96.0, 96.0, 110.0]"
                :rateData="[100, 100, 100, 100]"
              />
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 第二行：ICT / FCT 环形图 -->
      <div class="h-1/2">
        <el-row :gutter="6" class="h-full">
          <el-col :span="12" class="h-full">
            <div class="card-container h-full">
              <div class="card-header"><i class="fa fa-tasks"></i>ICT</div>
              <RingChart class="chart-container" :value="99.50" color="#1e90ff" />
            </div>
          </el-col>
          <el-col :span="12" class="h-full">
            <div class="card-container h-full">
              <div class="card-header"><i class="fa fa-tasks"></i>FCT</div>
              <RingChart class="chart-container" :value="99.26" color="#00b36b" />
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import MonthGaugeChart from './components/MonthGaugeChart.vue'
import MonthBarChart from './components/MonthBarChart.vue'
import MonthTargetChart from './components/MonthTargetChart.vue'
import RingChart from './components/RingChart.vue'
const monthlyActual = ref(339416)
// ---------- 时间 ----------
const currentTime = ref('')
const capacityTimer =ref< ReturnType<typeof setInterval> | null >(null)
let timer: ReturnType<typeof setInterval> | null = null

const updateTime = () => {
  const now = new Date()
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const w = weekDays[now.getDay()]
  const hh = String(now.getHours()).padStart(2, '0')
  const mm = String(now.getMinutes()).padStart(2, '0')
  const ss = String(now.getSeconds()).padStart(2, '0')
  currentTime.value = `${y}-${m}-${d} ${w} ${hh}:${mm}:${ss}`
   safeDays.value = Math.floor((new Date().getTime() - new Date('2026-01-28').getTime()) / (1000 * 60 * 60 * 24))+1
}

// ---------- 安全生产天数 ----------
const safeDays = ref(104)

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
   capacityTimer.value = setInterval(() => {
    monthlyActual.value += 12
  }, 30000)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
   if (capacityTimer.value) clearInterval(capacityTimer.value)
})
</script>

<style lang="scss" scoped>
/* 图表容器高度自适应 */
.chart-container {
  height: calc(100% - 50px);
  width: 100%;
}

/* 卡片基础样式，移除固定高度，由父级控制 */
.card-container {
  height: 100%;
  background: linear-gradient(135deg, rgba(16, 33, 68, 0.9) 0%, rgba(9, 28, 59, 0.95) 100%);
  border: 1px solid rgba(64, 160, 255, 0.3);
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 0 20px rgba(64, 160, 255, 0.15);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, transparent, #40a9ff, transparent);
    opacity: 0.8;
  }
}

.card-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(64, 160, 255, 0.3);
  font-size: 22px;
  font-weight: bold;
  color: #8ac6ff;

  i {
    margin-right: 8px;
    color: #40a9ff;
  }
}

.card-production {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100% - 60px);
  color: #fff;
  text-align: center;

  .main-number {
    display: flex;
    align-items: baseline;
    justify-content: center;
    background: linear-gradient(135deg, rgba(9, 39, 77, 0.9) 0%, rgba(16, 33, 68, 0.8) 100%);
    border-radius: 8px;
    padding: 20px 40px;
    border: 1px solid rgba(64, 147, 255, 0.3);
    box-shadow: 0 0 15px rgba(64, 160, 255, 0.1);

    .number {
      font-size: 52px;
      font-weight: 900;
      background: linear-gradient(180deg, #ffffff 0%, #b0d4ff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-shadow: 0 0 18px rgba(64, 160, 255, 0.5);
    }

    .unit {
      font-size: 20px;
      color: #8ac6ff;
      margin-left: 4px;
      font-weight: 600;
    }
  }
}

/* 合并月度产能图表区（左仪表盘、右柱状图） */
.output-chart-area {
  display: flex;
  height: calc(100% - 60px);
  align-items: center;
  justify-content: space-between;

  .output-gauge {
    width: 220px;
    height: 100%;
  }

  .output-bar {
    flex: 1;
    height: 100%;
    margin-left: 10px;
  }
}
</style>