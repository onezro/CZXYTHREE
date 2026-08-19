<template>
  <div class="p-2">
    <el-card :body-style="{ padding: '8px' }">
      <div>
        <el-form ref="form" class="form" :inline="true" :model="getDataText" size="small">
          <el-form-item class="mb-2">
            <el-select v-model="getDataText.operationType" :placeholder="t('report.assemble.checkType')" style="width: 120px">
              <el-option v-for="item in inquireList" :key="item.value" :label="item.lable" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-show="getDataText.operationType == 'W'" class="mb-2">
            <el-input :placeholder="t('report.assemble.inputOrderNo')" clearable style="width: 400px"
              v-model="getDataText.workOrder" class="input-with-select">
            </el-input>
          </el-form-item>
          <el-form-item v-show="getDataText.operationType != 'W'" class="mb-2">
            <el-date-picker v-model="getDataText.date" type="datetimerange" range-separator="至"
              :start-placeholder="t('publicText.startDate')" :end-placeholder="t('publicText.endDate')"
              value-format="YYYY-MM-DD HH:mm:ss" :shortcuts="shortcuts"
              :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
              :clearable="false"></el-date-picker>
          </el-form-item>
          <el-form-item class="mb-2">
            <el-button type="primary" @click="getAllData()">{{ t('publicText.query') }}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table ref="tableRef" :data="pagedTableData" :height="tableHeight" size="small" border stripe
        style="width: 100%">
        <el-table-column prop="OrderNumber" :label="t('report.assemble.workOrder')"
          :min-width="getColumnWidth('OrderNumber')"></el-table-column>
        <el-table-column prop="FinalYield" :label="t('report.assemble.finalYield')"
          :min-width="getColumnWidth('FinalYield')"></el-table-column>
        <el-table-column prop="FirstYield" :label="t('report.assemble.firstYield')"
          :min-width="getColumnWidth('FirstYield')"></el-table-column>
        <el-table-column prop="PlannedStartTime" :label="t('report.assemble.plannedStartTime')"
          :min-width="getColumnWidth('PlannedStartTime')"></el-table-column>
        <el-table-column prop="PlannedFinishTime" :label="t('report.assemble.plannedFinishTime')"
          :min-width="getColumnWidth('PlannedFinishTime')"></el-table-column>
        <el-table-column prop="ActualStarted" :label="t('report.assemble.actualStarted')"
          :min-width="getColumnWidth('ActualStarted')"></el-table-column>
        <el-table-column prop="ActualFinished" :label="t('report.assemble.actualFinished')"
          :min-width="getColumnWidth('ActualFinished')"></el-table-column>
        <el-table-column prop="QuantityOrdered" :label="t('report.assemble.quantityOrdered')"
          :min-width="getColumnWidth('QuantityOrdered')"></el-table-column>
        <el-table-column prop="QuantityProcessed" :label="t('report.assemble.quantityProcessed')"
          :min-width="getColumnWidth('QuantityProcessed')"></el-table-column>
      </el-table>
      <div class="block" style="margin-top: 15px">
        <el-pagination :size="'small'" background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="currentPage" :page-size="pageSize" :page-sizes="[5, 10, 20, 50, 100]"
          layout="total,sizes, prev, pager, next, jumper" :total="tableData.length">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, nextTick } from "vue";
import { ElLoading, ElMessage } from "element-plus";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { XY_Assembly_OrderStatus } from "@/api/report/index";
import { shortcuts, setTodayDate, setLastDate } from "@/utils/dataMenu";
import { useTableColumnWidth } from "@/hooks/useTableColumnWidth";

const { t } = useI18n();
const route = useRoute();

const tableRef = ref();
const tableData = ref<any[]>([]);

const getDataText = reactive<any>({
  seiralNumber: "",
  date: [],
  workOrder: "",
  operationType: "S",
});

const currentPage = ref(1);
const pageSize = ref(10);
const tableHeight = ref(0);

const inquireList = [
  {
    lable: t("report.assemble.woQuery"),
    value: "W",
  },
  {
    lable: t("report.assemble.timeQuery"),
    value: "S",
  },
];

const excludeLabels = [t("publicText.index")];

const { getColumnWidth } = useTableColumnWidth(tableRef, tableData, {
  excludeLabels,
});

const pagedTableData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return tableData.value.slice(start, end);
});

watch(
  () => getDataText.operationType,
  (newValue) => {
    if (newValue == "W") {
      getDataText.date = [];
    } else {
      getDataText.workOrder = "";
    }
  }
);

const getData = () => {
  return new Promise<void>((resolve) => {
    XY_Assembly_OrderStatus({
      operationType: "Q1",
      orderName: getDataText.workOrder,
      startTime: "",
      endTime: "",
    })
      .then((res: any) => {
        if (res.Success) {
          resolve();
          tableData.value.push(...res.Data);
        } else {
         
          ElMessage({
            message: res.Message,
            type: "error",
          });
          tableData.value = [];
        }
      })
  });
};

const getDateData = () => {
  return new Promise<void>((resolve) => {
    XY_Assembly_OrderStatus({
      operationType: "Q2",
      orderName: "",
      startTime: getDataText.date[0],
      endTime: getDataText.date[1],
    })
      .then((res: any) => {
        if (res.Success) {
          resolve();
          tableData.value.push(...res.Data);
        } else {
          ElMessage({
            message: res.Message,
            type: "error",
          });
        
         
          tableData.value = [];
        }
      })
      
  });
};

const getAllData = async () => {

  tableData.value = [];
  if (getDataText.operationType == "W") {
    await getData();
  } else {
    await getDateData();
  }
  currentPage.value = 1;

};

const handleSizeChange = (val: number) => {
  currentPage.value = 1;
  pageSize.value = val;
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
};




onMounted(() => {
  getDataText.seiralNumber = route.query.SerialNumber as string;
  getDataText.date = [setLastDate(), setTodayDate()];
  nextTick(() => {
    tableHeight.value = window.innerHeight - 190;
  });
});
</script>

<style lang="scss" scoped>
.smtinstpro {
  padding: 20px;
}
</style>
