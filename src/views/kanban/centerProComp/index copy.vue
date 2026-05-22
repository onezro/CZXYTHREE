<template>
    <div class="w-full h-full flex flex-col bg-[#011428]">
        <!-- 头部标题区域 -->
        <div class="flex h-[80px] w-full relative">
            <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-4xl pt-2">
                星宇电子智能制造工厂-中区生产管理看板
            </div>
            <div class="absolute bottom-[-15px] right-1 ml-auto text-white text-[24px] flex items-center pr-5">
                {{ currentTime }}
            </div>
        </div>

        <!-- 主要内容区域 -->
        <div class="flex-1 mt-4 px-2">
            <div class="mb-4">
                <el-row :gutter="6">
                    <!-- 今日计划（优化字号，防止溢出） -->
                    <el-col :span="5">
                        <div class="card-container">
                            <div class="card-header">
                                <i class="fa fa-tasks"></i>今日计划
                            </div>
                            <div class="card-production">
                                <div class="main-number">
                                    <span class="label">计划入库</span>
                                    <span class="number">{{ planInfo.plannedOutput }}</span>
                                </div>
                                <div class="flex line-row w-full px-6 justify-around">
                                    <div class="line-item">
                                        <span class="label">计划开机</span>
                                        <span class="value blue">{{ planInfo.plannedLines }}</span>
                                    </div>
                                    <div class="line-item">
                                        <span class="label">实际开机</span>
                                        <span class="value green">{{ planInfo.actualLines }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-col>

                    <!-- 成品入库 -->
                    <el-col :span="14">
                        <div class="card-container">
                            <div class="card-header">
                                <i class="fa fa-tasks"></i>成品入库
                            </div>
                            <div class="output-chart-area">
                                <div ref="outputGaugeRef" class="output-gauge"></div>
                                <div ref="outputBarRef" class="output-bar"></div>
                            </div>
                        </div>
                    </el-col>

                    <!-- 出勤情况 -->
                    <el-col :span="5">
                        <div class="card-container">
                            <div class="card-header">
                                <i class="fa fa-tasks"></i>出勤情况
                            </div>
                            <div class="card-attendance">
                                <div class="att-grid">
                                    <div class="att-item">
                                        <span class="att-label">应到</span>
                                        <span class="att-number white">{{ attendance.shouldArrive }}</span>
                                    </div>
                                    <div class="att-item">
                                        <span class="att-label">实到</span>
                                        <span class="att-number green">{{ attendance.actualArrive }}</span>
                                    </div>
                                    <div class="att-item">
                                        <span class="att-label">请假</span>
                                        <span class="att-number yellow">{{ attendance.leave }}</span>
                                    </div>
                                    <div class="att-item">
                                        <span class="att-label">新员工</span>
                                        <span class="att-number cyan">{{ attendance.newEmployee }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>

            <!-- 生产数据表格区域 -->
            <div class="card-container table-card">
                <div class="card-header">
                    <i class="fa fa-tasks"></i>设备数据
                </div>
                <dv-scroll-board :config="configLine" style="height: 600px" class="scroll-board" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import * as echarts from "echarts";

const currentTime = ref("");
const refreshCountdown = ref(60);

const planInfo = reactive({
    plannedOutput: 65000,
    plannedLines: 64,
    actualLines: 64,
});

const productionData = reactive({
    targetQuantity: 65000,
    actualQuantity: 64500,
});

const attendance = reactive({
    shouldArrive: 64,
    actualArrive: 64,
    leave: 0,
    newEmployee: 0,
});

const outputGaugeRef = ref<HTMLElement | null>(null);
const outputBarRef = ref<HTMLElement | null>(null);
let outputGaugeChart: echarts.ECharts | null = null;
let outputBarChart: echarts.ECharts | null = null;

const configLine = ref<{
    header: string[];
    data: string[][];
    headerBGC: string;
    align: string[];
    columnWidth: number[];
    rowNum: number;
    carousel: string;
}>({
    header: [],
    data: [],
    headerBGC: "rgba(16, 33, 68, 0.9)",
    columnWidth: [180, 500,500, 500, 500],   // 适配5列均匀分布
    align: Array(5).fill("center"),
    rowNum: 14,
    carousel: "page",
});

let dataRefreshInterval: ReturnType<typeof setInterval> | null = null;
let countdownInterval: ReturnType<typeof setInterval> | null = null;

const updateTime = () => {
    const now = new Date();
    const weekDays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    const w = weekDays[now.getDay()];
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");
    currentTime.value = `${y}-${m}-${d} ${w} ${hh}:${mm}:${ss}`;
};

const getData = () => {};

const setDataRefreshInterval = () => {
    if (dataRefreshInterval) clearInterval(dataRefreshInterval);
    dataRefreshInterval = setInterval(getData, 60000);
};

const addResizeListener = (chart: echarts.ECharts) => {
    const handler = () => chart?.resize();
    window.addEventListener("resize", handler);
    (chart as any).__resizeHandler = handler;
};

const initOutputGauge = () => {
    if (!outputGaugeRef.value) return;
    outputGaugeChart = echarts.init(outputGaugeRef.value);
    const completionRate = (productionData.actualQuantity / productionData.targetQuantity) * 100;

    outputGaugeChart.setOption({
        backgroundColor: "transparent",
        series: [
            {
                type: "gauge",
                startAngle: 225,
                endAngle: -45,
                center: ["50%", "60%"],
                radius: "85%",
                min: 0,
                max: 100,
                splitNumber: 0,
                axisLine: {
                    lineStyle: {
                        width: 25,
                        color: [
                            [completionRate / 100, "#00ff88"],
                            [1, "rgba(255,255,255,0.15)"],
                        ],
                    },
                },
                pointer: {
                    length: "60%",
                    width: 6,
                    itemStyle: { color: "#00ffcc" },
                },
                axisTick: { show: false },
                axisLabel: { show: false },
                detail: {
                    formatter: completionRate.toFixed(2) + "%",
                    fontSize: 22,
                    fontWeight: "bold",
                    color: "#f5a623",
                    offsetCenter: [0, "55%"],
                },
                data: [{ value: completionRate }],
            },
        ],
    });

    addResizeListener(outputGaugeChart);
};

const initOutputBar = () => {
    if (!outputBarRef.value) return;
    outputBarChart = echarts.init(outputBarRef.value);
    outputBarChart.setOption({
        backgroundColor: "transparent",
        tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
        grid: { left: "10%", right: "10%", top: 15, bottom: 15 },
        xAxis: {
            type: "value",
            axisLabel: {
                color: "#b0e0ff",
                fontSize: 14,
                formatter: (v: number) => (v / 10000).toFixed(1) + "万",
            },
            splitLine: { lineStyle: { color: "rgba(0,200,255,0.15)" } },
        },
        yAxis: {
            type: "category",
            data: ["实际", "目标"],
            axisLabel: { color: "#fff", fontSize: 18 },
        },
        series: [
            {
                type: "bar",
                data: [
                    {
                        value: productionData.actualQuantity,
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                { offset: 0, color: "#00ff88" },
                                { offset: 1, color: "#00cc66" },
                            ]),
                            shadowBlur: 10,
                            shadowColor: "rgba(0, 255, 136, 0.6)",
                        },
                    },
                    {
                        value: productionData.targetQuantity,
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                { offset: 0, color: "#00c8ff" },
                                { offset: 1, color: "#0080ff" },
                            ]),
                            shadowBlur: 10,
                            shadowColor: "rgba(0, 200, 255, 0.6)",
                        },
                    },
                ],
                barWidth: 50,
                label: {
                    show: true,
                    position: "right",
                    color: "#fff",
                    fontSize: 18,
                    formatter: (p: any) => (p.value / 10000).toFixed(1) + "万",
                },
            },
        ],
    });
    addResizeListener(outputBarChart);
};

onMounted(() => {
    configLine.value.header = [
        '<div style="font-size:25px;color:#8ac6ff;">设备名称</div>',
        '<div style="font-size:25px;color:#8ac6ff;">当日目标产能</div>',
        '<div style="font-size:25px;color:#8ac6ff;">工单累计产能</div>',
        '<div style="font-size:25px;color:#8ac6ff;">FPY</div>',
        '<div style="font-size:25px;color:#8ac6ff;">产能达成率</div>',
    ];

    // 表格数据：设备名称改为数字1-14，达成率转为百分比
    const rawData = [
        { line: "1", target: 1200, actual: 100, fpy: "97.61%", rate: "8.33%" },
        { line: "2", target: 1300, actual: 120, fpy: "97.90%", rate: "9.23%" },
        { line: "3", target: 1125, actual: 85, fpy: "95.16%", rate: "7.56%" },
        { line: "4", target: 1200, actual: 100, fpy: "95.98%", rate: "8.33%" },
        { line: "5", target: 900, actual: 75, fpy: "97.00%", rate: "8.33%" },
        { line: "6", target: 1100, actual: 92, fpy: "97.47%", rate: "8.36%" },
        { line: "7", target: 1200, actual: 96, fpy: "96.20%", rate: "8.00%" },
        { line: "8", target: 1400, actual: 115, fpy: "97.24%", rate: "8.21%" },
        { line: "9", target: 1400, actual: 116, fpy: "97.47%", rate: "8.29%" },
        { line: "10", target: 1350, actual: 112, fpy: "96.15%", rate: "8.30%" },
        { line: "11", target: 1200, actual: 98, fpy: "97.19%", rate: "8.17%" },
        { line: "12", target: 1600, actual: 130, fpy: "97.08%", rate: "8.13%" },
        { line: "13", target: 1420, actual: 118, fpy: "95.72%", rate: "8.31%" },
        { line: "14", target: 1280, actual: 105, fpy: "96.67%", rate: "8.20%" },
    ];

    configLine.value.data = rawData.map((item) => [
        `<div style="font-size:22px;color:#fff;">${item.line}</div>`,
        `<div style="font-size:22px;color:#fff;">${item.target}</div>`,
        `<div style="font-size:22px;color:#fff;">${item.actual}</div>`,
        `<div style="font-size:22px;color:#fff;">${item.fpy}</div>`,
        `<div style="font-size:22px;color:#fff;">${item.rate}</div>`,
    ]);

    updateTime();
    getData();
    initOutputGauge();
    initOutputBar();

    setInterval(updateTime, 1000);
    setDataRefreshInterval();

    countdownInterval = setInterval(() => {
        refreshCountdown.value = refreshCountdown.value <= 0 ? 60 : refreshCountdown.value - 1;
    }, 1000);
});

onBeforeUnmount(() => {
    if (dataRefreshInterval) clearInterval(dataRefreshInterval);
    if (countdownInterval) clearInterval(countdownInterval);
    if (outputGaugeChart) {
        const handler = (outputGaugeChart as any).__resizeHandler;
        if (handler) window.removeEventListener("resize", handler);
        outputGaugeChart.dispose();
    }
    if (outputBarChart) {
        const handler = (outputBarChart as any).__resizeHandler;
        if (handler) window.removeEventListener("resize", handler);
        outputBarChart.dispose();
    }
});
</script>

<style lang="scss" scoped>
.card-container {
    height: 320px;
    background: linear-gradient(135deg, rgba(16, 33, 68, 0.9) 0%, rgba(9, 28, 59, 0.95) 100%);
    border: 1px solid rgba(64, 160, 255, 0.3);
    border-radius: 8px;
    padding: 12px;
    box-shadow: 0 0 20px rgba(64, 160, 255, 0.15);
    position: relative;
    overflow: hidden;

    &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 4px;
        background: linear-gradient(90deg, transparent, #40a9ff, transparent);
        opacity: 0.8;
    }

    &.table-card {
        height: 680px;
        margin-top: 6px;
    }
}

.card-header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(64, 160, 255, 0.3);
    font-size: 22px;
    font-weight: bold;
    color: #8ac6ff;

    i {
        margin-right: 8px;
        color: #40a9ff;
    }
}

.card-production {
    height: calc(100% - 60px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .main-number {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-bottom: 15px;
        background: linear-gradient(135deg, rgba(9, 39, 77, 0.9) 0%, rgba(16, 33, 68, 0.8) 100%);
        border-radius: 8px;
        padding: 12px 52px;          // 减小内边距
        border: 1px solid rgba(64, 147, 255, 0.3);
        box-shadow: 0 0 15px rgba(64, 160, 255, 0.1);

        .label {
            font-size: 16px;
            color: #8ac6ff;
            margin-bottom: 2px;
        }

        .number {
            font-size: 38px;          // 缩小数字，防止溢出
            font-weight: 900;
            background: linear-gradient(180deg, #ffffff 0%, #b0d4ff 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-shadow: 0 0 18px rgba(64, 160, 255, 0.5);
        }
    }

    .line-row {
        display: flex;
        justify-content: center;
        gap: 15px;

        .line-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            background: linear-gradient(135deg, rgba(9, 39, 77, 0.9) 0%, rgba(16, 33, 68, 0.8) 100%);
            border-radius: 8px;
            padding: 6px 16px;         // 减小内边距
            border: 1px solid rgba(64, 147, 255, 0.3);

            .label {
                font-size: 18px;        // 缩小标签字号
                color: #8ac6ff;
                margin-bottom: 2px;
            }

            .value {
                font-size: 32px;        // 缩小数值字号
                font-weight: 700;
            }

            .blue { color: #40a9ff; text-shadow: 0 0 10px rgba(64, 169, 255, 0.4); }
            .green { color: #52c41a; text-shadow: 0 0 10px rgba(82, 196, 26, 0.4); }
        }
    }
}

.output-chart-area {
    display: flex;
    height: calc(100% - 60px);
    align-items: center;
    justify-content: space-between;

    .output-gauge {
        width: 220px;
        height: 100%;
    }

    .output-bar {
        flex: 1;
        height: 100%;
        margin-left: 10px;
    }
}

.card-attendance {
    height: calc(100% - 60px);
    display: flex;
    align-items: center;
    justify-content: center;

    .att-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        width: 100%;

        .att-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            background: linear-gradient(135deg, rgba(16, 33, 68, 0.9) 0%, rgba(9, 39, 77, 0.8) 100%);
            border: 1px solid rgba(64, 160, 255, 0.25);
            border-radius: 8px;
            padding: 10px 4px;

            .att-label { font-size: 20px; color: #8ac6ff; margin-bottom: 6px; }
            .att-number { font-size: 36px; font-weight: 800; line-height: 1.1; }

            .white { color: #ffffff; }
            .green { color: #52c41a; text-shadow: 0 0 10px rgba(82, 196, 26, 0.4); }
            .yellow { color: #faad14; text-shadow: 0 0 10px rgba(250, 173, 20, 0.4); }
            .cyan { color: #13c2c2; text-shadow: 0 0 10px rgba(19, 194, 194, 0.4); }
        }
    }
}

.scroll-board {
    --dv-scroll-board-header-font-color: #8ac6ff;
    --dv-scroll-board-header-bg-color: rgba(16, 33, 68, 0.8);
    --dv-scroll-board-even-row-bg-color: rgba(9, 39, 77, 0.4);
    --dv-scroll-board-odd-row-bg-color: rgba(16, 33, 68, 0.6);
    --dv-scroll-board-row-hover-bg-color: rgba(64, 160, 255, 0.2);

    ::v-deep .dv-scroll-board {
        border: none !important;
    }

    ::v-deep .dv-scroll-board-header {
        border-bottom: 1px solid rgba(64, 160, 255, 0.3) !important;
    }

    ::v-deep .dv-scroll-board-cell {
        border-right: 1px solid rgba(64, 160, 255, 0.1) !important;
    }
}

@media screen and (max-width: 1920px) {
    .card-header { font-size: 20px; }
    .main-number .number { font-size: 34px; }
    .att-number,
    .line-item .value { font-size: 28px; }
}
</style>