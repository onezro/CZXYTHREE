<template>
  <div class="w-full h-full">
    <div class="flex flex-col w-full">
      <div class="title">
        <dv-decoration-10 class="dv-dec-10 decoration" :color="['#40a0ffb8']" />
        <dv-decoration-8 class="dv-dec-8 decoration decoration-center" :color="['#40a0ffb8', '#40a0ffb8']" />
        <div class="text decoration-center">
          <div style="margin: auto;" class="text-white flex items-center">
            <span>星宇车灯电子二工厂 </span>
            <div class="custom-select-wrapper">
              <select id="customSelect" class="custom-select" v-model="line" @change="handleCommand(line)">
                <option v-for="item in options" :value="item.value" :key="item.value">
                  <span class="text-center">{{ item.label }}</span>
                </option>
              </select>
            </div>
          </div>
        </div>
        <dv-decoration-8 class="dv-dec-8 transform decoration decoration-center" :color="['#40a0ffb8', '#40a0ffb8']" />
        <dv-decoration-10 class="dv-dec-10 transform decoration" :color="['#40a0ffb8']" />

        <div class="text-white flex justify-end items-center timetext" style="font-size: 24px">
          <span class="pr-5">{{ currentTime }}</span>
          <el-icon @click="rotateClick" style="cursor:pointer;font-size:24px">
            <Refresh />
          </el-icon>
        </div>
      </div>

      <div class="h-32 dashboard-header" v-if="!isVertical">
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">生产工单</div>
            <div class="info-value">{{ lineData.OrderName || "" }}</div>
          </div>
          <div class="info-item">
            <div class="info-label text-center">面别</div>
            <div class="info-value text-center">{{ lineData.Side || "" }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">产品编码</div>
            <div class="info-value">{{ lineData.ProductNO || "" }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">产品</div>
            <div class="info-value">{{ lineData.ProductDsc || "" }}</div>
          </div>

          <div class="info-item">
            <div class="info-label">实际开始时间</div>
            <div class="info-value">{{ lineData.PlannedStartTime || "" }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">理论结束时间</div>
            <div class="info-value">{{ lineData.PlannedFinishTime || "" }}</div>
          </div>
        </div>
      </div>
      <div class="h-64 dashboard-header-vertical" v-if="isVertical">
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">生产工单</div>
            <div class="info-value">{{ lineData.OrderName || "" }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">产品编码</div>
            <div class="info-value">{{ lineData.ProductNO || "" }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">产品</div>
            <div class="info-value">{{ lineData.ProductDsc || "" }}</div>
          </div>
        </div>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">面别</div>
            <div class="info-value">{{ lineData.Side || "" }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">实际开始时间</div>
            <div class="info-value">{{ lineData.PlannedStartTime || "" }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">理论结束时间</div>
            <div class="info-value">{{ lineData.PlannedFinishTime || "" }}</div>
          </div>
        </div>
      </div>
      <div class="flex flex-col" v-if="isVertical">
        <div class="flex" style="gap: 10px">
          <dv-border-box-13 class="centerh centerh-vertical">
            <div class="header_title">
              <i class="fa fa-tasks"></i><span class="text-color"> 当前工单完成率</span>
            </div>
            <div>
              <!-- <completion :Line="line" :rateHeight="rateHeight" /> -->
            </div>
          </dv-border-box-13>
          <dv-border-box-13 class="centerh centerh-vertical">
            <div class="header_title">
              <i class="fa fa-check-circle"></i><span class="text-color"> SPI直通率</span>
            </div>
            <div>
              <!-- <spiPassRate :Line="line" :rateHeight="rateHeight" /> -->
            </div>
          </dv-border-box-13>
        </div>
        <div class="flex" style="gap: 10px">
          <dv-border-box-13 class="centerh centerh-vertical">
            <div class="header_title">
              <i class="fa fa-search"></i><span class="text-color"> AOI直通率</span>
            </div>
            <div>
              <!-- <aoiPassRate :Line="line" :rateHeight="rateHeight" /> -->
            </div>
          </dv-border-box-13>
          <dv-border-box-13 class="centerh centerh-vertical">
            <div class="header_title">
              <i class="fa fa-exclamation-triangle"></i>
              <span class="text-color"> 不良分布</span>
            </div>
            <div>
              <!-- <badPassRate :Line="line" :rateHeight="rateHeight" /> -->
            </div>
          </dv-border-box-13>
        </div>
        <div>
          <dv-border-box-12 class="centerh1 centerh1-vertical">
            <div class="header_title">
              <i class="fa fa-bar-chart"></i><span class="text-color"> 贴片机单小时产能</span>
            </div>
            <div>
              <!-- <capacityChart :Line="line" :barHeight="barHeight" /> -->
            </div>
          </dv-border-box-12>
        </div>
        <div>
          <dv-border-box-12 class="centerh1 centerh1-vertical">
            <div class="header_title">
              <i class="fa fa-bar-chart"></i>
              <span class="text-color"> 抛料</span><span style="color: #ff0000; font-size: 25px">TOP10</span>
            </div>
            <div>
              <!-- <throwMChart :Line="line" :barHeight="barHeight" /> -->
            </div>
          </dv-border-box-12>
        </div>
      </div>

      <div class="flex flex-col" v-if="!isVertical">
        <div class="flex" style="gap: 10px">
          <dv-border-box-13 class="centerh">
            <div class="header_title">
              <i class="fa fa-tasks"></i>
              <span class="text-color">当前工单完成率</span>
            </div>
            <div>
              <!-- <completion :Line="line" :rateHeight="rateHeight" /> -->
            </div>
          </dv-border-box-13>
          <dv-border-box-13 class="centerh">
            <div class="header_title">
              <i class="fa fa-check-circle"></i><span class="text-color"> SPI直通率</span>
            </div>
            <div>
              <!-- <spiPassRate :Line="line" :rateHeight="rateHeight" /> -->
            </div>
          </dv-border-box-13>
          <dv-border-box-13 class="centerh">
            <div class="header_title">
              <i class="fa fa-search"></i><span class="text-color"> AOI直通率</span>
            </div>
            <div>
              <!-- <aoiPassRate :Line="line" :rateHeight="rateHeight" /> -->
            </div>
          </dv-border-box-13>
          <dv-border-box-13 class="centerh">
            <div class="header_title">
              <i class="fa fa-exclamation-triangle"></i>
              <span class="text-color">不良分布</span>
            </div>
            <div>
              <!-- <badPassRate :Line="line" :rateHeight="rateHeight" /> -->
            </div>
          </dv-border-box-13>
        </div>
        <div class="flex" style="gap: 10px">
          <dv-border-box-12 class="centerh1">
            <div class="header_title">
              <i class="fa fa-bar-chart"></i>
              <span class="text-color">贴片机单小时产能</span>
            </div>
            <div>
              <!-- <capacityChart :Line="line" :barHeight="barHeight" /> -->
            </div>
          </dv-border-box-12>
          <dv-border-box-12 class="centerh1">
            <div class="header_title">
              <i class="fa fa-bar-chart"></i>
              <span class="text-color">抛料</span><span style="color: #ff0000; font-size: 25px"> TOP10</span>
            </div>
            <div>
              <!-- <throwMChart :Line="line" :barHeight="barHeight" /> -->
            </div>
          </dv-border-box-12>
        </div>
      </div>
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
  currentTime.value = now.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    weekday: "short",
    hour12: false,
  });
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
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0 8px 0;
  padding: 10px 0px;
  background: rgba(16, 33, 68, 0.7);
  border-radius: 8px;
  border: 2px solid rgba(64, 160, 255, 0.723);
  box-shadow: 0 0 20px rgba(0, 100, 255, 0.1);

  .info-grid {
    display: grid;
    grid-template-columns: 1fr 90px 1fr 3fr 280px 280px;
    gap: 15px;
  }

  .info-item {
    background: rgba(16, 33, 68, 0.5);
    padding: 0 15px;
    border-radius: 6px;
    border-left: 3px solid #40a9ff;
  }

  .info-item:first-child {
    border-left: none;
  }

  .info-label {
    font-size: 24px;
    color: #8ac6ff;
    font-weight: bold;
    margin-bottom: 5px;
  }

  .info-value {
    font-size: 25px;
    font-weight: bolder;
    color: #ffffff;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    white-space: normal;
    word-wrap: break-word;
    overflow: hidden;
  }
}

.dashboard-header-vertical {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin: 20px 0 10px 0;
  padding: 10px 0px;
  background: rgba(16, 33, 68, 0.7);
  border-radius: 8px;
  border: 2px solid rgba(64, 160, 255, 0.723);
  box-shadow: 0 0 20px rgba(0, 100, 255, 0.1);

  .info-grid {
    display: grid;
    grid-template-columns: 300px 300px 1fr;
    gap: 15px;
  }

  .info-item {
    background: rgba(16, 33, 68, 0.5);
    padding: 0 15px;
    border-radius: 6px;
    border-left: 3px solid #40a9ff;
  }

  .info-item:first-child {
    border-left: none;
  }

  .info-label {
    font-size: 24px;
    color: #8ac6ff;
    font-weight: bold;
    margin-bottom: 5px;
  }

  .info-value {
    display: block;
    font-size: 25px;
    font-weight: bolder;
    color: #ffffff;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    white-space: normal;
    word-wrap: break-word;
    overflow: hidden;
  }
}

.centerh {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 10px;
  height: 380px;
  font-size: 22px;
  font-weight: bolder;
  color: #8ac6ff;
  background-color: rgba(16, 33, 68, 0.7);

  .header_title {
    margin-bottom: 15px;
    padding-bottom: 5px;
    border-bottom: 1px solid rgb(64, 160, 255);
  }
}

.centerh1 {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 10px;
  height: 460px;
  font-size: 22px;
  font-weight: bolder;
  color: #8ac6ff;
  background-color: rgba(16, 33, 68, 0.9);

  .header_title {
    margin-bottom: 15px;
    padding-bottom: 5px;
    border-bottom: 1px solid rgb(64, 160, 255);
  }
}

.centerh-vertical {
  height: 330px;
}

.centerh1-vertical {
  height: 445px;
}

.el-dropdown-link {
  color: #ffffff;
  font-size: 32px;
}

.test-dropdown {
  background: #05162f !important;
  border: 1px solid #4472cb !important;
}

.el-dropdown-menu__item {
  color: #47c4ff !important;
  background: #05162f !important;

  &:hover {
    background-color: #4472cb !important;
    color: #b2dde9 !important;
  }

  &:not(.is-disabled):focus {
    background-color: #4472cb !important;
    color: #b2dde9 !important;
  }
}

.popper__arrow {
  border-color: #4472cb !important;

  &::after {
    border-top-color: #46bcff !important;
    border-bottom-color: #46bcff !important;
  }
}

.timetext {
  position: absolute;
  top: 54px;
  right: 10px;
}

.custom-select-wrapper {
  position: relative;
  width: 120px;
}

.custom-select {
  width: 100%;
  min-width: 150px;
  font-size: 2rem;
  color: #ffffff;
  background-color: transparent;
  border: none;
  border-radius: 4px;
  appearance: none;
  outline: none;
  cursor: pointer;
  transition: all 0.3s;
}

.custom-select:hover {
  border-color: #5a8cff;
}

.custom-select:focus {
  border-color: #5a8cff;
  box-shadow: 0 0 5px rgba(71, 196, 255, 0.5);
}

.custom-select-wrapper::after {
  content: "";
  position: absolute;
  top: 50%;
  right: -40px;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 8px solid #fff;
  pointer-events: none;
}

.custom-select option {
  background-color: #05162f;
  color: #47c4ff;
  font-size: 1rem;
  border: none;
  text-align: center;
}

.custom-select option:hover,
.custom-select option:focus,
.custom-select option:checked {
  background-color: #4472cb !important;
  color: #fff !important;
  border: none;
}

.text-color {
  color: #e6f7ff;
}

.title {
  width: 100%;
  height: 80px;
  padding: 15px;
  display: flex;

  .transform {
    transform: rotateY(180deg);
  }

  .text {
    width: 500px;
    font-size: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .decoration {
    width: calc((100% - 500px) / 4);
  }

  .decoration-center {
    padding-top: 20px;
  }
}
</style>