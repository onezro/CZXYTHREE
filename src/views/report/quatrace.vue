<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <div>
        <el-form ref="form":inline="true" :model="getDataText" @submit.prevent size="small">
          <el-form-item class="mb-2">
            <el-select v-model="SearchText" :placeholder="t('report.quatrace.checkType')" style="width: 200px">
              <el-option v-for="item in inquireList" :key="item.value" :label="item.lable" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-show="SearchText == 'W'" class="mb-2">
            <el-input :placeholder="t('report.quatrace.inputOrderNo')" clearable style="width: 400px"
              v-model="searchForm.SearchModel.OrderNo" class="input-with-select">
            </el-input>
          </el-form-item>
          <el-form-item v-show="SearchText == 'S'" class="mb-2">
            <el-input :placeholder="t('report.quatrace.inputSerialNumber')" clearable style="width: 400px"
              v-model="searchForm.SearchModel.ContainerName" class="input-with-select">
            </el-input>
          </el-form-item>
          <el-form-item class="mb-2">
            <el-date-picker v-show="SearchText == 'D'" v-model="dateValue" type="datetimerange" range-separator="至"
              start-placeholder="开始日期" end-placeholder="结束日期" size="small" value-format="YYYY-MM-DD HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']" :clearable="false">
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="t('report.quatrace.line')" prop="line" class="mb-2">
            <el-select v-model="searchForm.SearchModel.LineName" :placeholder="t('report.quatrace.selectLine')"
              style="width: 200px">
              <el-option v-for="item in lineData" :key="item.LineName" :label="item.LineDesc" :value="item.LineName" />
            </el-select>
          </el-form-item>
          <el-form-item :label="t('report.quatrace.equipment')" prop="equipment" class="mb-2">
            <el-select v-model="searchForm.SearchModel.EquipName" :placeholder="t('report.quatrace.selectEquipment')"
              style="width: 200px">
              <el-option v-for="item in equipmentData" :key="item.EquipName" :label="item.EquipDesc"
                :value="item.EquipName" />
            </el-select>
          </el-form-item>
          <el-form-item class="mb-2">
            <el-button type="primary" @click="getAllData()">{{ t('publicText.query') }}</el-button>
          </el-form-item>
          <el-form-item class="mb-2">
            <el-button type="success" @click="openExportDialog" :disabled="total == 0">{{ t('publicText.export')
              }}</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-dialog v-model="exportDialogVisible" :title="t('publicText.export')" width="30%"
        @close="exportDialogVisible = false" :append-to-body="true" :close-on-click-modal="false">
        <el-select v-model="exportRange" :placeholder="t('publicText.pleaseSelect')" style="width: 100%">
          <el-option :label="t('publicText.currentPage')" value="1" />
          <el-option :label="t('publicText.allData')" value="0" />
        </el-select>
        <template #footer>
          <el-button @click="exportDialogVisible = false">{{ t('publicText.cancel') }}</el-button>
          <el-button type="primary" @click="handleExport">{{ t('publicText.confirm') }}</el-button>
        </template>
      </el-dialog>
      <el-table ref="tableRef" :data="tableData" :height="tableHeight" border stripe size="small"
        @sort-change="handleSortChange">
        <el-table-column prop="OrderName" :label="t('report.quatrace.workOrder')"
          :min-width="getColumnWidth('OrderName')"></el-table-column>
        <el-table-column prop="OperationID" :label="t('report.quatrace.operationId')" 
          :min-width="getColumnWidth('OperationID')"></el-table-column>
        <el-table-column prop="OperationName" :label="t('report.quatrace.operationName')" 
          :min-width="getColumnWidth('OperationName')"></el-table-column>
        <el-table-column prop="AssemblyName" :label="t('report.quatrace.productCode')"
          :min-width="getColumnWidth('AssemblyName')"></el-table-column>
        <el-table-column prop="LineName" :label="t('report.quatrace.lineName')"
          :min-width="getColumnWidth('LineName')"></el-table-column>
        <el-table-column prop="SerialNumber" :label="t('report.quatrace.pcbId')"
          :min-width="getColumnWidth('SerialNumber')"></el-table-column>
        <el-table-column prop="EquipmentName" :label="t('report.quatrace.equipmentName')" 
          :min-width="getColumnWidth('EquipmentName')"></el-table-column>
        <el-table-column prop="DateTime" :label="t('report.quatrace.passTime')" 
          :min-width="getColumnWidth('DateTime')" :sort-orders="['ascending', 'descending']"></el-table-column>
        <el-table-column prop="StatusCODE" :label="t('report.quatrace.badCode')"
          :min-width="getColumnWidth('StatusCODE')"></el-table-column>
      </el-table>

      <!-- 分页控件 -->
      <div class="block" style="margin-top: 8px">
        <el-pagination size="small" background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="searchForm.PageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="searchForm.PageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, onBeforeUnmount, nextTick } from "vue";
import { ElMessage, ElLoading } from "element-plus";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import {
  QueryPCBDateBackTo,
  GetCamstarValorLine,
  GetCamstarValorEquip,
} from "@/api/report/index";
import dayjs from "dayjs";
import { useTableColumnWidth } from "@/hooks/useTableColumnWidth";
import { exportTableByRef } from "@/utils/exportExcel/generalExportExcel";
import { useExport } from "@/utils/exportExcel/loadingExcel";

const { t } = useI18n();
const route = useRoute();
const { showLoading, hideLoading, handleExportSuccess, handleExportError } = useExport();

const tableRef = ref();
const tableData = ref<any[]>([]);
const sortedData = ref<any[]>([]);
const total = ref(0);
const tableHeight = ref(0);
const lineData = ref<any[]>([]);
const equipmentData = ref<any[]>([]);
const dateValue = ref<any[]>([]);
const SearchText = ref("S");
const sortProp = ref("DateTime");
const sortOrder = ref("ascending");
const exportDialogVisible = ref(false);
const exportRange = ref("1");

const getDataText = reactive({
  seiralNumber: "",
  workOrder: "",
  operationType: "S",
});

const inquireList = [
  { lable: t("report.quatrace.workOrder"), value: "W" },
  { lable: t("report.quatrace.pcbId"), value: "S" },
  { lable: t("publicText.time"), value: "D" },
];

const searchForm = reactive({
  PageIndex: 1,
  PageSize: 50,
  SearchModel: {
    OrderNo: "",
    ContainerName: "",
    LineName: "",
    EquipName: "",
  },
  StartTime: "",
  EndTime: "",
});

const { getColumnWidth } = useTableColumnWidth(tableRef, tableData, {
  excludeLabels: [t("publicText.index")],
});

let loadingInstance: any = null;
const startLoading = () => {
  loadingInstance = ElLoading.service({ lock: true, text: "加载中~", background: "rgba(0, 0, 0, 0.2)" });
};
const endLoading = () => {
  loadingInstance?.close();
};

watch(dateValue, (value) => {
  if (value == null) {
    searchForm.StartTime = "";
    searchForm.EndTime = "";
  } else {
    searchForm.StartTime = value[0];
    searchForm.EndTime = value[1];
  }
  searchForm.PageIndex = 1;
});

watch(SearchText, (newValue) => {
  searchForm.PageIndex = 1;
  searchForm.PageSize = 50;
  searchForm.SearchModel.OrderNo = "";
  searchForm.SearchModel.ContainerName = "";
  searchForm.SearchModel.LineName = "";
  searchForm.SearchModel.EquipName = "";
  searchForm.StartTime = "";
  searchForm.EndTime = "";
  if (newValue == "W") {
    // searchForm.SearchText = "W";
  } else if (newValue == "S") {
    // searchForm.SearchText = "S";
  } else {
    lineData.value = [];
    equipmentData.value = [];
    getLineData();
    getEquipmentData();
    // searchForm.SearchText = "D";
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0); // 今天的开始时间
    dateValue.value = [
      dayjs(todayStart).format("YYYY-MM-DD HH:mm:ss"),
      dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
    ];
  }
});

// 执行全局排序
const sortData = () => {
  sortedData.value = [...tableData.value].sort((a, b) => {
    // 处理空值
    if (a[sortProp.value] == null) return 1;
    if (b[sortProp.value] == null) return -1;

    let valA = a[sortProp.value];
    let valB = b[sortProp.value];

    // 特殊处理日期字段
    if (sortProp.value === "DateTime") {
      valA = new Date(valA).getTime();
      valB = new Date(valB).getTime();
    }
    // 特殊处理数字字段（例如OperationID）
    else if (["OperationID"].includes(sortProp.value)) {
      valA = Number(valA);
      valB = Number(valB);
    }

    // 比较逻辑
    if (valA < valB) return sortOrder.value === "ascending" ? -1 : 1;
    if (valA > valB) return sortOrder.value === "ascending" ? 1 : -1;
    return 0;
  });
};

watch(
  tableData,
  (newVal) => {
    sortedData.value = [...newVal];
    sortData();
  },
  { immediate: true }
);

const handleSortChange = ({ prop, order }: any) => {
  sortProp.value = prop;
  sortOrder.value = order || "ascending"; // 点击三次后order为null，重置为ascending
  sortData();
};

const getLineData = () => {
  GetCamstarValorLine({
    LineName: "",
  }).then((res: any) => {
    lineData.value = res.Data;
  });
};

const getEquipmentData = () => {
  equipmentData.value = [];
  GetCamstarValorEquip({
    EquipName: "",
  }).then((res: any) => {
    equipmentData.value = res.Data;
  });
};

const dateCheck = (startDate: any, endDate: any) => {
  // 将日期字符串转换为Date对象
  const start = new Date(startDate);
  const end = new Date(endDate);

  // 计算两个日期之间的时间差（毫秒）
  const diffTime = Math.abs(end.getTime() - start.getTime());

  // 将时间差转换为天数
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // 判断是否不超过两天
  return diffDays > 2;
};

const getData = () => {
  return new Promise<void>((resolve) => {
    if (
      SearchText.value == "D" &&
      dateCheck(searchForm.StartTime, searchForm.EndTime)
    ) {
      ElMessage({
        message: t("report.quatrace.timeRangeExceed"),
        type: "warning",
      });
      endLoading();
      resolve();
      return;
    }
    QueryPCBDateBackTo(searchForm).then((res: any) => {
      if (res.Success) {
        tableData.value = res.Data.list;
        total.value = res.Data.Total;
      } else {
        ElMessage({
          message: res.Msg,
          type: "warning",
        });
      }
    });
  });
};

const openExportDialog = () => {
  exportDialogVisible.value = true;
};

const handleExport = async () => {
  exportDialogVisible.value = false;
  showLoading(t("publicText.exporting") || "正在导出表格数据...");
  try {
    let dataToExport = [...tableData.value];
    if (exportRange.value === "0") {
      const allParams = { ...searchForm, PageIndex: 1, PageSize: total.value };
      const res: any = await QueryPCBDateBackTo(allParams);
      if (res.Success) {
        dataToExport = res.Data?.list || [];
      } else {
        ElMessage.error(res.Msg || t("publicText.exportFailed"));
        hideLoading();
        return;
      }
    }
    await exportTableByRef(tableRef.value, dataToExport, {
      fileName: t("report.quatrace.title") || "PCB质量追溯",
      sheetName: t("report.quatrace.title") || "Sheet1",
      excludeProps: ["publicText.index", "publicText.operation"],
      i18nT: t,
    });
    handleExportSuccess(t("report.quatrace.title") || "PCB质量追溯");
  } catch (err) {
    handleExportError(err);
  } finally {
    hideLoading();
  }
};

const getAllData = async () => {
  startLoading();
  tableData.value = [];
  await getData();
  searchForm.PageIndex = 1;
  endLoading();
};

const handleSizeChange = (val: number) => {
  searchForm.PageIndex = 1;
  searchForm.PageSize = val;
  getAllData();
};

//当前页改变时触发 跳转其他页
const handleCurrentChange = (val: number) => {
  searchForm.PageIndex = val;
  getAllData();
};

const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 220;
  });
};

onMounted(() => {
  getScreenHeight();
  window.addEventListener("resize", getScreenHeight);
  getLineData();
  getEquipmentData();
  searchForm.SearchModel.ContainerName = route.query.SerialNumber as string; // 使用查询参数时使用
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", getScreenHeight);
});
</script>

<style lang="scss" scoped>
.smtinstpro {
  padding: 20px;

  // .form{
  //    display: flex;
  //     justify-content: flex-end;
  // }
}
</style>
