<template>
  <div ref="chartRef" class="chart"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps<{
  value: number       // 当前值（如 MBTF 小时数）
  max: number         // 目标值（如 720）
  targetText: string  // 目标文本（为空时自动生成）
  unit: string        // 单位，如 'h' 或 'min'
  greenStart?: number // 【新增】优秀区间的起始值，默认 undefined 则沿用三等分目标值
}>()

const chartRef = ref<HTMLElement | null>(null)
let chart: echarts.ECharts | null = null
let resizeObserver: ResizeObserver | null = null

const buildOption = () => {
  const maxVal = props.max
  const actualVal = props.value

  // 计算 X 轴最大值：取目标值、实际值、优秀起始值中的最大值，并上浮 10%
  const maxAxis = Math.ceil(
    Math.max(maxVal, actualVal, props.greenStart ?? 0) * 1.1
  )

  // 背景区间计算
  let seg1: number, seg2: number, seg3: number
  if (props.greenStart !== undefined && props.greenStart > 0) {
    // 固定阈值模式：红 -> 黄 -> 绿
    const midPoint = props.greenStart / 2
    seg1 = midPoint                                  // 红色区间长度
    seg2 = props.greenStart - midPoint               // 黄色区间长度
    seg3 = Math.max(0, maxAxis - props.greenStart)   // 绿色区间长度（可能为 0）
  } else {
    // 经典模式：按目标值三等分
    seg1 = Math.floor(maxVal / 3)
    seg2 = Math.floor(maxVal / 3)
    seg3 = maxVal - seg1 - seg2
    // seg3=450
  }

  

  const targetLabelText = props.targetText || `目标 ${maxVal}${props.unit}`

  return {
    backgroundColor: 'transparent',
    grid: {
      left: 10,
      right: 40,
      top: 55,
      bottom: 45,
      containLabel: false,
    },
    xAxis: {
      type: 'value',
      min: 0,
      max: maxAxis,
      axisLine: {
        show: true,
        lineStyle: { color: 'rgba(255,255,255,0.25)', width: 1 },
      },
      axisTick: { show: false },
      splitLine: {
        show: true,
        lineStyle: { color: 'rgba(255,255,255,0.08)', type: 'dashed' },
      },
      axisLabel: {
        show: true,
        color: '#8ac6ff',
        fontSize: 11,
        formatter: (val: number) => {
          if (val >= 1000) return (val / 1000).toFixed(1) + 'k'
          return val.toString()
        },
      },
    },
    yAxis: {
      type: 'category',
      data: [''],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false },
      splitLine: { show: false },
    },
    series: [
      // 背景区间1：差（红）
      {
        type: 'bar',
        stack: 'bg',
        data: [seg1],
        barWidth: 60,
        z: 1,
        itemStyle: {
          color: 'rgba(255,100,100,0.6)',
          borderRadius: seg2 === 0 && seg3 === 0 ? [5, 5, 5, 5] : [5, 0, 0, 5],
          borderColor: 'transparent',
        },
        emphasis: { disabled: true },
        silent: true,
        animation: true,
        animationDuration: 400,
      },
      // 背景区间2：一般（橙）
      {
        type: 'bar',
        stack: 'bg',
        data: [seg2],
        barWidth: 60,
        z: 1,
        itemStyle: {
          color: 'rgba(255,185,70,0.6)',
          borderRadius: seg3 === 0 ? [0, 5, 5, 0] : [0, 0, 0, 0],
          borderColor: 'transparent',
        },
        emphasis: { disabled: true },
        silent: true,
        animation: true,
        animationDuration: 400,
      },
      // 背景区间3：优秀（绿）
      {
        type: 'bar',
        stack: 'bg',
        data: [seg3],
        barWidth: 60,
        z: 1,
        itemStyle: {
          color: 'rgba(80,220,150,0.6)',
          borderRadius: [0, 5, 5, 0],
          borderColor: 'transparent',
        },
        emphasis: { disabled: true },
        silent: true,
        animation: true,
        animationDuration: 400,
      },
      // 实际值条（覆盖在背景上方）
      {
        type: 'bar',
        data: [actualVal],
         barGap: '-65%',   // 完全重叠
        barWidth: 20,
        z: 10,
        itemStyle: {
          // color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          //   { offset: 0, color: '#00c6ff' },
          //   { offset: 1, color: '#00e5ff' },
          // ]),
          color:'#00ff88',
          borderRadius: [3, 3, 3, 3],
          shadowBlur: 10,
          shadowColor: 'rgba(0,229,255,0.65)',
          shadowOffsetX: 0,
          shadowOffsetY: 0,
        },
        label: {
          show: true,
          position: 'right',
          distance: 8,
          color: '#e0f0ff',
          fontSize: 16,
          fontWeight: 'bold',
          formatter: () => `${actualVal}${props.unit}`,
        },
        emphasis: {
          disabled: false,
          itemStyle: {
            shadowBlur: 18,
            shadowColor: 'rgba(0,229,255,0.8)',
          },
        },
        animation: true,
        animationDuration: 600,
        animationEasing: 'cubicOut',
        // 目标标记线（始终位于 maxVal 处）
        markLine: {
          silent: true,
          symbol: 'none',
          lineStyle: {
            color: 'rgba(80,220,150,1)',
            width: 2.5,
            type: 'solid',
            shadowBlur: 6,
            shadowColor: 'rgba(255,255,255,0.5)',
          },
          data: [
            {
              xAxis: maxVal,
              label: {
                show: true,
                formatter: targetLabelText,
                position: 'end',
                distance: 6,
                color: 'rgba(80,220,150,1)',
                fontSize: 16,
                fontWeight: 'bold',
                backgroundColor: 'rgba(0,0,0,0.45)',
                padding: [3, 8],
                borderRadius: 3,
              },
            },
          ],
          animation: true,
          animationDuration: 500,
        },
      },
    ],
    graphic: [
      {
        type: 'text',
        left: 'center',
        top: 6,
        style: {
          text: `实际 ${actualVal}${props.unit}  ·  目标 ${maxVal}${props.unit}`,
          fontSize: 13,
          fontWeight: 'bold',
          fill: '#b0d4ff',
          textAlign: 'center',
        },
      },
      {
        type: 'text',
        left: 10,
        bottom: 2,
        style: { text: '差', fontSize: 10, fill: 'rgba(255,150,150,0.7)' },
      },
      {
        type: 'text',
        left: '33%',
        bottom: 2,
        style: { text: '一般', fontSize: 10, fill: 'rgba(255,200,120,0.7)' },
      },
      {
        type: 'text',
        left: '67%',
        bottom: 2,
        style: { text: '优秀', fontSize: 10, fill: 'rgba(140,230,180,0.7)' },
      },
    ],
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(8,20,40,0.92)',
      borderColor: 'rgba(64,160,255,0.4)',
      textStyle: { color: '#e0f0ff', fontSize: 13 },
      formatter: () => {
        const rate = ((actualVal / maxVal) * 100).toFixed(1)
        return (
          `<strong>指标详情</strong><br/>` +
          `实际值：<span style="color:#00e5ff;font-weight:bold;">${actualVal}${props.unit}</span><br/>` +
          `目标值：<span style="color:#ffffff;font-weight:bold;">${maxVal}${props.unit}</span><br/>` +
          `达成率：<span style="color:#b0d4ff;">${rate}%</span>`
        )
      },
    },
  }
}

watch(
  () => [props.value, props.max, props.targetText, props.unit, props.greenStart],
  () => {
    if (chart) {
      chart.setOption(buildOption(), { notMerge: false })
    }
  },
  { deep: true }
)

const initChart = () => {
  if (!chartRef.value) return
  chart = echarts.init(chartRef.value)
  chart.setOption(buildOption())

  setTimeout(() => {
    if (!chartRef.value || !chart) return
    resizeObserver = new ResizeObserver(() => {
      chart?.resize()
    })
    resizeObserver.observe(chartRef.value)
  }, 800)
}

onMounted(initChart)

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  chart?.dispose()
  chart = null
})
</script>

<style scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>