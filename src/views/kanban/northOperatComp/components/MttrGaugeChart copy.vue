<template>
  <div ref="chartRef" class="chart"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps<{
  value: number      // 当前 MTTR 值（分钟）
  max: number        // 最大值（如 30）
  targetText: string  // 目标文本，如 '目标30min'
  unit: string       // 单位，如 'min'
}>()

const chartRef = ref<HTMLElement | null>(null)
let chart: echarts.ECharts | null = null
let resizeHandler: () => void

const buildOption = () => ({
  backgroundColor: 'transparent',
  series: [
    {
      type: 'gauge',
      startAngle: 225,
      endAngle: -45,
      center: ['50%', '60%'],
      radius: '85%',
      min: 0,
      max: props.max,
      splitNumber: 10,
      axisLine: {
        lineStyle: {
          width: 25,
          color: [
            [props.value / props.max, '#ff2d95'],
            [1, 'rgba(255,255,255,0.15)']
          ]
        }
      },
      pointer: {
        length: '60%',
        width: 6,
        itemStyle: {
          color: '#ff2d95',
          shadowBlur: 10,
          shadowColor: 'rgba(255,45,149,0.7)'
        }
      },
      axisTick: { show: false },
      axisLabel: { show: false },
      detail: {
        formatter: () => {
          return `{target|${props.targetText}}\n{value|实际 ${props.value}${props.unit}}`
        },
        rich: {
          target: { fontSize: 14, color: '#b0e0ff', align: 'center' },
          value: { fontSize: 22, fontWeight: 'bold', color: '#ff2d95', align: 'center' }
        },
        offsetCenter: [0, '55%']
      },
      data: [{ value: props.value }]
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

watch(() => [props.value, props.max, props.targetText, props.unit], () => {
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