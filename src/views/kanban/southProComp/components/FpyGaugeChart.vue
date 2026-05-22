<template>
  <div ref="fpyGaugeRef" class="chart"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps<{
  value: number   // 一次通过率，如 96.77
}>()

const fpyGaugeRef = ref<HTMLElement | null>(null)
let chart: echarts.ECharts | null = null
let resizeHandler: () => void

const buildOption = () => ({
  backgroundColor: 'transparent',
  title: {
    text: 'FPY',
    left: 'center',
    top: 'bottom',
    textStyle: {
      color: '#fff',
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: 20
    }
  },
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
            [props.value / 100, '#40a9ff'],
            [1, 'rgba(255,255,255,0.15)']
          ]
        }
      },
      pointer: {
        length: '60%',
        width: 6,
        itemStyle: {
          color: '#40a9ff',
          shadowBlur: 10,
          shadowColor: 'rgba(64, 169, 255, 0.7)'
        }
      },
      axisTick: { show: false },
      axisLabel: { show: false },
      detail: {
        formatter: props.value.toFixed(2) + '%',
        fontSize: 22,
        fontWeight: 'bold',
        color: '#f5a623',
        offsetCenter: [0, '55%']
      },
      data: [{ value: props.value }]
    }
  ]
})

// const initChart = () => {
//   if (!fpyGaugeRef.value) return
//   chart = echarts.init(fpyGaugeRef.value)
//   chart.setOption(buildOption())
//   resizeHandler = () => chart?.resize()
//   window.addEventListener('resize', resizeHandler)
// }

watch(() => props.value, () => {
  if (chart) {
    chart.setOption(buildOption(), { notMerge: false })
  }
})

// onMounted(initChart)
// onBeforeUnmount(() => {
//   window.removeEventListener('resize', resizeHandler)
//   chart?.dispose()
// })
let resizeObserver: ResizeObserver | null = null;

const initChart = () => {
  if (!fpyGaugeRef.value) return;
  chart = echarts.init(fpyGaugeRef.value);
  chart.setOption(buildOption()); // 动画正常开始

  // 延迟 200ms 后再监听尺寸变化，避开初始动画阶段
  setTimeout(() => {
    if (!fpyGaugeRef.value || !chart) return;
    resizeObserver = new ResizeObserver(() => {
      chart?.resize();
    });
    resizeObserver.observe(fpyGaugeRef.value);
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