<template>
  <div ref="chartRef" class="chart"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps<{
  months: string[]
  targetData: number[]
  actualData: number[]
  rateData: number[]
}>()

const chartRef = ref<HTMLElement | null>(null)
let chart: echarts.ECharts | null = null
let resizeObserver: ResizeObserver | null = null

const buildOption = () => ({
  backgroundColor: 'transparent',
  tooltip: { trigger: 'axis' },
  legend: {
    data: ['目标', '实际', '达成率'],
    textStyle: { color: '#ffffff', fontSize: 14 },
    top: 0
  },
  grid: { left: '5%', right: '5%', top: '20%', bottom: '5%', containLabel: true },
  xAxis: {
    type: 'category',
    data: props.months,
    axisLabel: { color: '#fff', fontSize: 14 },
    axisLine: { lineStyle: { color: 'rgba(0,200,255,0.4)' } }
  },
  yAxis: [
    {
      type: 'value',
      name: '万',
      nameTextStyle: { color: '#b0e0ff' },
      axisLabel: { color: '#b0e0ff' },
      splitLine: { lineStyle: { color: 'rgba(0,200,255,0.1)' } }
    },
    {
      type: 'value',
      name: '%',
      min: 0,
      max: 100,
      nameTextStyle: { color: '#b0e0ff' },
      axisLabel: { color: '#b0e0ff' },
      splitLine: { show: false }
    }
  ],
  series: [
    {
      name: '目标',
      type: 'bar',
      data: props.targetData,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#00c8ff' }, { offset: 1, color: '#0050d0' }
        ]),
        shadowBlur: 4, shadowColor: 'rgba(0, 200, 255, 0.5)'
      },
      barWidth: 30,
      label: { show: true, position: 'top', color: '#fff', fontSize: 12 }
    },
    {
      name: '实际',
      type: 'bar',
      data: props.actualData,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#00ff88' }, { offset: 1, color: '#009944' }
        ]),
        shadowBlur: 4, shadowColor: 'rgba(0, 255, 136, 0.5)'
      },
      barWidth: 30,
      label: { show: true, position: 'top', color: '#fff', fontSize: 12 }
    },
    {
      name: '达成率',
      type: 'line',
      yAxisIndex: 1,
      data: props.rateData,
      lineStyle: { color: '#ffaa00', width: 2, shadowBlur: 8, shadowColor: 'rgba(255,170,0,0.6)' },
      itemStyle: { color: '#ffaa00' },
      symbol: 'circle',
      symbolSize: 8,
      label: { show: true, formatter: '{c}%', color: '#ffaa00', fontSize: 12 }
    }
  ]
})

const initChart = () => {
  if (!chartRef.value) return
  chart = echarts.init(chartRef.value)
  chart.setOption(buildOption())
  setTimeout(() => {
    if (chartRef.value && chart) {
      resizeObserver = new ResizeObserver(() => chart?.resize())
      resizeObserver.observe(chartRef.value)
    }
  }, 1000)
}

watch(() => [props.months, props.targetData, props.actualData, props.rateData], () => {
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