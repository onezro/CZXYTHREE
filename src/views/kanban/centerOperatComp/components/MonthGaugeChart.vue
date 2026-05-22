<template>
  <div ref="chartRef" class="chart"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps<{
  value: number   // 实际产能（万）
  max: number     // 当日目标产能（万）
}>()

const chartRef = ref<HTMLElement | null>(null)
let chart: echarts.ECharts | null = null
let resizeObserver: ResizeObserver | null = null

const buildOption = () => ({
  backgroundColor: 'transparent',
  series: [{
    type: 'gauge',
    startAngle: 225,
    endAngle: -45,
    center: ['50%', '60%'],
    radius: '85%',
    min: 0,
    max: props.max,
    splitNumber: 0,
    axisLine: {
      lineStyle: {
        width: 25,
        color: [
          [props.value / props.max, '#00ff88'],
          [1, 'rgba(255,255,255,0.15)']
        ]
      }
    },
    pointer: { length: '60%', width: 6, itemStyle: { color: '#00ffcc' } },
    axisTick: { show: false },
    axisLabel: { show: false },
    detail: {
      formatter: () => ((props.value / props.max) * 100).toFixed(2) + '%',
      fontSize: 22,
      fontWeight: 'bold',
      color: '#f5a623',
      offsetCenter: [0, '55%']
    },
    data: [{ value: props.value }]
  }]
})

const initChart = () => {
  if (!chartRef.value) return
  chart = echarts.init(chartRef.value)
  chart.setOption(buildOption()) // 首次渲染带动画

  setTimeout(() => {
    if (!chartRef.value || !chart) return
    resizeObserver = new ResizeObserver(() => chart?.resize())
    resizeObserver.observe(chartRef.value)
  }, 1000)
}

watch(() => [props.value, props.max], () => {
  if (chart) chart.setOption(buildOption(), { notMerge: false })
}, { deep: true })

onMounted(initChart)
onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  chart?.dispose()
})
</script>

<style scoped>
.chart { width: 100%; height: 100%; }
</style>