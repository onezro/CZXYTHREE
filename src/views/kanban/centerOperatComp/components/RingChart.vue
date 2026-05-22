<template>
  <div ref="chartRef" class="chart"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps<{
  value: number   // 百分比
  color: string   // 主题色
}>()

const chartRef = ref<HTMLElement | null>(null)
let chart: echarts.ECharts | null = null
let resizeObserver: ResizeObserver | null = null

const buildOption = () => ({
  backgroundColor: 'transparent',
  series: [{
    type: 'pie',
    radius: ['48%', '76%'],
    center: ['50%', '48%'],
    hoverAnimation: false,
    label: { show: false },
    emphasis: { scale: false },
    data: [
      { value: props.value, name: '完成' },
      { value: 100 - props.value, name: '剩余' }
    ],
    itemStyle: {
      borderRadius: 5,
      borderColor: 'transparent',
      borderWidth: 2,
      shadowBlur: 15,
      shadowColor: props.color
    },
    color: [props.color, 'rgba(255,255,255,0.08)']
  }],
  graphic: [{
    type: 'text',
    left: 'center',
    top: '45%',
    style: {
      text: props.value.toFixed(2) + '%',
      textAlign: 'center',
      fill: props.color,
      fontSize: 24,
      fontWeight: 'bold',
      textShadow: `0 0 20px ${props.color}`
    }
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

watch(() => [props.value, props.color], () => {
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