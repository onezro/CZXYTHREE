<template>
  <div class="w-full h-full flex flex-col bg-[#011428]">
    <!-- 头部标题区域 -->
    <div class="flex h-[80px] w-full relative">
      <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-4xl pt-2">
        星宇电子智能制造工厂-南区SMT生产管理看板
      </div>
      <div class="absolute bottom-[-15px] right-1 ml-auto text-white text-[24px] flex items-center pr-5">
        {{ currentTime }}
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="flex-1 mt-4 px-2">
      <div class="mb-4">
        <el-row :gutter="6">
          <!-- 今日计划（优化后） -->
          <el-col :span="5">
            <div class="card-container">
              <div class="card-header">
                <i class="fa fa-tasks"></i>今日计划
              </div>
              <div class="card-production-new">
                <div class="plan-main">
                  <span class="plan-label">计划产量</span>
                  <div class="plan-number">
                    <span class="number">{{ productionData.plannedQuantity }}</span>
                    <span class="unit">PCS</span>
                  </div>
                </div>
                <div class="line-row">
                  <div class="line-item">
                    <span class="label">计划开线</span>
                    <span class="value blue">{{ productionData.plannedLines }} 条</span>
                  </div>
                  <div class="line-item">
                    <span class="label">实际开线</span>
                    <span class="value green">{{ productionData.actualLines }} 条</span>
                  </div>
                </div>
              </div>
            </div>
          </el-col>

          <!-- 工单状态饼图（替换为组件） -->
          <el-col :span="10">
            <div class="card-container">
              <div class="card-header">
                <i class="fa fa-tasks"></i>今日白班班次计划工单数
                <span class="total-count">25单</span>
              </div>
              <div class="work-order-chart">
                <WorkOrderPieChart class="chart-container" :data="workOrderData" />
              </div>
            </div>
          </el-col>

          <!-- 产线平均一次通过率（替换为组件） -->
          <el-col :span="4">
            <div class="card-container">
              <div class="card-header">
                <i class="fa fa-tasks"></i>产线平均一次通过率
              </div>
              <div class="fpy-gauge-wrapper">
                <FpyGaugeChart class="fpy-gauge" :value="fpyRate" />
              </div>
            </div>
          </el-col>

          <!-- 出勤情况（保持不变） -->
          <el-col :span="5">
            <div class="card-container">
              <div class="card-header">
                <i class="fa fa-tasks"></i>出勤情况
              </div>
              <div class="card-attendance">
                <div class="att-grid">
                  <div class="att-item">
                    <span class="att-label">应到</span>
                    <span class="att-number white">{{ attendance.shouldArrive }}</span>
                  </div>
                  <div class="att-item">
                    <span class="att-label">实到</span>
                    <span class="att-number green">{{ attendance.actualArrive }}</span>
                  </div>
                  <div class="att-item">
                    <span class="att-label">请假</span>
                    <span class="att-number yellow">{{ attendance.leave }}</span>
                  </div>
                  <div class="att-item">
                    <span class="att-label">新员工</span>
                    <span class="att-number cyan">{{ attendance.newEmployee }}</span>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 生产数据表格 -->
      <div class="card-container table-card">
        <div class="card-header">
          <i class="fa fa-tasks"></i>生产数据实时监控
        </div>
        <dv-scroll-board :config="configLine" ref="scrollboardRef" style="height: 600px" class="scroll-board" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import WorkOrderPieChart from './components/WorkOrderPieChart.vue'
import FpyGaugeChart from './components/FpyGaugeChart.vue'

const currentTime = ref("");
const refreshCountdown = ref(60);

const productionData = reactive({
  plannedQuantity: 16800,
  plannedLines: 14,
  actualLines: 14,
});

const attendance = reactive({
  shouldArrive: 27,
  actualArrive: 27,
  leave: 0,
  newEmployee: 0,
});

// 工单饼图数据
const workOrderData = ref([
  { value: 13, name: '未开工' },
  { value: 10, name: '进行中' },
  { value: 2, name: '已完成' }
])

const fpyRate = ref(99.94)
const scrollboardRef = ref()

// 表格配置
const configLine = ref<{
  header: string[];
  data: string[][];
  headerBGC: string;
  align: string[];
  columnWidth: number[];
  rowNum: number;
  carousel: string;
}>({
  header: [],
  data: [],
  headerBGC: "rgba(16, 33, 68, 0.9)",
  columnWidth: [210, 260, 310, 230, 260, 270, 270, 270],
  align: Array(8).fill("center"),
  rowNum: 14,
  carousel: "page",
});

// 初始原始数据（不可变）
const INITIAL_RAW_DATA = [
  { line: "SMT-15", target: 1200, actual: 100, uph: 120, fpy: "99.94%", spi: "99.96%", aoi: "99.93%", rate: "8.33%" },
  { line: "SMT-16", target: 1300, actual: 120, uph: 130, fpy: "99.92%", spi: "99.95%", aoi: "99.97%", rate: "9.23%" },
  { line: "SMT-17", target: 1125, actual: 85, uph: 102, fpy: "99.98%", spi: "99.91%", aoi: "99.94%", rate: "7.56%" },
  { line: "SMT-18", target: 1200, actual: 100, uph: 100, fpy: "99.96%", spi: "99.93%", aoi: "99.95%", rate: "8.33%" },
  { line: "SMT-19", target: 900, actual: 75, uph: 78, fpy: "99.91%", spi: "99.97%", aoi: "99.92%", rate: "8.33%" },
  { line: "SMT-20", target: 1100, actual: 92, uph: 95, fpy: "99.95%", spi: "99.94%", aoi: "99.98%", rate: "8.36%" },
  { line: "SMT-21", target: 1200, actual: 96, uph: 98, fpy: "99.93%", spi: "99.92%", aoi: "99.96%", rate: "8.00%" },
  { line: "SMT-22", target: 1400, actual: 115, uph: 118, fpy: "99.97%", spi: "99.95%", aoi: "99.91%", rate: "8.21%" },
  { line: "SMT-23", target: 1400, actual: 116, uph: 118, fpy: "99.94%", spi: "99.98%", aoi: "99.93%", rate: "8.29%" },
  { line: "SMT-24", target: 1350, actual: 112, uph: 115, fpy: "99.96%", spi: "99.91%", aoi: "99.97%", rate: "8.30%" },
  { line: "SMT-25", target: 1200, actual: 98, uph: 100, fpy: "99.92%", spi: "99.93%", aoi: "99.94%", rate: "8.17%" },
  { line: "SMT-26", target: 1600, actual: 130, uph: 132, fpy: "99.98%", spi: "99.96%", aoi: "99.95%", rate: "8.13%" },
  { line: "SMT-27", target: 1420, actual: 118, uph: 120, fpy: "99.91%", spi: "99.94%", aoi: "99.92%", rate: "8.31%" },
  { line: "SMT-28", target: 1280, actual: 105, uph: 110, fpy: "99.95%", spi: "99.97%", aoi: "99.98%", rate: "8.20%" },
];

// 当前显示的数据（会被定时更新和重置）
const rawData = ref(INITIAL_RAW_DATA.map(item => ({ ...item })));

// 记录上次重置的日期，防止同一天多次重置
const lastResetDate = ref('');

let dataRefreshInterval: ReturnType<typeof setInterval> | null = null;
let countdownInterval: ReturnType<typeof setInterval> | null = null;
let productionUpdateInterval: ReturnType<typeof setInterval> | null = null;

// 时间更新
const updateTime = () => {
  const now = new Date();
  const weekDays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const w = weekDays[now.getDay()];
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  currentTime.value = `${y}-${m}-${d} ${w} ${hh}:${mm}:${ss}`;
};

// 更新表格数据（同步到滚动板）
const updateTableData = () => {
  configLine.value.data = rawData.value.map((item) => [
    `<div style="font-size:22px;color:#fff;">${item.line}</div>`,
    `<div style="font-size:22px;color:#fff;">${item.target}</div>`,
    `<div style="font-size:22px;color:#fff;">${item.actual}</div>`,
    `<div style="font-size:22px;color:#fff;">${item.uph}</div>`,
    `<div style="font-size:22px;color:#fff;">${item.fpy}</div>`,
    `<div style="font-size:22px;color:#fff;">${item.spi}</div>`,
    `<div style="font-size:22px;color:#fff;">${item.aoi}</div>`,
    `<div style="font-size:22px;color:#fff;">${item.rate}</div>`,
  ]);
  if (scrollboardRef.value) {
    scrollboardRef.value.updateRows(rawData.value);
  }
};

// 每分钟更新实际产能（含7点重置逻辑，精确补差）
const updateProductionData = () => {
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  // 每天7点后第一次触发时重置数据
  if (now.getHours() >= 7 && lastResetDate.value !== today) {
    // 还原为初始数据（深拷贝）
    rawData.value = INITIAL_RAW_DATA.map(item => ({ ...item }));
    lastResetDate.value = today;

    // 计算从7:00到现在过去了多少分钟，并补齐产能
    // const minutesSince7 = (now.getHours() - 7) * 60 + now.getMinutes();
    // for (let i = 0; i < minutesSince7; i++) {
    //   rawData.value.forEach(item => {
    //     const increment = Math.floor(item.target / 12 / 60);
    //     item.actual += increment;
    //   });
    // }
    // // 重新计算达成率
    // rawData.value.forEach(item => {
    //   item.rate = ((item.actual / item.target) * 100).toFixed(2) + '%';
    // });
    updateTableData();
    return; // 已经补足所有分钟数，不再进行单次累加
  }

  // 正常情况：每分钟累加一次产能
  rawData.value.forEach((item) => {
    const increment = Math.floor(item.target / 12 / 60);
    item.actual += increment;
    item.rate = ((item.actual / item.target) * 100).toFixed(2) + '%';
  });
  updateTableData();
};

// 其他数据获取（预留）
const getData = () => { };

const setDataRefreshInterval = () => {
  if (dataRefreshInterval) clearInterval(dataRefreshInterval);
  dataRefreshInterval = setInterval(getData, 60000);
};

onMounted(() => {
  // 初始化表头
  configLine.value.header = [
    '<div style="font-size:25px;color:#8ac6ff;">线体</div>',
    '<div style="font-size:25px;color:#8ac6ff;">当日目标产能</div>',
    '<div style="font-size:25px;color:#8ac6ff;">工单累计产能</div>',
    '<div style="font-size:25px;color:#8ac6ff;">UPH</div>',
    '<div style="font-size:25px;color:#8ac6ff;">FPY</div>',
    '<div style="font-size:25px;color:#8ac6ff;">SPI直通率</div>',
    '<div style="font-size:25px;color:#8ac6ff;">AOI直通率</div>',
    '<div style="font-size:25px;color:#8ac6ff;">产能达成率</div>',
  ];

  // 初始化表格数据
  updateTableData();
  // 时间每秒更新
  updateTime();
  setInterval(updateTime, 1000);

  // 数据刷新
  getData();
  setDataRefreshInterval();

  // 每分钟更新产能（包含7点重置）
  productionUpdateInterval = setInterval(updateProductionData, 60000);

  // 倒计时（可自行扩展）
  countdownInterval = setInterval(() => {
    refreshCountdown.value = refreshCountdown.value <= 0 ? 60 : refreshCountdown.value - 1;
  }, 1000);
});

onBeforeUnmount(() => {
  if (dataRefreshInterval) clearInterval(dataRefreshInterval);
  if (countdownInterval) clearInterval(countdownInterval);
  if (productionUpdateInterval) clearInterval(productionUpdateInterval);
});
</script>

<style lang="scss" scoped>
// 原有样式保留...
.card-container {
  height: 320px;
  background: linear-gradient(135deg, rgba(16, 33, 68, 0.9) 0%, rgba(9, 28, 59, 0.95) 100%);
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

  &.table-card {
    height: 680px;
    margin-top: 6px;
  }
}

.card-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(64, 160, 255, 0.3);
  font-size: 22px;
  font-weight: bold;
  color: #8ac6ff;

  i { margin-right: 8px; color: #40a9ff; }

  .total-count {
    font-size: 20px;
    color: #ffffff;
    background: rgba(64, 169, 255, 0.1);
    padding: 4px 12px;
    border-radius: 12px;
    border: 1px solid rgba(64, 169, 255, 0.2);
  }
}

/* ---------- 今日计划新布局 ---------- */
.card-production-new {
  height: calc(100% - 60px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .plan-main {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 16px;
    background: linear-gradient(135deg, rgba(9, 39, 77, 0.9) 0%, rgba(16, 33, 68, 0.8) 100%);
    border-radius: 8px;
    padding: 12px 42px;
    border: 1px solid rgba(64, 147, 255, 0.3);
    box-shadow: 0 0 15px rgba(64, 160, 255, 0.1);

    .plan-label {
      font-size: 16px;
      color: #8ac6ff;
      margin-bottom: 4px;
    }

    .plan-number {
      display: flex;
      align-items: baseline;
      .number {
        font-size: 42px;
        font-weight: 900;
        background: linear-gradient(180deg, #ffffff 0%, #b0d4ff 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-shadow: 0 0 18px rgba(64, 160, 255, 0.5);
      }
      .unit {
        font-size: 18px;
        color: #8ac6ff;
        margin-left: 6px;
        font-weight: 600;
      }
    }
  }

  .line-row {
    display: flex;
    justify-content: center;
    gap: 16px;

    .line-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: linear-gradient(135deg, rgba(9, 39, 77, 0.9) 0%, rgba(16, 33, 68, 0.8) 100%);
      border-radius: 8px;
      padding: 8px 20px;
      border: 1px solid rgba(64, 147, 255, 0.3);

      .label { font-size: 18px; color: #8ac6ff; margin-bottom: 4px; }
      .value { font-size: 30px; font-weight: 700; }
      .blue { color: #40a9ff; text-shadow: 0 0 10px rgba(64, 169, 255, 0.4); }
      .green { color: #52c41a; text-shadow: 0 0 10px rgba(82, 196, 26, 0.4); }
    }
  }
}

/* ---------- 仪表盘容器（新FPY） ---------- */
.fpy-gauge-wrapper {
  height: calc(100% - 60px);
  display: flex;
  align-items: center;
  justify-content: center;

  .fpy-gauge {
    width: 100%;
    height: 100%;
  }
}

/* 工单图表样式保持不变 */
.work-order-chart {
  height: calc(100% - 60px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  .chart-container { flex: 1; height: 100%; }
}

/* 出勤情况保持不变 */
.card-attendance {
  height: calc(100% - 60px);
  display: flex;
  align-items: center;
  justify-content: center;
  .att-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    width: 100%;
    .att-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: linear-gradient(135deg, rgba(16, 33, 68, 0.9) 0%, rgba(9, 39, 77, 0.8) 100%);
      border: 1px solid rgba(64, 160, 255, 0.25);
      border-radius: 8px;
      padding: 10px 4px;
      .att-label { font-size: 20px; color: #8ac6ff; margin-bottom: 6px; }
      .att-number { font-size: 36px; font-weight: 800; line-height: 1.1; }
      .white { color: #ffffff; }
      .green { color: #52c41a; text-shadow: 0 0 10px rgba(82, 196, 26, 0.4); }
      .yellow { color: #faad14; text-shadow: 0 0 10px rgba(250, 173, 20, 0.4); }
      .cyan { color: #13c2c2; text-shadow: 0 0 10px rgba(19, 194, 194, 0.4); }
    }
  }
}

/* 滚动表格 */
.scroll-board {
  --dv-scroll-board-header-font-color: #8ac6ff;
  --dv-scroll-board-header-bg-color: rgba(16, 33, 68, 0.8);
  --dv-scroll-board-even-row-bg-color: rgba(9, 39, 77, 0.4);
  --dv-scroll-board-odd-row-bg-color: rgba(16, 33, 68, 0.6);
  --dv-scroll-board-row-hover-bg-color: rgba(64, 160, 255, 0.2);

  ::v-deep .dv-scroll-board { border: none !important; }
  ::v-deep .dv-scroll-board-header { border-bottom: 1px solid rgba(64, 160, 255, 0.3) !important; }
  ::v-deep .dv-scroll-board-cell { border-right: 1px solid rgba(64, 160, 255, 0.1) !important; }
}

@media screen and (max-width: 1920px) {
  .card-header { font-size: 20px; }
  .main-number .number { font-size: 48px; }
  .att-number, .line-item .value { font-size: 32px; }
}
</style>