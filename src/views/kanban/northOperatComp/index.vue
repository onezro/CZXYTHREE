<template>
  <div class="w-full h-full flex flex-col bg-[#011428]">
    <!-- 头部标题区域 -->
    <div class="flex h-[80px] w-full relative">
      <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-4xl pt-2">
        星宇电子智能制造工厂-北区SMT运营管理看板
      </div>
      <div class="absolute bottom-[-10px] right-1 ml-auto text-white text-[24px] flex items-center pr-5">
        {{ currentTime }}
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="flex-1 mt-1 px-2">
      <div class="h-[330px]">
        <el-row :gutter="6" class="h-full">
          <!-- 安全生产日期 -->
          <el-col :span="4">
            <div class="card-container" style="height: 330px">
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

          <!-- 月度产能（合并仪表盘+柱状图） -->
          <el-col :span="12">
            <div class="card-container" style="height: 330px">
              <div class="card-header">
                <i class="fa fa-tasks"></i>当月度产能
              </div>
              <div class="output-chart-area">
                <MonthGaugeChart class="output-gauge" :value="monthlyActual" :max="2018855" />
                <MonthBarChart class="output-bar" :actual="monthlyActual" :target="2018855" />
              </div>
            </div>
          </el-col>

          <!-- 月度目标（柱状对比图） -->
          <el-col :span="8">
            <div class="card-container" style="height: 330px">
              <div class="card-header">
                <i class="fa fa-tasks"></i>历史月度目标
              </div>
              <MonthTargetChart class="chart-container" :months="['1月', '2月', '3月', '4月']"
                :targetData="[89.16, 96.0, 96.0, 110.0]" :actualData="[89.16, 96.0, 96.0, 110.0]"
                :rateData="[100, 100, 100, 100]" />
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- FPY / SPI / AOI 环形图 -->
      <div class="h-[330px] mt-2">
        <el-row :gutter="6">
          <el-col :span="8">
            <div class="card-container">
              <div class="card-header"><i class="fa fa-tasks"></i>FPY</div>
              <FpyRingChart class="chart-container" :value="99.98" color="#1e90ff" />
            </div>
          </el-col>
          <el-col :span="8">
            <div class="card-container">
              <div class="card-header"><i class="fa fa-tasks"></i>SPI</div>
              <FpyRingChart class="chart-container" :value="99.99" color="#00b36b" />
            </div>
          </el-col>
          <el-col :span="8">
            <div class="card-container">
              <div class="card-header"><i class="fa fa-tasks"></i>AOI</div>
              <FpyRingChart class="chart-container" :value="99.99" color="#e06520" />
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- OEE / MBTF / MTTR -->
      <div class="h-[330px]">
        <el-row :gutter="6">
          <el-col :span="8">
            <div class="card-container">
              <div class="card-header"><i class="fa fa-tasks"></i>OEE</div>
              <OeeBarChart class="chart-container" :actual="91" :target="90" />
            </div>
          </el-col>
          <el-col :span="8">
            <div class="card-container">
              <div class="card-header"><i class="fa fa-tasks"></i>MBTF</div>
              <MttrGaugeChart class="chart-container" :value="mtbfValue" :max="700" targetText="" unit="h" />
            </div>
          </el-col>
          <el-col :span="8">
            <div class="card-container">
              <div class="card-header"><i class="fa fa-tasks"></i>MTTR</div>
              <MbtfGaugeChart class="chart-container" :value="mttrValue" :max="60" :threshold="30" targetText=""
                unit="min" />
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
import FpyRingChart from './components/FpyRingChart.vue'
import OeeBarChart from './components/OeeBarChart.vue'
import MbtfGaugeChart from './components/MbtfGaugeChart.vue'
import MttrGaugeChart from './components/MttrGaugeChart.vue'

// ---------- 时间 ----------
const currentTime = ref('')
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
  safeDays.value = Math.floor((new Date().getTime() - new Date('2026-01-28').getTime()) / (1000 * 60 * 60 * 24)) + 1
}
const monthlyActual = ref(339416)
const mtbfValue = ref(720)
const mttrValue = ref(25)
// ---------- 安全生产天数 ----------
const safeDays = ref(104)
const capacityTimer = ref<ReturnType<typeof setInterval> | null>(null)
const fluctuationTimer = ref<ReturnType<typeof setInterval> | null>(null)
const dataRefreshTimer = ref<ReturnType<typeof setInterval> | null>(null)

// ---------- MTBF 整点递增逻辑 ----------
let mtbfTimer: ReturnType<typeof setInterval> | null = null
// 记录上一次触发的小时数，避免同一小时内重复触发
let lastProcessedHour: number | null = null

const handleMtbfHourlyUpdate = () => {
  const now = new Date()
  const currentHour = now.getHours()
  // 如果是新的一小时（与上次处理的小时不同）
  if (lastProcessedHour !== currentHour) {
    lastProcessedHour = currentHour
    // 早上7点重置为720
    if (currentHour === 7) {
      mtbfValue.value = 720
      monthlyActual.value=339416
    } else {
      // 其他整点递增1小时
      mtbfValue.value += 1
    }
  }
}

const getData = async () => {
  // 模拟请求
  await new Promise(resolve => setTimeout(resolve, 80))
  // 可以在此更新其他数据，但不动原有静态数据
  console.log('[模拟请求] 数据刷新')
}
onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
  // 安全生产天数在 updateTime 中计算，所以不再单独设置
  capacityTimer.value = setInterval(() => {
    monthlyActual.value += 12
  }, 30000)

  fluctuationTimer.value = setInterval(() => {
    mttrValue.value += Math.random() < 0.5 ? -1 : 1
    if (mttrValue.value < 24) mttrValue.value = 24
    if (mttrValue.value > 26) mttrValue.value = 26
  }, 2000)

  // 初始化 lastProcessedHour，避免立即触发一次（防止与当前整点冲突）
  lastProcessedHour = new Date().getHours()
  // 每秒检查一次整点变化
  mtbfTimer = setInterval(handleMtbfHourlyUpdate, 1000)
})

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  if (capacityTimer.value) clearInterval(capacityTimer.value)
  if (fluctuationTimer.value) clearInterval(fluctuationTimer.value)
  if (mtbfTimer) {
    clearInterval(mtbfTimer)
    mtbfTimer = null
  }
})
</script>

<style lang="scss" scoped>
.chart-container {
  height: calc(100% - 50px);
  width: 100%;
}

.card-container {
  height: 320px;
  background: linear-gradient(135deg,
      rgba(16, 33, 68, 0.9) 0%,
      rgba(9, 28, 59, 0.95) 100%);
  border: 1px solid rgba(64, 160, 255, 0.3);
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 0 20px rgba(64, 160, 255, 0.15);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
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
    background: linear-gradient(135deg,
        rgba(9, 39, 77, 0.9) 0%,
        rgba(16, 33, 68, 0.8) 100%);
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