<template>
  <div class="smtinstpro">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <el-form ref="formRef" :model="getDataText" :inline="true" @submit.prevent size="small">
        <el-form-item class="mb-2">
          <el-select v-model="getDataText.operationType" :placeholder="t('report.realTimeOrders.queryType')" style="width: 120px">
            <el-option v-for="item in selectType" :key="item.value" :label="item.lable" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item class="mb-2"
          v-show="getDataText.operationType == 'W' || getDataText.operationType == 'WD' || getDataText.operationType == 'WLD'">
          <el-input v-model="getDataText.workOrder" clearable :placeholder="t('report.realTimeOrders.inputOrderNo')"
            style="width: 400px" />
        </el-form-item>
        <el-form-item class="mb-2"
          v-show="getDataText.operationType == 'D' || getDataText.operationType == 'WD' || getDataText.operationType == 'WLD' || getDataText.operationType == 'LD'">
          <el-date-picker style="width: 200px" v-model="value1" format="YYYY-MM-DD" value-format="YYYY-MM-DD" :disabled-date="disabledDate"
            type="daterange" range-separator="-" :start-placeholder="t('publicText.startDate')"
            :end-placeholder="t('publicText.endDate')" />
        </el-form-item>
        <el-form-item class="mb-2"
          v-show="getDataText.operationType == 'LD' || getDataText.operationType == 'WLD'">
          <el-select style="width: 200px" v-model="getDataText.lineNumber" :placeholder="t('report.realTimeOrders.queryLine')">
            <el-option v-for="item in lineType" :key="item.value" :label="item.lable" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item class="mb-2">
          <el-select style="width: 200px" v-model="qtyType" @change="qtyChange">
            <el-option v-for="item in qtyList" :key="item.value" :label="item.lable" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item class="mb-2">
          <el-button type="primary" @click="getData">{{ t('publicText.query') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table ref="tableRef" :data="pagedTableData" :height="tableHeight" border stripe size="small" style="width: 100%">
        <el-table-column align="center" prop="OrderName" :label="t('report.realTimeOrders.workOrder')"
          :min-width="getColumnWidth('OrderName')" />
        <el-table-column align="center" prop="Laser-Bot" label="Laser-Bot" :min-width="getColumnWidth('Laser-Bot')" />
        <el-table-column align="center" prop="DEK-Bot" label="DEK-Bot" :min-width="getColumnWidth('DEK-Bot')" />
        <el-table-column align="center" prop="SPI-Bot" label="SPI-Bot" :min-width="getColumnWidth('SPI-Bot')" />
        <el-table-column align="center" prop="NPM-Bot" label="NPM-Bot" :min-width="getColumnWidth('NPM-Bot')" />
        <el-table-column align="center" prop="AOI-1-Bot" label="AOI-1-Bot" :min-width="getColumnWidth('AOI-1-Bot')" />
        <el-table-column align="center" prop="Reflow-Bot" label="Reflow-Bot" :min-width="getColumnWidth('Reflow-Bot')" />
        <el-table-column align="center" prop="AOI-2-Bot" label="AOI-2-Bot" :min-width="getColumnWidth('AOI-2-Bot')" />
        <el-table-column align="center" prop="ICT-Bot" label="ICT-Bot" :min-width="getColumnWidth('ICT-Bot')" />
        <el-table-column align="center" label="Laser-Top" :min-width="getColumnWidth('Laser-Top')">
          <template #default="scope">
            {{ scope.row['Laser-Top'] ? scope.row['Laser-Top'] : scope.row['Laser'] }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="DEK-Top" :min-width="getColumnWidth('DEK-Top')">
          <template #default="scope">
            {{ scope.row['DEK-Top'] ? scope.row['DEK-Top'] : scope.row['DEK'] }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="SPI-Top" :min-width="getColumnWidth('SPI-Top')">
          <template #default="scope">
            {{ scope.row['SPI-Top'] ? scope.row['SPI-Top'] : scope.row['SPI'] }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="NPM-TOP" :min-width="getColumnWidth('NPM-TOP')">
          <template #default="scope">
            {{ scope.row['NPM-Top'] ? scope.row['NPM-Top'] : scope.row['NPM'] }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="AOI-1-Top" :min-width="getColumnWidth('AOI-1-Top')">
          <template #default="scope">
            {{ scope.row['AOI-1-Top'] ? scope.row['AOI-1-Top'] : scope.row['AOI'] }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="Reflow-Top" :min-width="getColumnWidth('Reflow-Top')">
          <template #default="scope">
            {{ scope.row['Reflow-Top'] ? scope.row['Reflow-Top'] : scope.row['Reflow'] }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="AOI-2-Top" :min-width="getColumnWidth('AOI-2-Top')">
          <template #default="scope">
            {{ scope.row['AOI-2-Top'] ? scope.row['AOI-2-Top'] : scope.row['AOI-2'] }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="ICT-Top" :min-width="getColumnWidth('ICT-Top')">
          <template #default="scope">
            {{ scope.row['ICT-Top'] ? scope.row['ICT-Top'] : scope.row['ICT'] }}
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="margin-top: 8px">
        <el-pagination background :size="'small'" @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="currentPage" :page-size="pageSize" :page-sizes="[5, 10, 20, 50, 100]"
          layout="total,sizes, prev, pager, next, jumper" :total="tableData1.length" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { XY_PCBAHisQTYControl } from "@/api/report/index";
import { useTableColumnWidth } from "@/hooks/useTableColumnWidth";
import { useI18n } from "vue-i18n";
import { ElLoading, ElMessageBox, ElMessage } from "element-plus";
import { ref, reactive, computed, watch, onMounted, nextTick } from "vue";

const { t } = useI18n();

const tableRef = ref();
const tableHeight = ref(0);
const tableData1 = ref<any[]>([]);
const tableData = ref<any[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);
const value1 = ref<any[]>([]);
const qtyType = ref("all");
let loadingInstance: any = null;

const getDataText = reactive({
  workOrder: "",
  startDateTime: "",
  endDateTime: "",
  lineNumber: "",
  fixedint: 0,
  operationType: "W",
});

const selectType = [
  { lable: t("report.realTimeOrders.selectWo"), value: "W" },
  { lable: t("report.realTimeOrders.selectTime"), value: "D" },
  { lable: t("report.realTimeOrders.realTime"), value: "F" },
  { lable: t("report.realTimeOrders.timeLine"), value: "LD" },
  { lable: t("report.realTimeOrders.woTime"), value: "WD" },
  { lable: t("report.realTimeOrders.woLineTime"), value: "WLD" },
];

const lineType = [
  { lable: "Line1", value: "Line1" },
  { lable: "Line2", value: "Line2" },
  { lable: "Line3", value: "Line3" },
  { lable: "Line4", value: "Line4" },
  { lable: "Line5", value: "Line5" },
  { lable: "Line6", value: "Line6" },
  { lable: "Line7", value: "Line7" },
];

const qtyList = [
  { lable: t("report.realTimeOrders.totalCount"), value: "all" },
  { lable: t("report.realTimeOrders.passCount"), value: "pass" },
  { lable: t("report.realTimeOrders.failCount"), value: "fail" },
];

const { getColumnWidth } = useTableColumnWidth(tableRef, tableData1);

const pagedTableData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return tableData1.value.slice(start, end);
});

const disabledDate = (time: Date) => {
  return time.getTime() > Date.now();
};

const startLoading = () => {
  loadingInstance = ElLoading.service({
    lock: true,
    text: "加载中~",
    background: "rgba(0, 0, 0, 0.2)",
  });
};

const endLoading = () => {
  loadingInstance?.close();
};

const dataProse = (data: any[], type: string) => {
  const arr: any[] = [];
  data.forEach((item: any) => {
    const index = arr.findIndex((wo: any) => wo.OrderName == item.OrderName);
    if (index > -1) {
      arr[index][item.OperationName] = item[type];
    } else {
      arr.push({
        OrderName: item.OrderName,
        [item.OperationName]: item[type],
      });
    }
  });
  arr.sort((a: any, b: any) => {
    const aTime = a.OrderName.match(/\d+/g);
    const bTime = b.OrderName.match(/\d+/g);
    return aTime - bTime;
  });
  return arr;
};

const getData = () => {
  XY_PCBAHisQTYControl(getDataText).then((res: any) => {
    if (res.Success) {
      tableData.value = res.Data;
      if (qtyType.value == "all") {
        tableData1.value = dataProse(tableData.value, "sns");
      } else if (qtyType.value == "pass") {
        tableData1.value = dataProse(tableData.value, "sns2");
      } else if (qtyType.value == "fail") {
        tableData1.value = dataProse(tableData.value, "sns3");
      }
    
    } else {
      tableData.value = [];
      ElMessage.error(res.Message);
    }
  });
};

const qtyChange = (value: string) => {
  if (value == "all") {
    tableData1.value = dataProse(tableData.value, "sns");
  } else if (value == "pass") {
    tableData1.value = dataProse(tableData.value, "sns2");
  } else if (value == "fail") {
    tableData1.value = dataProse(tableData.value, "sns3");
  }
};

const handleSizeChange = (val: number) => {
  currentPage.value = 1;
  pageSize.value = val;
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
};

watch(value1, (value) => {
  if (value && value.length > 0) {
    getDataText.startDateTime = value[0];
    getDataText.endDateTime = value[1];
  } else {
    getDataText.startDateTime = "";
    getDataText.endDateTime = "";
  }
});

watch(() => getDataText.operationType, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    getDataText.workOrder = "";
    value1.value = [];
    getDataText.lineNumber = "";
    getDataText.fixedint = 0;
  }
});

onMounted(() => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 190;
  });
});
</script>

<style lang="scss" scoped>
.smtinstpro {
  padding: 8px;
}
</style>
