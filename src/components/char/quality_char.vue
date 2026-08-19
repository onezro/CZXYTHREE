<template>
  <div ref="chartRef" style="width: 100%; height: 100%"></div>
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import * as echarts from "echarts";
const props = defineProps<{ echarData: any[] }>();
const chartRef = ref<HTMLElement | null>(null);
let chart: echarts.ECharts | null = null;
const buildOption = () => ({
  tooltip: { trigger: "axis" },
  legend: { type: "scroll", bottom: 0 },
  grid: { left: "3%", right: "4%", bottom: "10%", containLabel: true },
  xAxis: {
    type: "category",
    data: ["Laser-Bot", "DEK-Bot", "NPM-Bot", "AOI-1-Bot", "Reflow-Bot", "AOI-2-Bot", "ICT-Bot", "Laser-Top", "SPI-Top", "SPI-Top", "NPM-Top", "AOI-1-Top", "Reflow-Top", "AOI-2-Top", "ICT-Top"],
  },
  yAxis: { type: "value" },
  series: props.echarData,
});
const initChart = () => {
  if (chartRef.value) {
    chart = echarts.init(chartRef.value);
    chart.setOption(buildOption());
  }
};
const resize = () => chart?.resize();
watch(() => props.echarData, () => { chart?.setOption(buildOption()); }, { deep: true });
onMounted(() => { initChart(); window.addEventListener("resize", resize); });
onBeforeUnmount(() => { window.removeEventListener("resize", resize); chart?.dispose(); });
</script>
