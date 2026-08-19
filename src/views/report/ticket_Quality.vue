<template>
  <div class="quality">
    <div class="table_header">
      <el-form ref="formRef" class="form" :inline="true" :model="getDataText" size="small" @submit.prevent>
        <el-form-item>
          <el-select v-model="getDataText.operationType" :placeholder="t('report.ticketQuality.queryType')" style="width: 120px">
            <el-option v-for="item in selectType" :key="item.value" :label="item.lable" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-show="
            getDataText.operationType == 'W' ||
            getDataText.operationType == 'WD' ||
            getDataText.operationType == 'WLD'
          "
        >
          <el-input :placeholder="t('report.ticketQuality.inputOrderNo')" clearable style="width: 400px"
            v-model="getDataText.workOrder" class="input-with-select" />
        </el-form-item>
        <el-form-item
          v-show="
            getDataText.operationType == 'D' ||
            getDataText.operationType == 'WD' ||
            getDataText.operationType == 'WLD' ||
            getDataText.operationType == 'LD'
          "
        >
          <el-date-picker v-model="value1" format="YYYY-MM-DD" value-format="YYYY-MM-DD" type="daterange"
            :range-separator="t('publicText.to')" :start-placeholder="t('publicText.startDate')"
            :end-placeholder="t('publicText.endDate')" :disabled-date="disabledDate" />
        </el-form-item>
        <el-form-item
          v-show="
            getDataText.operationType == 'LD' ||
            getDataText.operationType == 'WLD'
          "
        >
          <el-select v-model="getDataText.lineNumber" :placeholder="t('report.ticketQuality.queryLine')">
            <el-option v-for="item in lineType" :key="item.value" :label="item.lable" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getData()">{{ t('publicText.query') }}</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="chart" :style="{ height: tableHeight1 }">
      <quality-char ref="iaSon" :echarData="echarData"></quality-char>
    </div>
    <div>
      <el-table ref="tableRef" :data="pagedTableData" border :height="tableHeight" size="small">
        <el-table-column align="center" prop="OrderName" :label="t('report.ticketQuality.selectWo')"
          :min-width="getColumnWidth('OrderName')" />
        <el-table-column align="center" prop="Laser-Bot" label="Laser-Bot"
          :min-width="getColumnWidth('Laser-Bot')" />
        <el-table-column align="center" prop="DEK-Bot" label="DEK-Bot"
          :min-width="getColumnWidth('DEK-Bot')" />
        <el-table-column align="center" prop="SPI-Bot" label="SPI-Bot"
          :min-width="getColumnWidth('SPI-Bot')" />
        <el-table-column align="center" prop="NPM-Bot" label="NPM-Bot"
          :min-width="getColumnWidth('NPM-Bot')" />
        <el-table-column align="center" prop="AOI-1-Bot" label="AOI-1-Bot"
          :min-width="getColumnWidth('AOI-1-Bot')" />
        <el-table-column align="center" prop="Reflow-Bot" label="Reflow-Bot"
          :min-width="getColumnWidth('Reflow-Bot')" />
        <el-table-column align="center" prop="AOI-2-Bot" label="AOI-2-Bot"
          :min-width="getColumnWidth('AOI-2-Bot')" />
        <el-table-column align="center" prop="ICT-Bot" label="ICT-Bot"
          :min-width="getColumnWidth('ICT-Bot')" />
        <el-table-column align="center" prop="Laser-Top" label="Laser-Top"
          :min-width="getColumnWidth('Laser-Top')">
          <template #default="scope">
            {{ scope.row['Laser-Top'] ? scope.row['Laser-Top'] : scope.row['Laser'] }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="DEK-Top" :min-width="getColumnWidth('DEK-Top')">
          <template #default="scope">
            {{ scope.row['DEK-Top'] ? scope.row['DEK-Top'] : scope.row['DEK'] }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="SPI-Top" label="SPI-Top"
          :min-width="getColumnWidth('SPI-Top')">
          <template #default="scope">
            {{ scope.row['SPI-Top'] ? scope.row['SPI-Top'] : scope.row['SPI'] }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="NPM-Top" label="NPM-Top"
          :min-width="getColumnWidth('NPM-Top')">
          <template #default="scope">
            {{ scope.row['NPM-Top'] ? scope.row['NPM-Top'] : scope.row['NPM'] }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="Reflow-Top" label="Reflow-Top"
          :min-width="getColumnWidth('Reflow-Top')">
          <template #default="scope">
            {{ scope.row['Reflow-Top'] ? scope.row['Reflow-Top'] : scope.row['Reflow'] }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="AOI-1-Top" label="AOI-1-Top"
          :min-width="getColumnWidth('AOI-1-Top')">
          <template #default="scope">
            {{ scope.row['AOI-1-Top'] ? scope.row['AOI-1-Top'] : scope.row['AOI-1'] }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="AOI-2-Top" label="AOI-2-Top"
          :min-width="getColumnWidth('AOI-2-Top')">
          <template #default="scope">
            {{ scope.row['AOI-2-Top'] ? scope.row['AOI-2-Top'] : scope.row['AOI-2'] }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="ICT-Top" label="ICT-Top"
          :min-width="getColumnWidth('ICT-Top')">
          <template #default="scope">
            {{ scope.row['ICT-Top'] ? scope.row['ICT-Top'] : scope.row['ICT'] }}
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="margin-top: 15px">
        <el-pagination align="center" background size="small" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize"
          :page-sizes="[5, 10, 20, 50, 100]" layout="total,sizes, prev, pager, next, jumper"
          :total="tableData.length" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import qualityChar from "@/components/char/quality_char.vue";
import { XY_PCBAHisYieldControl } from "@/api/report/index";
import { useTableColumnWidth } from "@/hooks/useTableColumnWidth";
import { useI18n } from "vue-i18n";
import { ElMessageBox, ElLoading,ElMessage } from "element-plus";
import { ref, reactive, computed, onMounted, onUnmounted, watch } from "vue";

const { t } = useI18n();

const tableRef = ref();
const tableHeight = ref(0);
const tableHeight1 = ref("0px");
const tableData = ref<any[]>([]);
const echarData = ref<any[]>([]);
const value1 = ref("");
const currentPage = ref(1);
const pageSize = ref(10);
let loadingInstance: any = null;

const getDataText = reactive({
  workOrder: "",
  startDateTime: "",
  endDateTime: "",
  lineNumber: 0,
  fixedint: 0,
  operationType: "W",
});

const selectType = [
  { lable: t("report.ticketQuality.selectWo"), value: "W" },
  { lable: t("report.ticketQuality.selectTime"), value: "D" },
  { lable: t("report.ticketQuality.realTime"), value: "F" },
  { lable: t("report.ticketQuality.timeLine"), value: "LD" },
  { lable: t("report.ticketQuality.woTime"), value: "WD" },
  { lable: t("report.ticketQuality.woLineTime"), value: "WLD" },
];

const lineType = [
  { lable: "Line1", value: 1 },
  { lable: "Line2", value: 2 },
  { lable: "Line3", value: 3 },
];

const disabledDate = (time: Date) => {
  return time.getTime() > Date.now();
};

const { getColumnWidth } = useTableColumnWidth(tableRef, tableData);

const pagedTableData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return tableData.value.slice(start, end);
});

const startLoading = () => {
  loadingInstance = ElLoading.service({ lock: true, text: "加载中~", background: "rgba(0, 0, 0, 0.2)" });
};
const endLoading = () => { loadingInstance?.close(); };

watch(value1, (value: any) => {
  if (value && value.length >= 2) {
    getDataText.startDateTime = value[0];
    getDataText.endDateTime = value[1];
  }
});

const dataProse = (data: any[]) => {
  const arr: any[] = [];
  data.forEach((item: any) => {
    const index = arr.findIndex((wo) => wo.OrderName == item.OrderName);
    if (index > -1) {
      arr[index][item.OperationName] = item.Yield;
    } else {
      arr.push({
        OrderName: item.OrderName,
        [item.OperationName]: item.Yield,
      });
    }
  });
  arr.sort((a, b) => {
    const aTime = a.OrderName.match(/\d+/g);
    const bTime = b.OrderName.match(/\d+/g);
    return aTime - bTime;
  });
  tableData.value = arr;
  const arr2 = arr.map((item) => {
    return {
      name: item.OrderName,
      type: "line",
      showSymbol: true,
      symbol: "circle",
      symbolSize: 8,
      data: [
        item["Laser-Bot"],
        item["DEK-Bot"],
        item["NPM-Bot"],
        item["AOI-1-Bot"],
        item["Reflow-Bot"],
        item["AOI-2-Bot"],
        item["ICT-Bot"],
        item["Laser-Top"] ? item["Laser-Top"] : item["Laser"],
        item["SPI-Top"] ? item["SPI-Top"] : item["SPI"],
        item["SPI-Top"] ? item["SPI-Top"] : item["SPI"],
        item["NPM-Top"] ? item["NPM-Top"] : item["NPM"],
        item["AOI-1-Top"] ? item["AOI-1-Top"] : item["AOI-1"],
        item["Reflow-Top-Top"] ? item["Reflow-Top-Top"] : item["Reflow-Top-1"],
        item["AOI-2-Top"] ? item["AOI-2-Top"] : item["AOI-2-1"],
        item["ICT-Top"] ? item["ICT-Top"] : item["ICT-1"],
      ],
    };
  });
  echarData.value = arr2;
  endLoading();
};

const getData = () => {
 
  XY_PCBAHisYieldControl(getDataText).then((res: any) => {
    if (res.Success) {
      dataProse(res.Data);
    } else {
     
      ElMessage.error(res.Message);
    }
  });
};

const handleSizeChange = (val: number) => {
  currentPage.value = 1;
  pageSize.value = val;
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
};

const getScreenHeight1 = () => {
  const innerHeight = window.innerHeight || document.documentElement.innerHeight || document.body.clientHeight;
  tableHeight.value = (innerHeight - 210) * 0.5 - 50;
  tableHeight1.value = (innerHeight - 210) * 0.5 + "px";
};

onMounted(() => {
  getScreenHeight1();
  window.addEventListener("resize", getScreenHeight1, false);
});

onUnmounted(() => {
  window.removeEventListener("resize", getScreenHeight1, false);
});
</script>

<style lang="scss" scoped>
.quality {
  padding: 20px;
  .form {
    display: flex;
  }
}
</style>
