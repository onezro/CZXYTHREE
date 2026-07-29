<template>
  <div class="smtinstpro">
    <el-card>
      <el-form ref="formRef" class="form" :model="addForm" label-width="auto">
        <el-form-item :label="t('smtset.missingDataEntry.orderName')">
          <el-input
            :placeholder="t('smtset.missingDataEntry.orderName')"
            v-model="addForm.orderName"
            class="input-with-select"
            style="width: 300px;"
          ></el-input>
        </el-form-item>
        <el-form-item :label="t('smtset.missingDataEntry.pcbId')">
          <el-input
            :placeholder="t('smtset.missingDataEntry.pcbId')"
            v-model="addForm.pcbId"
            class="input-with-select"
            style="width: 300px;"
          ></el-input>
        </el-form-item>
        <el-form-item :label="t('smtset.missingDataEntry.mcId')">
          <el-input
            :placeholder="t('smtset.missingDataEntry.mcId')"
            v-model="addForm.mcId"
            class="input-with-select"
            style="width: 300px;"
          ></el-input>
        </el-form-item>
        <el-form-item :label="t('smtset.missingDataEntry.startTime')">
          <el-date-picker
            v-model="addForm.startTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            :placeholder="t('smtset.missingDataEntry.selectDateTime')"
            style="width: 300px;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item :label="t('smtset.missingDataEntry.status')">
          <el-select v-model="addForm.status" :placeholder="t('smtset.missingDataEntry.status')" style="width: 300px;">
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="t('smtset.missingDataEntry.operationType')">
          <el-select v-model="addForm.operationType" :placeholder="t('smtset.missingDataEntry.operationType')" style="width: 300px;">
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="entryData">{{ t('smtset.missingDataEntry.submit') }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { XY_Prod_AddMissSN } from "@/api/smtSet/missingDataEntry";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
import { reactive, ref } from "vue";
import { missTime } from "@/utils/index";

const { t } = useI18n();

const formRef = ref();
const addForm = reactive({
  orderName: "",
  pcbId: "",
  mcId: "",
  startTime: "",
  status: "PASS",
  operationType: "GI",
});

const statusList = [
  { value: "PASS" },
  { value: "FAIL" },
];

const typeList = [
  { value: "GI", label: t("smtset.missingDataEntry.typeGI") },
  { value: "RI", label: t("smtset.missingDataEntry.typeRI") },
];

const entryData = () => {
  if (!addForm.pcbId || !addForm.mcId || !addForm.startTime) {
    ElMessage.warning(t("smtset.missingDataEntry.completeValue"));
    return;
  } else if (addForm.operationType === "RI" && !addForm.orderName) {
    ElMessage.warning(t("smtset.missingDataEntry.enterOrderName"));
    return;
  }

  XY_Prod_AddMissSN({
    ...addForm,
    startTime: missTime(addForm.startTime),
  })
    .then((res: any) => {
      if (res.Status === "OK") {
        ElMessage.success(t("smtset.missingDataEntry.entrySuccess"));
      } else {
        ElMessage.error(res.Message);
      }
    })
    .catch((res: any) => {
      ElMessage.error(res.message || t("smtset.missingDataEntry.error"));
    });
};
</script>

<style lang="scss" scoped></style>