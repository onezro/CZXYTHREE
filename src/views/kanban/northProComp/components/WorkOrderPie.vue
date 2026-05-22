<template>
  <div class="work-order-chart">
    <div ref="chartRef" class="chart-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

const props = defineProps<{
  data: { value: number; name: string }[]
}>()

const chartRef = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null
let resizeObserver: ResizeObserver | null = null

const initChart = () => {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)

  const option = {
    color: ['#40a9ff', '#52c41a', '#13c2c2'],
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}单 ({d}%)',
      textStyle: { fontSize: 16 },
      backgroundColor: 'rgba(0, 20, 46, 0.9)',
      borderColor: '#40a9ff',
      borderWidth: 1
    },
    series: [
      {
        name: '工单状态',
        type: 'pie',
        radius: ['48%', '76%'],
        center: ['50%', '48%'],
        avoidLabelOverlap: false,
        label: {
          formatter: '{b}: {c}',
          color: '#e6f7ff',
          fontSize: 20,
          fontWeight: 'bold'
        },
        emphasis: {
          label: { show: true, fontSize: 18, fontWeight: 'bold' }
        },
        data: props.data,
        itemStyle: {
          borderRadius: 5,
          borderColor: 'transparent',
          borderWidth: 2,
          shadowBlur: 10,
          shadowColor: 'rgba(64, 169, 255, 0.5)'
        },
        animationType: 'scale',
        animationEasing: 'cubicInOut',
        animationDuration: 1000,
        animationDelay: (idx: number) => idx * 100
      }
    ],
    backgroundColor: 'transparent'
  }

  chartInstance.setOption(option)

  // 延迟绑定 ResizeObserver，避免初始化时立即 resize 打断动画
  nextTick(() => {
    if (!chartRef.value) return
    resizeObserver = new ResizeObserver(() => {
      chartInstance?.resize()
    })
    resizeObserver.observe(chartRef.value)
  })
}

// 数据变化时使用 notMerge 重新触发动画
watch(
  () => props.data,
  (newData) => {
    if (chartInstance) {
      chartInstance.setOption(
        { series: [{ data: newData }] },
        true // notMerge
      )
    }
  },
  { deep: true }
)

onMounted(() => {
  initChart()
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  chartInstance?.dispose()
})
</script>

<style scoped>
.work-order-chart {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
}
.chart-container {
  flex: 1;
  height: 100%;
}
</style>