<template>
  <div class="fpy-gauge-wrapper">
    <div ref="gaugeRef" class="fpy-gauge"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

const props = defineProps<{
  rate: number
}>()

const gaugeRef = ref<HTMLElement | null>(null)
let gaugeInstance: echarts.ECharts | null = null
let resizeObserver: ResizeObserver | null = null

const initGauge = () => {
  if (!gaugeRef.value) return
  gaugeInstance = echarts.init(gaugeRef.value)

  const option = {
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
              [props.rate / 100, '#40a9ff'],
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
          formatter: props.rate.toFixed(2) + '%',
          fontSize: 22,
          fontWeight: 'bold',
          color: '#f5a623',
          offsetCenter: [0, '55%']
        },
        data: [{ value: props.rate }]
      }
    ]
  }

  gaugeInstance.setOption(option)

  // 延迟绑定 ResizeObserver，避免初始化时立即 resize 打断动画
  nextTick(() => {
    if (!gaugeRef.value) return
    resizeObserver = new ResizeObserver(() => {
      gaugeInstance?.resize()
    })
    resizeObserver.observe(gaugeRef.value)
  })
}
watch(
  () => props.rate,
  (newRate) => {
    if (gaugeInstance) {
      gaugeInstance.setOption(
        {
          series: [
            {
              type: 'gauge',   // 必须显式声明类型
              startAngle: 225,
              endAngle: -45,
              center: ['50%', '60%'],
              radius: '85%',
              axisLine: {
                lineStyle: {
                  color: [
                    [newRate / 100, '#40a9ff'],
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
                formatter: newRate.toFixed(2) + '%',
                fontSize: 22,
                fontWeight: 'bold',
                color: '#f5a623',
                offsetCenter: [0, '55%']
              },
              data: [{ value: newRate }]
            }
          ]
        },
        true   // 保持 notMerge = true，触发指针动画
      )
    }
  }
)

onMounted(() => {
  initGauge()
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  gaugeInstance?.dispose()
})
</script>

<style scoped>
.fpy-gauge-wrapper {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.fpy-gauge {
  width: 100%;
  height: 100%;
}
</style>