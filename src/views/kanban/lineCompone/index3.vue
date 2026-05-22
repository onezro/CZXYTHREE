<template>
  <div class="w-full h-full factory-dashboard"> 
    <div class="flex flex-col h-full content-overlay"> <!-- 新增全局遮罩层 -->
      <div class="flex-1 flex flex-col">
        <!-- 标题行：浅色毛玻璃 -->
        <dv-border-box-12 class="flex-1 glass-panel-light mb-1">
          <el-row :gutter="5" class="h-full">
            <el-col :span="5">
              <div class="flex justify-center items-center h-full">
                <span class="text-2xl text-[#1a3048] font-bold">{{ currentTime }}</span> <!-- 深色文字 -->
              </div>
            </el-col>
            <el-col :span="14">
              <div class="flex justify-center items-center h-full">
                <span class="text-5xl text-[#0b2b4a] font-bold tracking-wider">
                  {{ '河南环宇昌·西门子MES·数字化中心' }}
                </span>
              </div>
            </el-col>
            <el-col :span="5">
              <div class="flex justify-center items-center h-full">
                <span class="text-2xl text-[#2c3e50]">天气/Logo</span>
              </div>
            </el-col>
          </el-row>
        </dv-border-box-12>

        <!-- 指标卡片行：浅色底 + 阴影 -->
        <dv-border-box-12 class="flex-1 glass-panel-light">
          <div class="p-2 h-full">
            <el-row :gutter="5" class="h-full">
              <el-col :span="4" v-for="item in topIndicators" :key="item.label">
                <div class="indicator-card-light h-full">
                  <div class="label-light">{{ item.label }}</div>
                  <div class="value-light">{{ item.value }}</div>
                </div>
              </el-col>
            </el-row>
          </div>
        </dv-border-box-12>
      </div>

      <!-- 中部视频区 -->
      <div class="flex-[2] mt-1">
        <dv-border-box-12 class="h-full glass-panel-light">
          <div class="p-3 h-full">
            <el-row :gutter="5" class="h-full">
              <el-col :span="4">
                <div class="flex flex-col h-full gap-4">
                  <div class="content-block-light flex-1">
                    <div class="block-title-light">计划数量</div>
                    <div class="block-body-light">--</div>
                  </div>
                  <div class="content-block-light flex-1">
                    <div class="block-title-light">订单状态</div>
                    <div class="block-body-light">--</div>
                  </div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="video-placeholder-light h-full flex items-center justify-center">
                  <span>视频区 A</span>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="video-placeholder-light h-full flex items-center justify-center">
                  <span>视频区 B</span>
                </div>
              </el-col>
              <el-col :span="4">
                <div class="flex flex-col h-full gap-4">
                  <div class="content-block-light flex-1">
                    <div class="block-title-light">设备状态</div>
                    <div class="block-body-light">--</div>
                  </div>
                  <div class="content-block-light flex-1">
                    <div class="block-title-light">实时警告</div>
                    <div class="block-body-light">--</div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </dv-border-box-12>
      </div>

      <!-- 底部指标 -->
      <dv-border-box-12 class="flex-1 glass-panel-light mt-1">
        <div class="p-3 h-full">
          <el-row :gutter="5" class="h-full">
            <el-col :span="4" v-for="item in bottomIndicators" :key="item.label">
              <div class="indicator-card-light h-full">
                <div class="label-light">{{ item.label }}</div>
                <div class="value-light">{{ item.value }}</div>
              </div>
            </el-col>
          </el-row>
        </div>
      </dv-border-box-12>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, watch, onMounted, onBeforeMount, onBeforeUnmount } from "vue";
// import { GetSMTValorLine } from "@/api/smtApplyApi";
// import { GetReport_LineCurrentWo } from "@/api/kanbanApi";
// import completion from "./completion.vue";
// import spiPassRate from "./spiPassRate.vue";
// import aoiPassRate from "./aoiPassRate.vue";
// import badPassRate from "./badPassRate.vue";
// import capacityChart from "./capacityChart.vue";
// import throwMChart from "./throwMChart.vue";
// import dayjs from "dayjs";
// import { Refresh } from "@element-plus/icons-vue";

const props = defineProps<{
  isVertical: boolean;
}>();

const emit = defineEmits<{
  changeMsg: [];
}>();

const line = ref("Line1");
const options = ref([
  { value: "Line1", label: "Line1" },
  { value: "Line2", label: "Line2" },
  { value: "Line3", label: "Line3" },
  { value: "Line4", label: "Line4" },
  { value: "Line5", label: "Line5" },
  { value: "Line6", label: "Line6" },
  { value: "Line7", label: "Line7" },
]);
const currentTime = ref("");
const lineData = reactive({
  LineName: "",
  OrderName: "",
  CustomerPO: "",
  Side: "",
  ProgramName: "",
  ProductName: "",
  ProductDsc: "",
  ProductNO: "",
  MachineID: 101,
  PlannedStartTime: "",
  PlannedFinishTime: "",
});
const refreshCountdown = ref(60);
const lastUpdatedTime = ref("");
const rateHeight = ref(300);
const barHeight = ref(370);
const isRotate = ref("");
const orderList = ref<any[]>([]);

let dataRefreshInterval: ReturnType<typeof setInterval> | null = null;
let countdownInterval: ReturnType<typeof setInterval> | null = null;
const topIndicators = ref([
  { label: "今日产出", value: "1,250" },
  { label: "工单数", value: "12" },
  { label: "OEE", value: "85%" },
  { label: "运行效率", value: "92%" },
  { label: "在岗人数", value: "28" },
  { label: "告警数", value: "3" },
]);

const bottomIndicators = ref([
  { label: "工单状态", value: "正常" },
  { label: "质量概况", value: "99.2%" },
  { label: "不合格概况", value: "0.8%" },
  { label: "返工/报废", value: "0.3%" },
  { label: "物料预警", value: "2" },
  { label: "7天停机TOP5", value: "P-101" },
]);
watch(
  () => props.isVertical,
  (nVal) => {
    if (nVal) {
      rateHeight.value = 270;
      barHeight.value = 370;
    } else {
      rateHeight.value = 300;
      barHeight.value = 385;
    }
  },
  { immediate: true }
);

onBeforeMount(() => {
  const savedLine = localStorage.getItem("LINEkANBAN");
  if (savedLine) {
    line.value = savedLine;
  }
});

onMounted(() => {
  updateTime();
  getData();
  getLineList();
  setInterval(updateTime, 1000);
  setDataRefreshInterval();

  countdownInterval = setInterval(() => {
    refreshCountdown.value -= 1;
    if (refreshCountdown.value <= 0) {
      refreshCountdown.value = 60;
    }
  }, 1000);
});

onBeforeUnmount(() => {
  if (dataRefreshInterval) {
    clearInterval(dataRefreshInterval);
  }
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
});

const getLineList = () => {
  // GetSMTValorLine({}).then((res: any) => {
  //   options.value = res.Data.map((v: any) => ({
  //     value: v.line,
  //     label: v.line,
  //   }));
  //   });
}

const rotateClick = () => {
  emit("changeMsg");
}

const updateTime = () => {
  const now = new Date();
  // currentTime.value = now.toLocaleString("zh-CN", {
  //   year: "numeric",
  //   month: "2-digit",
  //   day: "2-digit",
  //   hour: "2-digit",
  //   minute: "2-digit",
  //   second: "2-digit",
  //   weekday: "short",
  //   hour12: false,
  // });
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const w = weekDays[now.getDay()];
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  currentTime.value = `${y}-${m}-${d} ${w} ${hh}:${mm}:${ss}`;
}

const handleCommand = (command: string) => {
  line.value = command;
  changeLine(command);
}

const changeLine = (val: string) => {
  localStorage.setItem("LINEkANBAN", val);
  getData();
  refreshCountdown.value = 60;
  setDataRefreshInterval();
}

const getData = () => {
  // GetReport_LineCurrentWo({ line: line.value }).then((res: any) => {
  //   if (res.Success) {
  //     const d = res.Data[0];
  //       Object.assign(lineData, {
  //         ...d,
  //         PlannedStartTime: d.PlannedStartTime
  //           ? dayjs(d.PlannedStartTime).format("YYYY-MM-DD HH:mm:ss")
  //           : "",
  //         PlannedFinishTime: d.PlannedFinishTime
  //           ? dayjs(d.PlannedFinishTime).format("YYYY-MM-DD HH:mm:ss")
  //           : "",
  //       });
  //     }
  //   });
}

const setDataRefreshInterval = () => {
  if (dataRefreshInterval) {
    clearInterval(dataRefreshInterval);
  }
  dataRefreshInterval = setInterval(() => {
    getData();
  }, 60000);
}
</script>

<style lang="scss" scoped>
/* ========== 全局容器与遮罩 ========== */
.factory-dashboard {
  background: transparent; /* 背景完全交给父组件 bg.png */
  color: #1e293b;
  font-family: "Microsoft YaHei", sans-serif;
}

.content-overlay {
  background: rgba(255, 255, 255, 0.25); /* 极浅白色遮罩，降低亮背景干扰 */
  backdrop-filter: blur(2px); /* 轻微毛玻璃，增加内容可读性 */
  border-radius: 12px;
  padding: 0px;
}

/* ========== 通用浅色面板 ========== */
.glass-panel-light {
  background: rgba(255, 255, 255, 0); /* 半透明白底 */
  backdrop-filter: blur(8px);
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

/* ========== 指示卡（浅色版） ========== */
.indicator-card-light {
  text-align: center;
  padding: 12px 0;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(4px);
  border-radius: 10px;
  border: 1px solid rgba(59, 130, 246, 0.2);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.indicator-card-light:hover {
  background: rgba(255, 255, 255, 0.9);
  border-color: #3b82f6;
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.15);
  transform: translateY(-2px);
}

.label-light {
  font-size: 16px;
  color: #475569;
  font-weight: 500;
  margin-bottom: 6px;
}

.value-light {
  font-size: 30px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: 0.5px;
}

/* ========== 内容块（计划/订单） ========== */
.content-block-light {
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(4px);
  border-radius: 10px;
  padding: 12px;
  border: 1px solid rgba(203, 213, 225, 0.6);
}

.block-title-light {
  font-size: 16px;
  color: #334155;
  border-bottom: 1px solid #cbd5e1;
  padding-bottom: 6px;
  margin-bottom: 10px;
  font-weight: 600;
}

.block-body-light {
  height: calc(100% - 40px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  font-weight: 600;
  color: #0f172a;
}

/* ========== 视频占位 ========== */
.video-placeholder-light {
  background: transparent;
  border: 2px dashed #94a3b8;
  border-radius: 10px;
  color: #475569;
  font-size: 24px;
}

/* ========== DataV 边框覆盖（浅色主题） ========== */
:deep(.dv-border-box-12) {
  border-radius: 12px;
  background: transparent;
}

:deep(.dv-border-box-12 .border-box-content) {
  background: transparent;
}
</style>