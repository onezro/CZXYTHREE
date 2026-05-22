<template>
  <div ref="fpyRingRef" class="chart"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps<{
  value: number   // 百分比数值，如 96.77
  color: string   // 主题色
}>()

const fpyRingRef = ref<HTMLElement | null>(null)
let chart: echarts.ECharts | null = null
let resizeHandler: () => void

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

// const initChart = () => {
//   if (!fpyRingRef.value) return
//   chart = echarts.init(fpyRingRef.value)
//   chart.setOption(buildOption())  // 首次渲染带默认动画
//   resizeHandler = () => chart?.resize()
//   window.addEventListener('resize', resizeHandler)
// }

watch(() => [props.value, props.color], () => {
  if (chart) {
    // 更新数据并保留动画
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
  if (!fpyRingRef.value) return;
  chart = echarts.init(fpyRingRef.value);
  chart.setOption(buildOption()); // 动画正常开始

  // 延迟 200ms 后再监听尺寸变化，避开初始动画阶段
  setTimeout(() => {
    if (!fpyRingRef.value || !chart) return;
    resizeObserver = new ResizeObserver(() => {
      chart?.resize();
    });
    resizeObserver.observe(fpyRingRef.value);
  }, 1000);
};
onMounted(initChart)
onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  chart?.dispose();
});
</script>

<style scoped>
.chart { width: 100%; height: 100%; }
</style>