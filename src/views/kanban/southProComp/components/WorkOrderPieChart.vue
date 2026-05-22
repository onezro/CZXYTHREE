<template>
    <div ref="workOrderRef" class="chart"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps<{
    data: { value: number; name: string }[]  // 饼图数据，如 [{ value: 13, name: '未开工' }, ...]
}>()

const workOrderRef = ref<HTMLElement | null>(null)
let chart: echarts.ECharts | null = null
let resizeHandler: () => void

const buildOption = () => ({
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
})



watch(() => props.data, () => {
    if (chart) {
        chart.setOption(buildOption(), { notMerge: false })
    }
}, { deep: true })
let resizeObserver: ResizeObserver | null = null;
const initChart = () => {
    if (!workOrderRef.value) return;
    chart = echarts.init(workOrderRef.value);
    chart.setOption(buildOption()); // 动画正常开始

    // 延迟 200ms 后再监听尺寸变化，避开初始动画阶段
    setTimeout(() => {
        if (!workOrderRef.value || !chart) return;
        resizeObserver = new ResizeObserver(() => {
            chart?.resize();
        });
        resizeObserver.observe(workOrderRef.value);
    }, 1000);
}
onMounted(initChart)
onBeforeUnmount(() => {
    resizeObserver?.disconnect();
    chart?.dispose();
})
</script>

<style scoped>
.chart {
    width: 100%;
    height: 100%;
}
</style>