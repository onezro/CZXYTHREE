<template>
    <div>
        <div id="fuleChart" :style="{ height: 180 + 'px' }"></div>
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
// —————— 业务数据 ——————
const rate = 96.77;             // 仪表盘达成率
const plan = 12.05;            // 计划目标
const targetVal = 4.94;        // 时段目标
const actualVal = 3.24;        // 实际完成
const diffVal = 1.70;          // 时段差异

// 堆叠归一化到 100%
const sum = targetVal + actualVal;
const pTarget = +((targetVal / sum) * 100).toFixed(2);
const pActual = +((actualVal / sum) * 100).toFixed(2);
// 时段目标条内部堆叠占比：实际完成 与 目标值 之和归一化到100%
const sumPeriod = actualVal + targetVal;                // 3.24 + 4.94 = 8.18
const actualPct = +((actualVal / sumPeriod) * 100).toFixed(2); // 约 39.61%
const targetPct = +((targetVal / sumPeriod) * 100).toFixed(2); // 约 60.39%
const diffBarLength = diffVal > 0 ? 100 : 0;
const option = ref({
    backgroundColor: 'transparent',
    tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: 'rgba(18,26,38,0.95)',
        textStyle: { color: '#e3ecf3', fontSize: 10 }
    },
    // 左侧为仪表盘留出空间，并让Y轴标签靠近条形
    // grid: [{
    //     left: '38%',   // 缩小左边距，Y轴标签更贴近条形（仪表盘中心已左移）
    //     right: '3%',
    //      top: '0%',
    //     bottom: '15%',
    //     containLabel: true    // 包含轴标签，自动调整偏
    // }],

    // ———— 条形图 X 轴（隐藏）————
    xAxis: {
        type: 'value',
        show: false,          // 不显示X轴
        min: 0,
        max: 100
    },


    series: [


        // ——————————————————————————
        // 左侧：仪表盘（达成率）
        // ——————————————————————————
        {
            type: 'gauge',
            center: ['50%', '50%'],   // 左移以给条形图更多空间
            radius: '70%',
            startAngle: 225,
            endAngle: -45,
            min: 0,
            max: 100,
            splitNumber: 0,
            axisLine: {
                lineStyle: {
                    width: 16,
                    color: [[rate / 100, '#4da8da'], [1, '#fff']]
                }
            },
            pointer: {
                length: '50%',
                width: 6,
                itemStyle: { color: '#f5a623' }
            },
            axisTick: { show: false },
            axisLabel: { show: false },
            detail: {
                formatter: rate + '%',
                fontSize: 18,
                fontWeight: 'bold',
                color: '#f5a623',
                offsetCenter: [0, '40%']
            },
            title: {
                text: '达成率',
                fontSize: 10,
                color: '#e3ecf3',
                offsetCenter: [0, '75%']
            },
            data: [{ value: rate }]
        }
    ]
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
    const chartDom = document.getElementById("fuleChart");
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
