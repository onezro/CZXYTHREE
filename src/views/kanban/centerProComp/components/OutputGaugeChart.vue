<template>
  <div ref="chartRef" class="chart"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps<{
  actual: number   // 实际入库量
  target: number   // 目标入库量
}>()

const chartRef = ref<HTMLElement | null>(null)
let chart: echarts.ECharts | null = null
let resizeObserver: ResizeObserver | null = null

const buildOption = () => {
  const completionRate = (props.actual / props.target) * 100
  return {
    backgroundColor: 'transparent',
    series: [
      {
        type: 'gauge',
        startAngle: 225,
        endAngle: -45,
        center: ['50%', '60%'],
        radius: '85%',
        min: 0,
        max: 100,
        splitNumber: 0,
        axisLine: {
          lineStyle: {
            width: 25,
            color: [
              [completionRate / 100, '#00ff88'],
              [1, 'rgba(255,255,255,0.15)']
            ]
          }
        },
        pointer: {
          length: '60%',
          width: 6,
          itemStyle: { color: '#00ffcc' }
        },
        axisTick: { show: false },
        axisLabel: { show: false },
        detail: {
          formatter: completionRate.toFixed(2) + '%',
          fontSize: 22,
          fontWeight: 'bold',
          color: '#f5a623',
          offsetCenter: [0, '55%']
        },
        data: [{ value: completionRate }]
      }
    ]
  }
}

const initChart = () => {
  if (!chartRef.value) return
  chart = echarts.init(chartRef.value)
  chart.setOption(buildOption()) // 首次渲染带默认动画

  // 延迟绑定 ResizeObserver，保留初始动画
  setTimeout(() => {
    if (!chartRef.value || !chart) return
    resizeObserver = new ResizeObserver(() => {
      chart?.resize()
    })
    resizeObserver.observe(chartRef.value)
  }, 1000)
}

watch(() => [props.actual, props.target], () => {
  if (chart) {
    chart.setOption(buildOption(), { notMerge: false }) // 更新数据，保留动画
  }
}, { deep: true })

onMounted(initChart)
onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  chart?.dispose()
})
</script>

<style scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>