<template>
  <div ref="chartRef" class="chart"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps<{
  months: string[]
  targetValue: number
  actualData: number[]
}>()

const chartRef = ref<HTMLElement | null>(null)
let chart: echarts.ECharts | null = null
let resizeObserver: ResizeObserver | null = null

const buildOption = () => ({
  backgroundColor: 'transparent',
  tooltip: { trigger: 'axis' },
  legend: {
    data: ['目标', '实际'],
    textStyle: { color: '#8ac6ff', fontSize: 14 },
    top: 0
  },
  grid: { left: '5%', right: '5%', top: '20%', bottom: 20 },
  xAxis: {
    type: 'category',
    data: props.months,
    axisLabel: { color: '#fff', fontSize: 14 },
    axisLine: { lineStyle: { color: 'rgba(64,160,255,0.3)' } }
  },
  yAxis: {
    type: 'value',
    name: 'PPM',
    nameTextStyle: { color: '#8ac6ff', fontSize: 12 },
    axisLabel: { color: '#fff', fontSize: 14 },
    splitLine: { lineStyle: { color: 'rgba(0,200,255,0.15)' } }
  },
  series: [
    {
      name: '目标',
      type: 'bar',
      data: props.months.map(() => props.targetValue),
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#00c8ff' },
          { offset: 1, color: '#0080ff' }
        ]),
        shadowBlur: 10,
        shadowColor: 'rgba(0,230,118,0.5)'
      },
      barWidth: 30,
      label: { show: true, position: 'top', color: '#fff', fontSize: 16 }
    },
    {
      name: '实际',
      type: 'bar',
      data: props.actualData,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
         { offset: 0, color: '#00ff88' },
          { offset: 1, color: '#009944' }// 深琥珀
        ]),
        shadowBlur: 10,
        shadowColor: 'rgba(255,179,0,0.5)'
      },
      barWidth: 30,
      label: { show: true, position: 'top', color: '#fff', fontSize: 16 }
    }
  ]
})

const initChart = () => {
  if (!chartRef.value) return
  chart = echarts.init(chartRef.value)
  chart.setOption(buildOption())

  setTimeout(() => {
    if (!chartRef.value || !chart) return
    resizeObserver = new ResizeObserver(() => chart?.resize())
    resizeObserver.observe(chartRef.value)
  }, 1000)
}

watch(
  () => [props.months, props.targetValue, props.actualData],
  () => {
    chart?.setOption(buildOption(), { notMerge: false })
  },
  { deep: true }
)

onMounted(initChart)
onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  chart?.dispose()
})
</script>

<style scoped>
.chart { width: 100%; height: 100%; }
</style>