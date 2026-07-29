<template>
  <div class="p-2">
    <el-row :gutter="20">
      <el-col :span="15">
        <el-form class="inbound" label-position="left" :model="form" ref="formRef" label-width="120px"
          @submit.prevent>
          <el-form :inline="true">
            <el-form-item :label="t('assemble.processSumbit.reworkType')" label-width="120px">
              <el-select v-model="form.ReworkType" :placeholder="t('publicText.pleaseSelect')" style="width: 200px">
                <el-option v-for="item in repairList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="t('assemble.processSumbit.desc')">
              <el-input style="width: 350px" v-model="form.ReworkRemark" ref="inputRef" placeholder=""
                v-show="form.ReworkType == 2"></el-input>
            </el-form-item>
            <el-form-item label="">
              <el-button type="primary" @click="refresh">{{ t('publicText.reset') }}</el-button>
            </el-form-item>
          </el-form>
          <el-form-item :label="t('assemble.processSumbit.scanSn')">
            <el-input class="SN" v-model="form.SN" ref="inputRef"
              :placeholder="t('assemble.processSumbit.scanPlaceholder')" @keyup.enter="changeSubmit"></el-input>
          </el-form-item>
          <el-form-item :label="t('assemble.processSumbit.currentSn')">
            <el-input v-model="olderSN" disabled></el-input>
          </el-form-item>
          <el-form-item :label="t('assemble.processSumbit.station')">
            <span style="font-size: 28px; font-weight: bolder">{{ textForm.StationCode }}</span>
          </el-form-item>
          <el-form-item :label="t('assemble.processSumbit.workOrder')">
            <span style="font-size: 28px; font-weight: bolder">{{ textForm.WorkOrder }}</span>
          </el-form-item>
          <el-form-item :label="t('assemble.processSumbit.productCode')">
            <span style="font-size: 28px; font-weight: bolder">{{ textForm.ProductCode }}</span>
          </el-form-item>
          <el-form-item :label="t('assemble.processSumbit.productName')">
            <span style="font-size: 28px; font-weight: bolder">{{ textForm.ProductName }}</span>
          </el-form-item>
          <el-form-item :label="t('assemble.processSumbit.productSpec')">
            <span style="font-size: 28px; font-weight: bolder">{{ textForm.ProductSpec }}</span>
          </el-form-item>
          <el-form-item :label="t('assemble.processSumbit.message')">
            <el-input v-model="textMessage" disabled type="textarea" :rows="4" :class="messageClass"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="9">
        <el-table :data="tableData" border :height="tableHeight" stripe size="small">
          <el-table-column :label="t('publicText.index')" type="index" align="center" width="55" />
          <el-table-column prop="ScanSN" :label="t('assemble.processSumbit.sn')" width="210"> </el-table-column>
          <el-table-column prop="ReworkMethod" :label="t('assemble.processSumbit.reworkMethod')">
          </el-table-column>
          <el-table-column prop="ReworkUser" :label="t('assemble.processSumbit.reworkUser')" width="100">
          </el-table-column>
          <el-table-column prop="ReworkTime" :label="t('assemble.processSumbit.reworkTime')" width="150">
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { processSumbit, AssemblyReworkHistory } from "@/api/assemble/processSumbit";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
import { ref, reactive, computed, onMounted, onBeforeUnmount, nextTick } from "vue";
import dayjs from "dayjs";

const { t } = useI18n();
const userStore = useUserStoreWithOut();

const form = reactive({
  SN: "",
  ReworkType: null as number | null,
  ReworkMethod: "",
  ReworkRemark: "",
  ReworkUser: userStore.getUserInfo || "",
  ReworkTime: "",
});

const textMessage = ref("");
const isSuccess = ref(true);
const olderSN = ref("");
const textForm = reactive({
  WorkOrder: "",
  ProductCode: "",
  ProductName: "",
  ProductSpec: "",
  StationCode: "",
});
const tableHeight = ref(0);
const tableData = ref<any[]>([]);
const inputRef = ref();

const repairList = [
  { label: t("assemble.processSumbit.misjudgment"), value: 1 },
  { label: t("assemble.processSumbit.repair"), value: 2 },
  { label: t("assemble.processSumbit.reworkUnbind"), value: 3 },
];

const messageClass = computed(() => {
  return isSuccess.value ? "success-message" : "error-message";
});

const returnType = (num: number) => {
  const item = repairList.find((i) => i.value == num);
  return item ? item.label : "";
};

const getData = (data: any) => {
  AssemblyReworkHistory(data).then((res: any) => {
    tableData.value = res.Data || [];
  });
};

const refresh = () => {
  form.SN = "";
  form.ReworkRemark = "";
  form.ReworkType = null;
  form.ReworkUser = userStore.getUserInfo || "";
  textForm.WorkOrder = "";
  textForm.ProductCode = "";
  textForm.ProductName = "";
  textForm.ProductSpec = "";
  textForm.StationCode = "";
};

const changeSubmit = () => {
  if (form.ReworkType == null || (form.ReworkType == 2 && form.ReworkRemark == "")) {
    ElMessage.warning(t("assemble.processSumbit.selectMethod"));
    form.SN = "";
    return;
  }
  form.ReworkMethod = returnType(form.ReworkType);
  form.ReworkTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  processSumbit(form).then((res: any) => {
    isSuccess.value = res.Success;
    textMessage.value = res.Msg;
    olderSN.value = form.SN;
    getData({ ReworkTime: dayjs().format("YYYY-MM-DD") });
    if (res.Data != null) {
      let data = JSON.parse(res.Data);
      textForm.WorkOrder = data.WorkOrder || "";
      textForm.ProductCode = data.ProductCode || "";
      textForm.ProductName = data.ProductName || "";
      textForm.ProductSpec = data.ProductSpec || "";
      textForm.StationCode = data.StationCode || "";
    } else {
      textForm.WorkOrder = "";
      textForm.ProductCode = "";
      textForm.ProductName = "";
      textForm.ProductSpec = "";
      textForm.StationCode = "";
    }
    form.SN = "";
    nextTick(() => {
      inputRef.value?.focus();
    });
  });
};

const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 108;
  });
};

onMounted(() => {
  getScreenHeight();
  getData({ ReworkTime: dayjs().format("YYYY-MM-DD") });
  window.addEventListener("resize", getScreenHeight);
  nextTick(() => {
    inputRef.value?.focus();
  });
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", getScreenHeight);
});
</script>

<style lang="scss">
.inbound .el-form-item__label {
  font-size: 20px;
}

.inbound .el-input__inner {
  font-size: 28px;
  font-weight: bolder;
}

.inbound .el-textarea__inner {
  font-size: 28px;
  font-weight: bolder;
}

.success-message .el-textarea__inner {
  color: #67c23a !important;
}

.error-message .el-textarea__inner {
  color: #f56c6c !important;
}
</style>
