<template>
  <div class="smtinstpro">
    <el-card>
      <el-form ref="formRef" class="form" :inline="true" :model="getDataText">
        <el-form-item>
          <el-input
            :placeholder="t('smtset.queryMissingData.orderName')"
            v-model="getDataText.orderName"
            class="input-with-select"
            style="width: 300px; margin-right: 20px"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="getDataText.operationName" :placeholder="t('smtset.queryMissingData.operationName')">
            <el-option
              v-for="item in orderList"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getData">{{ t('smtset.queryMissingData.query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="openAdd">{{ t('smtset.queryMissingData.batchEntry') }}</el-button>
        </el-form-item>
      </el-form>

      <div class="data">
        <el-row :gutter="20">
          <el-col
            :span="8"
            class="item"
            v-for="(item, index) in missingList"
            :key="index"
          >
            <div>
              {{ item.SerialNumber }}{{ item.StatusCode ? `(${item.StatusCode})` : "" }}
            </div>
            <el-button
              type="primary"
              size="small"
              @click="toQuatrace(item.SerialNumber)"
            >{{ t('smtset.queryMissingData.jump') }}</el-button>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <el-dialog :title="t('smtset.queryMissingData.batchEntry')" v-model="addVisible">
      <el-form ref="addFormRef" label-width="80px">
        <el-form-item :label="t('smtset.missingDataEntry.mcId')">
          <el-input
            :placeholder="t('smtset.missingDataEntry.mcId')"
            v-model="addForm.mcId"
            class="input-with-select"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="t('smtset.missingDataEntry.startTime')">
          <el-date-picker
            v-model="addForm.startTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            :placeholder="t('smtset.missingDataEntry.selectDateTime')"
            style="width: 300px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item :label="t('smtset.missingDataEntry.status')">
          <el-select
            v-model="addForm.status"
            :placeholder="t('smtset.missingDataEntry.status')"
            style="width: 300px"
          >
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="t('smtset.missingDataEntry.operationType')">
          <el-select
            v-model="addForm.operationType"
            :placeholder="t('smtset.missingDataEntry.operationType')"
            style="width: 300px"
          >
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addVisible = false">{{ t('smtset.missingDataEntry.cancel') }}</el-button>
          <el-button type="primary" @click="addData()">
            {{ t('smtset.missingDataEntry.confirm') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { XY_Prod_MissSNs, XY_Prod_AddMissSNNew } from "@/api/smtSet/queryMissingData";
import { ElMessage, ElMessageBox, ElNotification } from "element-plus";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { reactive, ref } from "vue";
import { missTime } from "@/utils/index";

const { t } = useI18n();
const router = useRouter();

const formRef = ref();
const addFormRef = ref();

const getDataText = reactive({
  orderName: "",
  operationName: "",
  operationType: "Q",
});

const orderList = [
  { name: "Laser-Bot" },
  { name: "DEK-Bot" },
  { name: "SPI-Bot" },
  { name: "NPM-Bot" },
  { name: "AOI-1-Bot" },
  { name: "Reflow-Bot" },
  { name: "AOI-2-Bot" },
  { name: "ICT-Bot" },
  { name: "Laser-Top" },
  { name: "DEK-Top" },
  { name: "SPI-Top" },
  { name: "NPM-Top" },
  { name: "AOI-1-Top" },
  { name: "Reflow-Top" },
  { name: "AOI-2-Top" },
  { name: "ICT-Top" },
];

const missingList = ref<any[]>([]);
const addVisible = ref(false);

const addForm = reactive({
  orderName: "",
  pcbId: [] as string[],
  mcId: 0,
  startTime: "",
  status: "",
  operationType: "",
});

const typeList = [
  { value: "GI", label: t("smtset.missingDataEntry.typeGI") },
  { value: "RI", label: t("smtset.missingDataEntry.typeRI") },
];

const statusList = [
  { value: "PASS" },
  { value: "FAIL" },
];

const getData = () => {
  if (getDataText.orderName === "" || getDataText.operationType === "") {
    ElMessageBox.alert(t("smtset.queryMissingData.queryFail"), t("smtset.queryMissingData.error"), {
      confirmButtonText: t("smtset.missingDataEntry.confirm"),
    });
    return;
  }

  XY_Prod_MissSNs(getDataText)
    .then((res: any) => {
      if (res.Status === "OK") {
        missingList.value = res.DataList || [];
      } else {
        missingList.value = [];
      }
    })
    .catch(() => {
      missingList.value = [];
    });
};

const toQuatrace = (SerialNumber: string) => {
  router.push({ path: "/report/quatrace", query: { SerialNumber } });
};

const openAdd = () => {
  if (getDataText.operationName != "" || missingList.value.length != 0) {
    addVisible.value = true;
    addForm.orderName = getDataText.orderName;
    addForm.pcbId = [];
    const seen = new Set();
    missingList.value.forEach((item) => {
      if (!seen.has(item.SerialNumber)) {
        seen.add(item.SerialNumber);
        addForm.pcbId.push(item.SerialNumber);
      }
    });
  } else {
    ElNotification.warning({
      title: t("smtset.missingDataEntry.tips"),
      message: t("smtset.queryMissingData.searchFirst"),
    });
  }
};

const addData = () => {
  XY_Prod_AddMissSNNew({
    ...addForm,
    startTime: missTime(addForm.startTime),
  }).then((res: any) => {
    if (res.Status == "OK") {
      ElMessage.success(res.Status);
      addVisible.value = false;
    } else {
      ElMessageBox.alert(res.Message, t("smtset.queryMissingData.error"), {
        confirmButtonText: t("smtset.missingDataEntry.confirm"),
      });
    }
  });
};
</script>

<style lang="scss" scoped></style>