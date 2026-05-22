<template>
  <div class="w-full h-full flex flex-col bg-[#011428]">
    <!-- 头部标题区域 -->
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
                <i class="fa fa-tasks"></i>月度产能
              </div>
              <div class="output-chart-area">
                <div ref="monthGaugeRef" class="output-gauge"></div>
                <div ref="monthBarRef" class="output-bar"></div>
              </div>
            </div>
          </el-col>

          <el-col :span="8" class="h-full">
            <div class="card-container h-full">
              <div class="card-header">
                <i class="fa fa-tasks"></i>月度目标
              </div>
              <div ref="monthTargetRef" class="chart-container"></div>
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
              <div ref="ictGaugeRef" class="chart-container"></div>
            </div>
          </el-col>
          <el-col :span="12" class="h-full">
            <div class="card-container h-full">
              <div class="card-header"><i class="fa fa-tasks"></i>FCT</div>
              <div ref="fctGaugeRef" class="chart-container"></div>
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
const monthGaugeRef = ref<HTMLElement | null>(null);
const monthBarRef = ref<HTMLElement | null>(null);
const monthTargetRef = ref<HTMLElement | null>(null);
const ictGaugeRef = ref<HTMLElement | null>(null);
const fctGaugeRef = ref<HTMLElement | null>(null);

// ---------- 图表实例 ----------
let monthGaugeChart: echarts.ECharts | null = null;
let monthBarChart: echarts.ECharts | null = null;
let monthTargetChart: echarts.ECharts | null = null;
let ictChart: echarts.ECharts | null = null;
let fctChart: echarts.ECharts | null = null;

// ---------- 通用 resize 处理 ----------
const addResizeListener = (chart: echarts.ECharts) => {
  const handler = () => chart?.resize();
  window.addEventListener("resize", handler);
  (chart as any).__resizeHandler = handler;
};

// ---------- 图表初始化函数 ----------

// 1. 月度产能仪表盘（半环形）—— 保持不变
const initMonthGauge = () => {
  if (!monthGaugeRef.value) return;
  monthGaugeChart = echarts.init(monthGaugeRef.value);
  const value = 54;
  const max = 3350;

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
          formatter: ((value / max) * 100).toFixed(2) + "%",
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

// 2. 月度产能横向柱状图—— 保持不变
const initMonthBarChart = () => {
  if (!monthBarRef.value) return;
  monthBarChart = echarts.init(monthBarRef.value);
  monthBarChart.setOption({
    backgroundColor: "transparent",
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    grid: { left: "10%", right: "10%", top: 15, bottom: 15 },
    xAxis: {
      type: "value",
      axisLabel: { color: "#b0e0ff", fontSize: 14, formatter: (v: number) => (v / 10000).toFixed(1) + "万" },
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

// 3. 月度目标柱状对比图—— 保持不变
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

// 4. 通用环形图（ICT / FCT）—— 沿用之前炫酷样式
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

const initIctChart = () => {
  if (ictGaugeRef.value) ictChart = initRingChart(ictGaugeRef.value, 99.50, "#1e90ff"); // 蓝色
};
const initFctChart = () => {
  if (fctGaugeRef.value) fctChart = initRingChart(fctGaugeRef.value, 99.26, "#00b36b"); // 绿色
};

// ---------- 生命周期 ----------
const allCharts: echarts.ECharts[] = [];

onMounted(() => {
  updateTime();
  setInterval(updateTime, 1000);

  initMonthGauge();
  initMonthBarChart();
  initMonthTargetChart();
  initIctChart();
  initFctChart();

  monthGaugeChart && allCharts.push(monthGaugeChart);
  monthBarChart && allCharts.push(monthBarChart);
  monthTargetChart && allCharts.push(monthTargetChart);
  ictChart && allCharts.push(ictChart);
  fctChart && allCharts.push(fctChart);
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