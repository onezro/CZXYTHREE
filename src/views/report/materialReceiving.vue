<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <div>
        <el-form ref="formRef" :model="getForm" :inline="true" @submit.prevent size="small">
          <el-form-item label="" class="mb-2">
            <el-select v-model="searchType" placeholder="" @change="typeChange" style="width: 120px">
              <el-option v-for="item in inquireList" :key="item.value" :label="item.lable" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" class="mb-2" v-show="searchType == 'W'"><el-input v-model="getForm.mfgordername"
              clearable :placeholder="t('report.materialReceiving.inputWo')" style="width: 300px" @clear="clearInput"
              @keyup.enter="getData" /></el-form-item>
          <el-form-item label="" class="mb-2" v-show="searchType == 'R'"><el-input v-model="getForm.reelid" clearable
              :placeholder="t('report.materialReceiving.inputMaterialId')" style="width: 300px" @clear="clearInput"
              @keyup.enter="getData" /></el-form-item>
          <el-form-item class="mb-2">
            <el-button type="primary" @click="getData()" icon="Search">{{ t('publicText.query')
              }}</el-button></el-form-item>
        </el-form>
      </div>
      <el-table ref="tableRef" :data="pagedTableData" border :height="tableHeight" style="width: 100%" size="small"
        tooltip-effect="light">
        <el-table-column :label="t('publicText.index')" width="55" align="center">
          <template #default="scope">
            {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="wo" :label="t('report.materialReceiving.wo')" :min-width="getColumnWidth('wo')" />
        <el-table-column align="center" prop="OldCompId" :label="t('report.materialReceiving.oldCompId')"
          :min-width="getColumnWidth('OldCompId')" />
        <el-table-column prop="CompId" :label="t('report.materialReceiving.currentCompId')"
          :min-width="getColumnWidth('CompId')" />
        <el-table-column align="center" prop="Timestamp" :label="t('report.materialReceiving.splicingTime')"
          :min-width="getColumnWidth('Timestamp')" />
        <el-table-column align="center" prop="CompCode" :label="t('report.materialReceiving.compCode')"
          :min-width="getColumnWidth('CompCode')" />
        <el-table-column align="center" prop="CompName" :label="t('report.materialReceiving.compName')"
          :min-width="getColumnWidth('CompName')" />
        <el-table-column align="center" prop="CompDesc" :label="t('report.materialReceiving.compDesc')"
          :min-width="getColumnWidth('CompDesc')" />
      </el-table>
      <div class="block" style="margin-top: 8px">
        <el-pagination size="small" background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="currentPage" :page-size="pageSize" :page-sizes="[5, 10, 20, 50, 100]"
          layout="total,sizes, prev, pager, next, jumper" :total="tableData.length">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount, nextTick } from "vue";
import { ElNotification } from "element-plus";
import { useI18n } from "vue-i18n";
import { GetWoOperatorTrace } from "@/api/report/index";
import { useTableColumnWidth } from "@/hooks/useTableColumnWidth";
import dayjs from "dayjs";

const { t } = useI18n();

const formRef = ref();
const tableRef = ref();
const tableData = ref<any[]>([]);

const getForm = reactive<any>({
  mfgordername: "",
  reelid: "",
});

const tableHeight = ref(0);
const currentPage = ref(1);
const pageSize = ref(20);

const inquireList = [
  {
    lable: t("report.materialReceiving.woNo"),
    value: "W",
  },
  {
    lable: t("report.materialReceiving.materialId"),
    value: "R",
  },
];

const searchType = ref("W");

const excludeLabels = [t("publicText.index")];

const { getColumnWidth } = useTableColumnWidth(tableRef, tableData, {
  excludeLabels,
});

const pagedTableData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return tableData.value.slice(start, end);
});

const getData = () => {
  if (searchType.value == "R" && getForm.reelid == "") {
    ElNotification({
      title: t("message.tipTitle"),
      message: t("report.materialReceiving.inputMaterialId"),
      type: "error",
    });
    return;
  }
  if (searchType.value == "W" && getForm.mfgordername == "") {
    ElNotification({
      title: t("message.tipTitle"),
      message: t("report.materialReceiving.inputWo"),
      type: "error",
    });
    return;
  }
  GetWoOperatorTrace(getForm).then((res: any) => {
    if (res.Success) {
      tableData.value = res.Data.map((item: any) => {
        item.Timestamp =
          item.Timestamp == null
            ? ""
            : dayjs(item.Timestamp).format("YYYY-MM-DD HH:mm:ss");
        return item;
      });
    } else {
      tableData.value = [];
      ElNotification({
        title: t("message.tipTitle"),
        message: res.Msg,
        type: "error",
      });
    }
  });
};

const typeChange = () => {
  getForm.mfgordername = "";
  getForm.reelid = "";
};

const clearInput = () => {
  formRef.value?.resetFields();
  tableData.value = [];
};

const handleSizeChange = (value: number) => {
  pageSize.value = value;
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
};

const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 210;
  });
};

onMounted(() => {
  getScreenHeight();
  window.addEventListener("resize", getScreenHeight);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", getScreenHeight);
});
</script>
