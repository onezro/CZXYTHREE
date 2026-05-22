<template>
  <div class="w-full h-full flex flex-col bg-[#011428]">
    <!-- 头部标题区域 -->
    <div class="flex h-[80px] w-full relative">
      <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-4xl pt-2">
        星宇电子智能制造工厂-南区SMT运营管理看板
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
            <div class="card-container" style="height: 330px;">
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
            <div class="card-container" style="height: 330px;">
              <div class="card-header">
                <i class="fa fa-tasks"></i>月度产能
              </div>
              <div class="output-chart-area">
                <div ref="monthGaugeRef" class="output-gauge"></div>
                <div ref="monthBarRef" class="output-bar"></div>
              </div>
            </div>
          </el-col>

          <!-- 月度目标（柱状对比图） -->
          <el-col :span="8">
            <div class="card-container" style="height: 330px;">
              <div class="card-header">
                <i class="fa fa-tasks"></i>月度目标
              </div>
              <div ref="monthTargetRef" class="chart-container"></div>
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
              <div ref="fpyGaugeRef" class="chart-container"></div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="card-container">
              <div class="card-header"><i class="fa fa-tasks"></i>SPI</div>
              <div ref="spiGaugeRef" class="chart-container"></div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="card-container">
              <div class="card-header"><i class="fa fa-tasks"></i>AOI</div>
              <div ref="aoiGaugeRef" class="chart-container"></div>
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
              <div ref="oeeBarRef" class="chart-container"></div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="card-container">
              <div class="card-header"><i class="fa fa-tasks"></i>MBTF</div>
              <div ref="mbtfBarRef" class="chart-container"></div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="card-container">
              <div class="card-header"><i class="fa fa-tasks"></i>MTTR</div>
              <div ref="mttrBarRef" class="chart-container"></div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as echarts from "echarts";

// ---------- 时间 ----------
const currentTime = ref("");
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

// ---------- 安全生产天数 ----------
const safeDays = ref(104);

// ---------- 图表容器 ref ----------
const monthGaugeRef = ref<HTMLElement | null>(null); // 月度产能仪表盘
const monthBarRef = ref<HTMLElement | null>(null);   // 月度产能柱状图
const monthTargetRef = ref<HTMLElement | null>(null);
const fpyGaugeRef = ref<HTMLElement | null>(null);
const spiGaugeRef = ref<HTMLElement | null>(null);
const aoiGaugeRef = ref<HTMLElement | null>(null);
const oeeBarRef = ref<HTMLElement | null>(null);
const mbtfBarRef = ref<HTMLElement | null>(null);
const mttrBarRef = ref<HTMLElement | null>(null);

// ---------- 图表实例 ----------
let monthGaugeChart: echarts.ECharts | null = null;
let monthBarChart: echarts.ECharts | null = null;
let monthTargetChart: echarts.ECharts | null = null;
let fpyChart: echarts.ECharts | null = null;
let spiChart: echarts.ECharts | null = null;
let aoiChart: echarts.ECharts | null = null;
let oeeChart: echarts.ECharts | null = null;
let mbtfChart: echarts.ECharts | null = null;
let mttrChart: echarts.ECharts | null = null;

// ---------- 工具：通用 resize 处理 ----------
const addResizeListener = (chart: echarts.ECharts) => {
  const handler = () => chart?.resize();
  window.addEventListener("resize", handler);
  (chart as any).__resizeHandler = handler;
};

// ---------- 图表初始化函数 ----------

// 1. 月度产能仪表盘（左侧半环形）—— 数据：实际54万，目标3350万
const initMonthGauge = () => {
  if (!monthGaugeRef.value) return;
  monthGaugeChart = echarts.init(monthGaugeRef.value);
  const value = 54;   // 实际产能 54万
  const max = 3350;    // 目标3350万

  monthGaugeChart.setOption({
    backgroundColor: "transparent",
    series: [
      {
        type: "gauge",
        startAngle: 225,
        endAngle: -45,
        center: ["50%", "60%"],
        radius: "85%",
        min: 0,
        max: max,
        splitNumber: 0,
        axisLine: {
          lineStyle: {
            width: 25,
            color: [
              [value / max, "#00ff88"],
              [1, "rgba(255,255,255,0.15)"],
            ],
          },
        },
        pointer: {
          length: "60%",
          width: 6,
          itemStyle: { color: "#00ffcc" },
        },
        axisTick: { show: false },
        axisLabel: { show: false },
        detail: {
          formatter: (value / max * 100).toFixed(2) + "%",
          fontSize: 22,
          fontWeight: "bold",
          color: "#f5a623",
          offsetCenter: [0, "55%"],
        },
        data: [{ value: value }],
      },
    ],
  });
  addResizeListener(monthGaugeChart);
};

// 2. 月度产能横向柱状图（右侧）—— 实际 vs 目标
const initMonthBarChart = () => {
  if (!monthBarRef.value) return;
  monthBarChart = echarts.init(monthBarRef.value);
  monthBarChart.setOption({
    backgroundColor: "transparent",
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    grid: { left: "10%", right: "10%", top: 15, bottom: 15 },
    xAxis: {
      type: "value",
      axisLabel: { color: "#b0e0ff", fontSize: 14 },
      splitLine: { lineStyle: { color: "rgba(0,200,255,0.15)" } },
    },
    yAxis: {
      type: "category",
      data: ["实际", "目标"],
      axisLabel: { color: "#fff", fontSize: 18 },
    },
    series: [
      {
        type: "bar",
        data: [
          {
            value: 54,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: "#00ff88" },
                { offset: 1, color: "#00cc66" }
              ]),
              shadowBlur: 10,
              shadowColor: "rgba(0, 255, 136, 0.6)"
            }
          },
          {
            value: 3350,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: "#00c8ff" },
                { offset: 1, color: "#0080ff" }
              ]),
              shadowBlur: 10,
              shadowColor: "rgba(0, 200, 255, 0.6)"
            }
          }
        ],
        barWidth: 50,
        label: {
          show: true,
          position: "right",
          color: "#fff",
          fontSize: 18,
          formatter: "{c}万",
        },
      }
    ],
  });
  addResizeListener(monthBarChart);
};

// 3. 月度目标柱状对比图（1-4月，含达成率）—— 保持不变
const initMonthTargetChart = () => {
  if (!monthTargetRef.value) return;
  monthTargetChart = echarts.init(monthTargetRef.value);
  const months = ["1月", "2月", "3月", "4月"];
  const targetData = [89.16, 96.0, 96.0, 110.0];
  const actualData = [89.16, 96.0, 96.0, 110.0];
  const rateData = [100, 100, 100, 100];

  monthTargetChart.setOption({
    backgroundColor: "transparent",
    tooltip: { trigger: "axis" },
    legend: {
      data: ["目标", "实际", "达成率"],
      textStyle: { color: "#ffffff", fontSize: 14 },
      top: 0,
    },
    grid: { left: "5%", right: "5%", top: "20%", bottom: "5%", containLabel: true },
    xAxis: {
      type: "category",
      data: months,
      axisLabel: { color: "#fff", fontSize: 14 },
      axisLine: { lineStyle: { color: "rgba(0,200,255,0.4)" } },
    },
    yAxis: [
      {
        type: "value",
        name: "万",
        nameTextStyle: { color: "#b0e0ff" },
        axisLabel: { color: "#b0e0ff" },
        splitLine: { lineStyle: { color: "rgba(0,200,255,0.1)" } },
      },
      {
        type: "value",
        name: "%",
        min: 0,
        max: 100,
        nameTextStyle: { color: "#b0e0ff" },
        axisLabel: { color: "#b0e0ff" },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: "目标",
        type: "bar",
        data: targetData,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#00c8ff" },
            { offset: 1, color: "#0050d0" }
          ]),
          shadowBlur: 4,
          shadowColor: "rgba(0, 200, 255, 0.5)"
        },
        barWidth: 30,
        label: { show: true, position: "top", color: "#fff", fontSize: 12 },
      },
      {
        name: "实际",
        type: "bar",
        data: actualData,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#00ff88" },
            { offset: 1, color: "#009944" }
          ]),
          shadowBlur: 4,
          shadowColor: "rgba(0, 255, 136, 0.5)"
        },
        barWidth: 30,
        label: { show: true, position: "top", color: "#fff", fontSize: 12 },
      },
      {
        name: "达成率",
        type: "line",
        yAxisIndex: 1,
        data: rateData,
        lineStyle: { color: "#ffaa00", width: 2, shadowBlur: 8, shadowColor: "rgba(255,170,0,0.6)" },
        itemStyle: { color: "#ffaa00" },
        symbol: "circle",
        symbolSize: 8,
        label: { show: true, formatter: "{c}%", color: "#ffaa00", fontSize: 12 },
      },
    ],
  });
  addResizeListener(monthTargetChart);
};

// 4. 通用环形图（FPY / SPI / AOI）
const initRingChart = (
  refElem: HTMLElement,
  value: number,
  color: string
): echarts.ECharts => {
  const chart = echarts.init(refElem);
  const option = {
    backgroundColor: "transparent",
    series: [
      {
        type: "pie",
        radius: ["48%", "76%"],
        center: ["50%", "48%"],
        hoverAnimation: false,
        label: { show: false },
        emphasis: { scale: false },
        data: [
          { value: value, name: "完成" },
          { value: 100 - value, name: "剩余" },
        ],
        itemStyle: {
          borderRadius: 5,
          borderColor: "transparent",
          borderWidth: 2,
          shadowBlur: 15,
          shadowColor: color,
        },
        color: [color, "rgba(255,255,255,0.08)"],
      },
    ],
    graphic: [
      {
        type: "text",
        left: "center",
        top: "45%",
        style: {
          text: value.toFixed(2) + "%",
          textAlign: "center",
          fill: color,
          fontSize: 24,
          fontWeight: "bold",
          textShadow: `0 0 20px ${color}`,
        },
      },
    ],
  };
  chart.setOption(option);
  addResizeListener(chart);
  return chart;
};

const initFpyChart = () => {
  if (fpyGaugeRef.value) fpyChart = initRingChart(fpyGaugeRef.value, 96.77, "#1e90ff"); // 亮蓝
};
const initSpiChart = () => {
  if (spiGaugeRef.value) spiChart = initRingChart(spiGaugeRef.value, 99.45, "#00b36b"); // 亮绿
};
const initAoiChart = () => {
  if (aoiGaugeRef.value) aoiChart = initRingChart(aoiGaugeRef.value, 97.31, "#e06520"); // 亮橙
};

// 5. OEE 横向柱状图
const initOeeBarChart = () => {
  if (!oeeBarRef.value) return;
  oeeChart = echarts.init(oeeBarRef.value);
  oeeChart.setOption({
    backgroundColor: "transparent",
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    grid: { left: "20%", right: "10%", top: 15, bottom: 15 },
    xAxis: {
      type: "value",
      max: 100,
      axisLabel: { color: "#b0e0ff", fontSize: 18, formatter: "{value}%" },
      splitLine: { lineStyle: { color: "rgba(0,200,255,0.15)" } },
    },
    yAxis: {
      type: "category",
      data: ["实际", "目标"],
      axisLabel: { color: "#ffffff", fontSize: 16 },
    },
    series: [
      {
        type: "bar",
        data: [
          {
            value: 84,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: "#ff8c00" },
                { offset: 1, color: "#ff5500" }
              ]),
              shadowBlur: 10,
              shadowColor: "rgba(255, 140, 0, 0.6)"
            }
          },
          {
            value: 85,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: "#00bfff" },
                { offset: 1, color: "#0070ff" }
              ]),
              shadowBlur: 10,
              shadowColor: "rgba(0, 191, 255, 0.6)"
            }
          }
        ],
        barWidth: 40,
        label: { show: true, position: "right", color: "#fff", fontSize: 18, formatter: "{c}%" },
      }
    ],
  });
  addResizeListener(oeeChart);
};

// 6. MBTF 仪表盘
const initMbtfGauge = () => {
  if (!mbtfBarRef.value) return;
  mbtfChart = echarts.init(mbtfBarRef.value);
  mbtfChart.setOption({
    backgroundColor: "transparent",
    series: [
      {
        type: "gauge",
        startAngle: 225,
        endAngle: -45,
        center: ["50%", "60%"],
        radius: "85%",
        min: 0,
        max: 1440,
        splitNumber: 10,
        axisLine: {
          lineStyle: {
            width: 25,
            color: [
              [720 / 1440, "#00e5ff"],
              [1, "rgba(255,255,255,0.15)"],
            ],
          },
        },
        pointer: {
          length: "60%",
          width: 6,
          itemStyle: { color: "#00e5ff", shadowBlur: 10, shadowColor: "rgba(0,229,255,0.7)" },
        },
        axisTick: { show: false },
        axisLabel: { show: false },
        detail: {
          formatter: `{target|目标1440h}\n{value|实际 {value}h}`,
          rich: {
            target: { fontSize: 14, color: "#b0e0ff", align: "center" },
            value: { fontSize: 22, fontWeight: "bold", color: "#00e5ff", align: "center" },
          },
          offsetCenter: [0, "55%"],
        },
        data: [{ value: 720 }],
      },
    ],
  });
  addResizeListener(mbtfChart);
};

// 7. MTTR 仪表盘
const initMttrGauge = () => {
  if (!mttrBarRef.value) return;
  mttrChart = echarts.init(mttrBarRef.value);
  mttrChart.setOption({
    backgroundColor: "transparent",
    series: [
      {
        type: "gauge",
        startAngle: 225,
        endAngle: -45,
        center: ["50%", "60%"],
        radius: "85%",
        min: 0,
        max: 30,
        splitNumber: 10,
        axisLine: {
          lineStyle: {
            width: 25,
            color: [
              [25 / 30, "#ff2d95"],
              [1, "rgba(255,255,255,0.15)"],
            ],
          },
        },
        pointer: {
          length: "60%",
          width: 6,
          itemStyle: { color: "#ff2d95", shadowBlur: 10, shadowColor: "rgba(255,45,149,0.7)" },
        },
        axisTick: { show: false },
        axisLabel: { show: false },
        detail: {
          formatter: `{target|目标30min}\n{value|实际 {value}min}`,
          rich: {
            target: { fontSize: 14, color: "#b0e0ff", align: "center" },
            value: { fontSize: 22, fontWeight: "bold", color: "#ff2d95", align: "center" },
          },
          offsetCenter: [0, "55%"],
        },
        data: [{ value: 25 }],
      },
    ],
  });
  addResizeListener(mttrChart);
};

// ---------- 生命周期 ----------
const allCharts: echarts.ECharts[] = [];

onMounted(() => {
  updateTime();
  setInterval(updateTime, 1000);

  initMonthGauge();          // 月度产能仪表盘（左）
  initMonthBarChart();       // 月度产能柱状图（右）
  initMonthTargetChart();
  initFpyChart();
  initSpiChart();
  initAoiChart();
  initOeeBarChart();
  initMbtfGauge();
  initMttrGauge();

  monthGaugeChart && allCharts.push(monthGaugeChart);
  monthBarChart && allCharts.push(monthBarChart);
  monthTargetChart && allCharts.push(monthTargetChart);
  fpyChart && allCharts.push(fpyChart);
  spiChart && allCharts.push(spiChart);
  aoiChart && allCharts.push(aoiChart);
  oeeChart && allCharts.push(oeeChart);
  mbtfChart && allCharts.push(mbtfChart);
  mttrChart && allCharts.push(mttrChart);
});

onBeforeUnmount(() => {
  allCharts.forEach((chart) => {
    const handler = (chart as any).__resizeHandler;
    if (handler) window.removeEventListener("resize", handler);
    chart.dispose();
  });
});
</script>

<style lang="scss" scoped>
.chart-container {
  height: calc(100% - 50px);
  width: 100%;
}

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