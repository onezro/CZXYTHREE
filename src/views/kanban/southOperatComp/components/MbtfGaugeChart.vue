<template>
  <div ref="chartRef" class="chart"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps<{
  value: number        // 当前值
  max: number          // 最大值
  targetText: string   // 目标文本
  unit: string         // 单位
  threshold?: number   // 变色阈值，超过此值变红，默认30
}>()

const chartRef = ref<HTMLElement | null>(null)
let chart: echarts.ECharts | null = null

const buildOption = () => {
  const threshold = props.threshold ?? 30
  const isOver = props.value > threshold
  const activeColor = isOver ? '#ff4444' : '#00ff88'

  return {
    backgroundColor: 'transparent',
    series: [
      {
        type: 'gauge',
        startAngle: 225,
        endAngle: -45,
        center: ['50%', '60%'],
        radius: '100%',
        min: 0,
        max: props.max,
        splitNumber: 10,
        axisLine: {
          lineStyle: {
            width: 25,
            color: [
              [props.value / props.max, activeColor],          // 动态颜色
              [1, 'rgba(255,255,255,0.15)']                   // 保持不变
            ]
          }
        },
        pointer: {
          length: '60%',
          width: 6,
          itemStyle: {
            color: activeColor,
            shadowBlur: 10,
            shadowColor: isOver ? 'rgba(255,68,68,0.7)' : 'rgba(0,229,255,0.7)'
          }
        },
        axisTick: { show: false },
        axisLabel: { show: true, color: '#b0e0ff', fontSize: 14 },
        detail: {
          formatter: () => {
            return `{target|${props.targetText}}\n{value|实际 ${props.value}${props.unit}}`
          },
          rich: {
            target: { fontSize: 14, color: '#b0e0ff', align: 'center' },
            value: { fontSize: 22, fontWeight: 'bold', color: activeColor, align: 'center' }
          },
          offsetCenter: [0, '55%']
        },
        data: [{ value: props.value }]
      }
    ]
  }
}

watch(() => [props.value, props.max, props.targetText, props.unit, props.threshold], () => {
  if (chart) {
    chart.setOption(buildOption(), { notMerge: false })
  }
}, { deep: true })

let resizeObserver: ResizeObserver | null = null

const initChart = () => {
  if (!chartRef.value) return
  chart = echarts.init(chartRef.value)
  chart.setOption(buildOption())

  // 延迟监听尺寸变化，避开初始动画
  setTimeout(() => {
    if (!chartRef.value || !chart) return
    resizeObserver = new ResizeObserver(() => {
      chart?.resize()
    })
    resizeObserver.observe(chartRef.value)
  }, 1000)
}

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