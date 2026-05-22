<template>
    <div>
        <div id="stackChart" :style="{ height: 180 + 'px' }"></div>
    </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import dayjs from "dayjs";
import {
    ref,
    reactive,
    watch,
    computed,
    nextTick,
    onMounted,
    onBeforeMount,
    onBeforeUnmount,
} from "vue";
const planTarget = 12.05; // 计划目标（万PCS）
const periodTarget = 4.94; // 时段目标值（万PCS）
const periodActual = 3.24; // 时段实际值（万PCS）
const periodGap = 1.70; // 时段差异 = 4.94 - 3.24（万PCS）

// 时段目标中：实际值占比 + 差值占比 = 100%
const actualRatio = parseFloat(((periodActual / periodTarget) * 100).toFixed(2)); // ≈ 65.59%
const gapRatio = parseFloat(((periodGap / periodTarget) * 100).toFixed(2)); // ≈ 34.41%

// ──────────────────────────────────────
// Y轴类别（从上到下：计划目标 → 时段目标 → 时段差异）
// ──────────────────────────────────────
const yCategories = ['计划目标', '时段目标', '时段差异'];

// ──────────────────────────────────────
// 颜色定义
// ──────────────────────────────────────
const colorBlue = '#3b6ff5'; // 蓝色：计划/实际
const colorGreen = '#2eb872'; // 绿色：差值缺口
const colorOrange = '#f57c3c'; // 橙色：时段差异

// ──────────────────────────────────────
// 系列1：蓝色 — 计划/实际完成
// ──────────────────────────────────────
const seriesBlueData = [
    // 计划目标行 → 整个条100%蓝色，显示 12.05万PCS
    {
        value: 100,
        label: {
            show: true,
            formatter: '12.05',
            fontSize: 13,
            fontWeight: 600,
            color: '#fff',
        },
    },
    // 时段目标行 → 实际值占比约65.59%蓝色，显示 3.24
    {
        value: actualRatio,
        label: {
            show: true,
            formatter: periodTarget.toString(),
            fontSize: 13,
            fontWeight: 600,
            color: '#fff',
        },
    },
    // 时段差异行 → 无蓝色
    {
        value: 0,
        label: { show: false },
    },
];

// ──────────────────────────────────────
// 系列2：绿色 — 差值缺口
// ──────────────────────────────────────
const seriesGreenData = [
    // 计划目标行 → 无绿色
    {
        value: 0,
        label: { show: false },
    },
    // 时段目标行 → 差值占比约34.41%绿色，显示 1.70
    {
        value: gapRatio,
        label: {
            show: true,
            formatter: periodActual.toString(),
            fontSize: 13,
            fontWeight: 600,
            color: '#fff',
        },
    },
    // 时段差异行 → 无绿色
    {
        value: 0,
        label: { show: false },
    },
];

// ──────────────────────────────────────
// 系列3：橙色 — 时段差异（独立展示）
// ──────────────────────────────────────
const seriesOrangeData = [
    // 计划目标行 → 无橙色
    {
        value: 0,
        label: { show: false },
    },
    // 时段目标行 → 无橙色
    {
        value: 0,
        label: { show: false },
    },
    // 时段差异行 → 100%橙色条，显示 1.70
    {
        value: 100,
        label: {
            show: true,
            formatter: '1.70',
            fontSize: 13,
            fontWeight: 600,
            color: '#fff',
        },
    },
];

const option = ref({
    tooltip: {
        trigger: 'item',
        backgroundColor: '#fff',
        borderColor: '#e0e5ea',
        borderWidth: 1,
        textStyle: {
            color: '#2c3e50',
            fontSize: 13,
        },
        extraCssText: 'border-radius:8px;box-shadow:0 6px 20px rgba(0,0,0,0.08);padding:10px 14px;',
        formatter: (params: any) => {
            if (params.value === 0) return '';
            const seriesName = params.seriesName;
            const yName = params.name;
            const val = params.value;
            let absVal = '';
            if (yName === '计划目标' && seriesName === '计划/实际') {
                absVal = '12.05万PCS';
            } else if (yName === '时段目标' && seriesName === '计划/实际') {
                absVal = '3.24万PCS（实际）';
            } else if (yName === '时段目标' && seriesName === '差值缺口') {
                absVal = '1.70万PCS（缺口）';
            } else if (yName === '时段差异' && seriesName === '时段差异') {
                absVal = '1.70万PCS';
            }
            return `<strong>${yName}</strong><br/>
                    <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${params.color};margin-right:6px;"></span>
                    ${seriesName}：<b>${absVal}</b>（占比 ${val}%）`;
        },
    },
    legend: {
        top: '0%',
        textStyle: {
fontSize: 14, // 字体大小
color: '#ffffff' // 字体颜色
},
        // show: false, // 使用自定义图例
    },
    grid: {
        left: '10px',
        right: '10px',
        top: '30px',
        bottom: '30px',
        containLabel: false,
    },
    xAxis: {
        type: 'value',
        show: false,
        max: 100,
        min: 0,
        axisLabel: {
            formatter: '{value}%',
            color: '#7a8899',
            fontSize: 12,
            fontWeight: 500,
        },
        axisTick: { show: false },
        axisLine: {
            lineStyle: { color: '#dce2e8' },
        },
        splitLine: {
            lineStyle: {
                color: '#f0f3f6',
                type: 'dashed',
                dashOffset: 3,
            },
        },
        name: '百分比',
        nameTextStyle: {
            color: '#9aa8b8',
            fontSize: 11,
            fontWeight: 500,
        },
    },
    yAxis: {
        type: 'category',
        data: yCategories,
        inverse: true, // 计划目标在顶部
        axisTick: { show: false },
        axisLine: {
            show: false,
            lineStyle: { color: '#dce2e8' },
        },
        axisLabel: {
            color: '#ffffff',
            fontSize: 14,
            fontWeight: 600,
            margin: 16,
        },
        nameTextStyle: {
            color: '#9aa8b8',
            fontSize: 11,
        },
        splitLine: { show: false },
    },
    series: [{
        name: '目标',
        type: 'bar',
        stack: 'total',
        data: seriesBlueData,
        itemStyle: {
            color: colorBlue,
            borderRadius: [0, 0, 0, 0],
            borderWidth: 0,
        },
        barWidth: 22,
        emphasis: {
            itemStyle: {
                color: '#2b5de0',
                shadowBlur: 8,
                shadowColor: 'rgba(59,111,245,0.35)',
            },
        },
        label: {
            position: 'inside',
            show: true,
            fontSize: 13,
            fontWeight: 600,
            color: '#fff',
        },
    }, {
        name: '实际',
        type: 'bar',
        stack: 'total',
        data: seriesGreenData,
        itemStyle: {
            color: colorGreen,
            borderRadius: [0, 0, 0, 0],
            borderWidth: 0,
        },
        barWidth: 22,
        emphasis: {
            itemStyle: {
                color: '#25a05e',
                shadowBlur: 8,
                shadowColor: 'rgba(46,184,114,0.35)',
            },
        },
        label: {
            position: 'inside',
            show: true,
            fontSize: 13,
            fontWeight: 600,
            color: '#fff',
        },
    }, {
        name: '差异',
        type: 'bar',
        stack: 'total',
        data: seriesOrangeData,
        itemStyle: {
            color: colorOrange,
            // borderRadius: [6, 6, 6, 6],
            borderWidth: 0,
        },
        barWidth: 22,
        emphasis: {
            itemStyle: {
                color: '#e06a2b',
                shadowBlur: 8,
                shadowColor: 'rgba(245,124,60,0.35)',
            },
        },
        label: {
            position: 'inside',
            show: true,
            fontSize: 13,
            fontWeight: 600,
            color: '#fff',
        },
    },],
    animationDuration: 1000,
    animationEasing: 'cubicInOut',
    animationDelay: function (idx: any) {
        return idx * 120;
    },
})
const timer = ref<any>(null)
const barHeight = ref(520)
const chart = ref()
const refreshing = ref(false)

onMounted(() => {
    initChart();
    startRefreshing();
})
const initChart = () => {
    const chartDom = document.getElementById("stackChart");
    chart.value = echarts.init(chartDom);
    chart.value.setOption(option.value);
    // myChart.resize();
}
const getData = () => {
    // let rate=27.1
    // option.value.axisLine.lineStyle.color=[[rate / 100, '#4da8da'], [1, '#3cba80']]
    // option.value.data=[{value:rate}]
}
const startRefreshing = () => {
    stopRefreshing(); // 确保只有一个定时器运行
    refreshing.value = true;
    // timer.value = setInterval(() => {
    //     getData();
    // }, 60000);
}
const stopRefreshing = () => {
    if (timer.value) {
        clearInterval(timer.value);
        timer.value = null;
    }
    refreshing.value = false;
}

</script>

<style lang="scss" scoped></style>
