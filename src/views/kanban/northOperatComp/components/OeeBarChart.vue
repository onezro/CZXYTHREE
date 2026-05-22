<template>
  <div ref="chartRef" class="chart"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps<{
  actual: number   // 实际 OEE
  target: number   // 目标 OEE
}>()

const chartRef = ref<HTMLElement | null>(null)
let chart: echarts.ECharts | null = null
let resizeHandler: () => void

const buildOption = () => ({
  backgroundColor: 'transparent',
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { left: '20%', right: '10%', top: 15, bottom: 15 },
  xAxis: {
    type: 'value',
    max: 100,
    axisLabel: { color: '#b0e0ff', fontSize: 18, formatter: '{value}%' },
    splitLine: { lineStyle: { color: 'rgba(0,200,255,0.15)' } }
  },
  yAxis: {
    type: 'category',
    data: ['实际', '目标'],
    axisLabel: { color: '#ffffff', fontSize: 16 }
  },
  series: [
    {
      type: 'bar',
      data: [
        {
          value: props.actual,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#ff8c00' },
              { offset: 1, color: '#ff5500' }
            ]),
            shadowBlur: 10,
            shadowColor: 'rgba(255, 140, 0, 0.6)'
          }
        },
        {
          value: props.target,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#00bfff' },
              { offset: 1, color: '#0070ff' }
            ]),
            shadowBlur: 10,
            shadowColor: 'rgba(0, 191, 255, 0.6)'
          }
        }
      ],
      barWidth: 40,
      label: {
        show: true,
        position: 'right',
        color: '#fff',
        fontSize: 18,
        formatter: '{c}%'
      }
    }
  ]
})

// const initChart = () => {
//   if (!chartRef.value) return
//   chart = echarts.init(chartRef.value)
//   chart.setOption(buildOption())
//   resizeHandler = () => chart?.resize()
//   window.addEventListener('resize', resizeHandler)
// }

watch(() => [props.actual, props.target], () => {
  if (chart) {
    chart.setOption(buildOption(), { notMerge: false })
  }
}, { deep: true })

// onMounted(initChart)
// onBeforeUnmount(() => {
//   window.removeEventListener('resize', resizeHandler)
//   chart?.dispose()
// })
let resizeObserver: ResizeObserver | null = null;

const initChart = () => {
  if (!chartRef.value) return;
  chart = echarts.init(chartRef.value);
  chart.setOption(buildOption()); // 动画正常开始

  // 延迟 200ms 后再监听尺寸变化，避开初始动画阶段
  setTimeout(() => {
    if (!chartRef.value || !chart) return;
    resizeObserver = new ResizeObserver(() => {
      chart?.resize();
    });
    resizeObserver.observe(chartRef.value);
  }, 1000);
};
onMounted(initChart)
onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  chart?.dispose();
});
</script>

<style scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>