<template>
  <div ref="chartRef" class="chart"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps<{
  actual: number
  target: number
}>()

const chartRef = ref<HTMLElement | null>(null)
let chart: echarts.ECharts | null = null
let resizeObserver: ResizeObserver | null = null

const buildOption = () => ({
  backgroundColor: 'transparent',
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { left: '10%', right: '10%', top: 15, bottom: 15 },
  xAxis: {
    type: 'value',
    axisLabel: { color: '#b0e0ff', fontSize: 14 },
    splitLine: { lineStyle: { color: 'rgba(0,200,255,0.15)' } }
  },
  yAxis: {
    type: 'category',
    data: ['实际', '目标'],
    axisLabel: { color: '#fff', fontSize: 18 }
  },
  series: [{
    type: 'bar',
    data: [
      {
        value: props.actual,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#00ff88' }, { offset: 1, color: '#00cc66' }
          ]),
          shadowBlur: 10, shadowColor: 'rgba(0, 255, 136, 0.6)'
        }
      },
      {
        value: props.target,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#00c8ff' }, { offset: 1, color: '#0080ff' }
          ]),
          shadowBlur: 10, shadowColor: 'rgba(0, 200, 255, 0.6)'
        }
      }
    ],
    barWidth: 50,
    label: { show: true, position: 'right', color: '#fff', fontSize: 18}
  }]
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

watch(() => [props.actual, props.target], () => {
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