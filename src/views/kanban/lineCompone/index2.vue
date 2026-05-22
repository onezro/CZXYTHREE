<template>
  <div class="w-full h-full">
    <div class="flex flex-col h-full">
      <div class="flex-1 flex flex-col">
        <dv-border-box-12 class="flex-1 bg-opacity-20 bg-black ">
          <el-row :gutter="5" class="h-full">

            <el-col :span="4">
              <div class="flex justify-center items-center h-full"><span class="text-2xl text-[#fff]">{{ currentTime
                  }}</span></div>
            </el-col>
            <el-col :span="16">
              <div class="flex justify-center items-center h-full"><span class="text-6xl text-[#fff]">{{
                '河南环宇昌·西门子MES·数字化中心'
                  }}</span></div>
            </el-col>
            <el-col :span="4">
              <div class="flex justify-center items-center h-full"><span class="text-6xl text-[#fff]">{{
                '暂定'
                  }}</span></div>
            </el-col>

          </el-row>
        </dv-border-box-12>
        <dv-border-box-12 class="flex-1  h-full">
          <div class="bg-opacity-20 bg-black p-2  h-full">
            <el-row :gutter="5" class="h-full">
              <el-col :span="4">
                <div class="indicator-card">
                  <div class="label">今日产出</div>
                  <div class="value">--</div>
                </div>
              </el-col>
              <el-col :span="4">
                <div class="indicator-card">
                  <div class="label">工单数</div>
                  <div class="value">--</div>
                </div>
              </el-col>
              <el-col :span="4">
                <div class="indicator-card">
                  <div class="label">OEE</div>
                  <div class="value">--%</div>
                </div>
              </el-col>
              <el-col :span="4">
                <div class="indicator-card">
                  <div class="label">运行效率</div>
                  <div class="value">--%</div>
                </div>
              </el-col>
              <el-col :span="4">
                <div class="indicator-card">
                  <div class="label">在岗人数</div>
                  <div class="value">--</div>
                </div>
              </el-col>
              <el-col :span="4">
                <div class="indicator-card">
                  <div class="label">告警数</div>
                  <div class="value">--</div>
                </div>
              </el-col>
            </el-row>
          </div>
        </dv-border-box-12>
      </div>
      <div class="flex-[2]">
        <!-- <el-row :gutter="5">
          <el-col :span="4">
            <div class="flex flex-col">
              <div>计划数量</div>
              <div>订单状态</div>
            </div>
          </el-col>
          <el-col :span="8">视频区A</el-col>
          <el-col :span="8">视频区B</el-col>
          <el-col :span="4">
            <div class="flex flex-col">
              <div>设备状态分布</div>
              <div>实时警告</div>
            </div>
          </el-col>
        </el-row> -->
        <dv-border-box-12 class="mb-2 flex-[2]">
          <div class="bg-opacity-20 bg-black p-3 h-full">
            <el-row :gutter="5" class="h-full">
              <el-col :span="4">
                <div class="flex flex-col h-full">
                  <div class="content-block flex-1">
                    <div class="block-title">计划数量</div>
                    <div class="block-body">--</div>
                  </div>
                  <div class="content-block flex-1">
                    <div class="block-title">订单状态</div>
                    <div class="block-body">--</div>
                  </div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="video-placeholder h-full flex items-center justify-center">
                  <span>视频区 A</span>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="video-placeholder h-full flex items-center justify-center">
                  <span>视频区 B</span>
                </div>
              </el-col>
              <el-col :span="4">
                <div class="flex flex-col h-full">
                  <div class="content-block flex-1">
                    <div class="block-title">设备状态分布</div>
                    <div class="block-body">--</div>
                  </div>
                  <div class="content-block flex-1">
                    <div class="block-title">实时警告</div>
                    <div class="block-body">--</div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </dv-border-box-12>
      </div>
      <!-- <div class="flex-1 ">
        <el-row :gutter="20">
          <el-col :span="4">工单状态</el-col>
          <el-col :span="4">质量概况</el-col>
          <el-col :span="4">不合格概况</el-col>
          <el-col :span="4">返工/报废概况</el-col>
          <el-col :span="4">物料预警</el-col>
          <el-col :span="4">7天停机时长TOP5</el-col>
        </el-row>
      </div> -->
      <dv-border-box-12 class="flex-1">
        <div class="bg-opacity-20 bg-black p-3 h-full">
          <el-row :gutter="5" class="h-full">
            <el-col :span="4">
              <div class="indicator-card">
                <div class="label">工单状态</div>
                <div class="value">--</div>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="indicator-card">
                <div class="label">质量概况</div>
                <div class="value">--</div>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="indicator-card">
                <div class="label">不合格概况</div>
                <div class="value">--</div>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="indicator-card">
                <div class="label">返工/报废概况</div>
                <div class="value">--</div>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="indicator-card">
                <div class="label">物料预警</div>
                <div class="value">--</div>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="indicator-card">
                <div class="label">7天停机TOP5</div>
                <div class="value">--</div>
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
/* 顶部标题栏 */
.title-bar {
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  position: relative;
  background: rgba(16, 33, 68, 0.7);
  border-bottom: 1px solid #40a0ff;
  padding: 0 10px;
}

.title-text {
  flex: 1;
  text-align: center;
  font-size: 36px;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 0 0 20px #40a0ff;
  letter-spacing: 4px;
}

.decoration {
  width: 120px;
  height: 60px;
}

.decoration-center {
  margin: 0 -10px;
}

.transform {
  transform: rotateY(180deg);
}

.current-time {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  color: #8ac6ff;
}

/* 指标卡片 */
.indicator-card {
  text-align: center;
  padding: 10px 0;
  border: 1px solid rgba(64, 160, 255, 0.3);
  border-radius: 8px;
  background: rgba(16, 33, 68, 0.5);
  transition: 0.3s;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.indicator-card:hover {
  border-color: #40a0ff;
  box-shadow: 0 0 15px rgba(64, 160, 255, 0.4);
}

.label {
  font-size: 18px;
  color: #8ac6ff;
  margin-bottom: 8px;
}

.value {
  font-size: 32px;
  font-weight: bold;
  color: #fff;
}

/* 内容块（计划/订单） */
.content-block {
  background: rgba(16, 33, 68, 0.5);
  border: 1px solid rgba(64, 160, 255, 0.3);
  border-radius: 8px;
  padding: 10px;
  height: 100%;
}

.block-title {
  font-size: 18px;
  color: #8ac6ff;
  border-bottom: 1px solid #40a0ff;
  padding-bottom: 5px;
  margin-bottom: 10px;
}

.block-body {
  height: calc(100% - 40px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: #fff;
}

/* 视频占位 */
.video-placeholder {
  background: rgba(0, 0, 0, 0.3);
  border: 1px dashed #40a0ff;
  border-radius: 8px;
  color: #40a0ff;
  font-size: 24px;
}

/* dv-border-box 内部微调 */
:deep(.dv-border-box-12) {
  border-radius: 8px;
}
</style>