<template>
  <div class="dashboard-container">
    <!-- 主内容区 -->
    <div class="main-content">
      <el-row :gutter="4" class="h-full">
        <!-- 左侧区域 -->
        <el-col :span="5">
          <div class="left-panel">
            <dv-border-box-12 class="panel-item flex-1">
              <div class="content-block">
                <div class="block-title">订单规划管理</div>
                <div class=" flex flex-col">
                  <div>月订单规划(PCS)</div>
                  <div class="flex justify-around gap-1">
                    <div class="flex flex-col justify-around items-center">
                      <span>目标：{{ 1200000 }} </span>
                      <span>实际：{{ 1175054 }}</span>
                    </div>
                    <div class=" flex flex-col justify-between items-center">
                      <dv-water-level-pond :config="config" style="width:90px;height:90px" />
                      <div>目标达成率</div>
                    </div>
                  </div>
                </div>
              </div>
            </dv-border-box-12>
            <dv-border-box-12 class="panel-item flex-[3]">
              <div class="content-block">
                <div class="block-title">每日订单总览</div>
                <div class="flex flex-col flex-1">

                  <div class="flex flex-col">
                    <div class="flex ">
                      <span>月订单规划(PCS)</span>
                    </div>
                    <div class="flex">
                      <div class="flex-[2]">
                        <fuleChart></fuleChart>
                      </div>
                      <div class="flex-[3]">
                        <stackChart></stackChart>
                      </div>
                    </div>




                  </div>
                  <div class="flex-1">
                    <!-- <stackChart></stackChart> -->
                  </div>
                  <div class="flex-1"></div>
                </div>
              </div>
            </dv-border-box-12>
            <dv-border-box-12 class="panel-item flex-1">
              <div class="content-block">
                <div class="block-title">能源监控</div>
                <div class="block-body">--</div>
              </div>
            </dv-border-box-12>
          </div>
        </el-col>

        <!-- 中间区域 -->
        <el-col :span="14">
          <div class="center-panel">
            <dv-border-box-12 class="panel-item flex-1">
              <div class="content-block">
                <div class="block-title flex justify-center items-center"><span>月累计运营指标</span></div>
                <div class="flex justify-between">
                  <div class=" flex flex-col p-2">
                    <div>L/T(天)</div>
                    <div class="flex justify-around gap-5">
                      <div class="flex flex-col justify-around items-center">
                        <span>目标：{{ 1200000 }} </span>
                        <span>实际：{{ 1175054 }}</span>
                      </div>
                      <div class=" flex flex-col justify-between items-center">
                        <dv-water-level-pond :config="config" style="width:90px;height:90px" />
                        <div>目标达成率</div>
                      </div>
                    </div>
                  </div>
                  <div class=" flex flex-col">
                    <div>OTD(%)</div>
                    <div class="flex justify-around gap-5">
                      <div class="flex flex-col justify-around items-center">
                        <span>目标：{{ 1200000 }} </span>
                        <span>实际：{{ 1175054 }}</span>
                      </div>
                      <div class=" flex flex-col justify-between items-center">
                        <dv-water-level-pond :config="config" style="width:90px;height:90px" />
                        <div>目标达成率</div>
                      </div>
                    </div>
                  </div>
                  <div class=" flex flex-col">
                    <div>OQC合格率(%)</div>
                    <div class="flex justify-around gap-5">
                      <div class="flex flex-col justify-around items-center">
                        <span>目标：{{ 1200000 }} </span>
                        <span>实际：{{ 1175054 }}</span>
                      </div>
                      <div class=" flex flex-col justify-between items-center">
                        <dv-water-level-pond :config="config" style="width:90px;height:90px" />
                        <div>目标达成率</div>
                      </div>
                    </div>
                  </div>
                  <div class=" flex flex-col">
                    <div>时均产值(元)</div>
                    <div class="flex justify-around gap-5">
                      <div class="flex flex-col justify-around items-center">
                        <span>目标：{{ 1200000 }} </span>
                        <span>实际：{{ 1175054 }}</span>
                      </div>
                      <div class=" flex flex-col justify-between items-center">
                        <dv-water-level-pond :config="config" style="width:90px;height:90px" />
                        <div>目标达成率</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </dv-border-box-12>
            <dv-border-box-12 class="panel-item flex-[3]">
              <div class="video-placeholder flex items-center justify-center h-full">
                <span>视频区</span>
              </div>
            </dv-border-box-12>
            <dv-border-box-12 class="panel-item flex-1">
              <el-row :gutter="5" class="h-full">
                <el-col :span="6">
                  <div class="indicator-card">
                    <div class="label">产能利用率</div>
                    <div class="value">--</div>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="indicator-card">
                    <div class="label">实时效率</div>
                    <div class="value">--</div>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="indicator-card">
                    <div class="label">实时FPY</div>
                    <div class="value">--</div>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="indicator-card">
                    <div class="label">设备状态</div>
                    <div class="value">--</div>
                  </div>
                </el-col>
              </el-row>
            </dv-border-box-12>
          </div>
        </el-col>

        <!-- 右侧区域 -->
        <el-col :span="5">
          <div class="right-panel">
            <dv-border-box-12 class="panel-item flex-1">
              <div class="content-block">
                <div class="block-title">连续安全无事故</div>
                <div class="block-body">250天</div>
              </div>
            </dv-border-box-12>
            <dv-border-box-12 class="panel-item flex-[3]">
              <div class="content-block">
                <div class="block-title">每日质量检测</div>
                <div class="flex flex-col flex-1">
                  <div class="flex-1">

                  </div>
                  <div class="flex-1"></div>
                </div>
              </div>
            </dv-border-box-12>
            <dv-border-box-12 class="panel-item flex-1">
              <div class="content-block">
                <div class="block-title">安灯</div>
                <div class="block-body">--</div>
              </div>
            </dv-border-box-12>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, onBeforeMount, onBeforeUnmount } from "vue";
import fuleChart from './components/fuleChart.vue'
import stackChart from './components/stackChart.vue'
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
const config = ref({
  data: [60],
  shape: 'round',
  waveHeight: 20,
  // colors:['#00BAFF','#4366f3']
})

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
.dashboard-container {
  width: 100%;
  height: 100%;
  background: #0a1a3a;
  display: flex;
  flex-direction: column;
  color: #fff;
  overflow: hidden;
}

.main-content {
  flex: 1;
  // padding: 5px 10px 10px 10px;
  overflow: hidden;
}

.left-panel,
.center-panel,
.right-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 0px;
}

.content-block {
  background: rgba(16, 33, 68, 0.5);
  border-radius: 6px;
  padding: 10px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.block-title {
  font-size: 16px;
  color: #8ac6ff;
  border-bottom: 1px solid #40a0ff;
  padding-bottom: 5px;
  margin-bottom: 10px;
  flex-shrink: 0;
}

.block-body {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: bold;
  color: #fff;
}

.indicator-card {
  text-align: center;
  padding: 8px 0;
  border: 1px solid rgba(64, 160, 255, 0.3);
  border-radius: 6px;
  background: rgba(16, 33, 68, 0.5);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: 0.3s;

  &:hover {
    border-color: #40a0ff;
    box-shadow: 0 0 12px rgba(64, 160, 255, 0.4);
  }

  .label {
    font-size: 14px;
    color: #8ac6ff;
    margin-bottom: 6px;
  }

  .value {
    font-size: 26px;
    font-weight: bold;
    color: #fff;
  }
}

.video-placeholder {
  background: rgba(0, 0, 0, 0.3);
  // border: 1px dashed #40a0ff;
  border-radius: 6px;
  color: #40a0ff;
  font-size: 24px;
  // margin: 5px 5px 0 5px;
  // padding: 5px;
}

:deep(.dv-border-box-12) {
  border-radius: 6px;
}
</style>