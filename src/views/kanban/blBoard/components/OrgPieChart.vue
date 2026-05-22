<template>
    <div ref="chartRef" class="chart"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps<{
    production: number
    maintenance: number
    fault: number
}>()

const chartRef = ref<HTMLElement | null>(null)
let chart: echarts.ECharts | null = null
let resizeObserver: ResizeObserver | null = null

const buildOption = () => ({
    backgroundColor: 'transparent',
    color: ['#00ff88', '#ffe50b', '#ff4d4f'],
    tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
    legend: {
        orient: 'vertical',          // 水平排列
        top: 8,                        // 距顶部 8px
        right: 15,                     // 距右侧 10px
        // icon: 'circle',
        textStyle: { color: '#fff', fontSize: 18},  // 字号加大
        data: ['生产', '保养', '故障']
    },
    series: [
        {
            type: 'pie',
            radius: ['48%', '76%'],
            center: ['50%', '50%'],    // 饼图中心下移，避免被 legend 遮挡
            avoidLabelOverlap: false,
            itemStyle: { borderRadius: 4, borderColor: '#011428', borderWidth: 3 },
            // label: { show: false },
             label: {
                formatter: '{b}: {c}%',
                color: '#e6f7ff',
                fontSize: 20,
                fontWeight: 'bold'
            },
            emphasis: { label: { show: true, fontSize: 16, fontWeight: 'bold', color: '#fff' } },
            data: [
                { value: props.production, name: '生产' },
                { value: props.maintenance, name: '保养' },
                { value: props.fault, name: '故障' }
            ]
        }
    ],
    graphic: [
        {
            type: 'text',
            left: 'center',
            top: 'center',
            style: {
                text: `${props.production}%`,
                textAlign: 'center',
                fill: '#ffffff',
                fontSize: 22,
                fontWeight: 'bold'
            }
        }
    ]
})

const initChart = () => {
    if (!chartRef.value) return
    chart = echarts.init(chartRef.value)
    chart.setOption(buildOption())

    setTimeout(() => {
        if (!chartRef.value || !chart) return
        resizeObserver = new ResizeObserver(() => chart?.resize())
        resizeObserver.observe(chartRef.value)
    }, 1000)
}

watch(
    () => [props.production, props.maintenance, props.fault],
    () => {
        chart?.setOption(buildOption(), { notMerge: false })
    },
    { deep: true }
)

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