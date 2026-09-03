<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <div>
        <el-form ref="formRef" class="form" :inline="true" :model="form" size="small" label-width="80px">
          <el-form-item :label="t('finishProduct.inboundQuery.workOrder')" class="mb-2">
            <el-input placeholder="" clearable style="width: 200px" v-model="form.SearchModel.wo">
            </el-input>
          </el-form-item>
          <el-form-item :label="t('finishProduct.inboundQuery.pcbCode')" class="mb-2">
            <el-input placeholder="" clearable style="width: 300px" v-model="form.SearchModel.pcbsn">
            </el-input>
          </el-form-item>
          <el-form-item :label="t('finishProduct.inboundQuery.inspectionTime')" class="mb-2">
            <el-date-picker v-model="date" type="datetimerange" :range-separator="t('finishProduct.inboundQuery.to')" :start-placeholder="t('finishProduct.inboundQuery.startDate')" style="width:350px"
              :end-placeholder="t('finishProduct.inboundQuery.endDate')" value-format="YYYY-MM-DD HH:mm:ss" :shortcuts="shortcuts" :default-time="defaultTime"
              :clearable="false">
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="t('finishProduct.inboundQuery.inspectionResult')" class="mb-2">
            <el-select v-model="form.SearchModel.result" :placeholder="t('publicText.pleaseSelect')" style="width: 200px">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="t('finishProduct.inboundQuery.inspector')" class="mb-2">
            <el-input placeholder="" clearable style="width: 200px" v-model="form.SearchModel.checkuser">
            </el-input>
          </el-form-item>
          <el-form-item :label="t('finishProduct.inboundQuery.productCode')" class="mb-2">
            <el-input placeholder="" clearable style="width: 300px" v-model="form.SearchModel.pn"
              class="input-with-select">
            </el-input>
          </el-form-item>
          <el-form-item class="mb-2">
            <el-button type="primary" @click="dataSubmit()">{{ t('publicText.query') }}</el-button>
          </el-form-item>
          <el-form-item class="mb-2">
            <el-button type="success" @click="handleExport()" size="small">{{ t('finishProduct.inboundQuery.downloadTable') }}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        ref="tableRef"
        :data="tableData"
        :height="tableHeight"
        size="small"
       
        border
        stripe
      >
        <el-table-column :label="t('publicText.index')" width="55" align="center" fixed>
          <template #default="scope">
            <span>{{ (form.PageIndex - 1) * form.PageSize + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="wo" :label="t('finishProduct.inboundQuery.workOrder')" fixed :min-width="getColumnWidth('wo')">
        </el-table-column>
        <el-table-column prop="pcbsn" :label="t('finishProduct.inboundQuery.pcbCode')" fixed :min-width="getColumnWidth('pcbsn')">
        </el-table-column>
        <el-table-column prop="pn" :label="t('finishProduct.inboundQuery.productCode')" :min-width="getColumnWidth('pn')">
        </el-table-column>
        <el-table-column prop="name" :label="t('finishProduct.inboundQuery.productName')" :min-width="getColumnWidth('name')">
        </el-table-column>
        <el-table-column prop="spec" width="260" :label="t('finishProduct.inboundQuery.spec')" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="productsn" :label="t('finishProduct.inboundQuery.finishCode')" :min-width="getColumnWidth('productsn')">
        </el-table-column>
        <el-table-column prop="result" :label="t('finishProduct.inboundQuery.inspectionResult')" width="80">
        </el-table-column>
        <el-table-column prop="checktime" :label="t('finishProduct.inboundQuery.inspectionTime')" width="150">
        </el-table-column>
        <el-table-column prop="checkuser" :label="t('finishProduct.inboundQuery.inspector')" width="80">
        </el-table-column>
      </el-table>
      <div class="block" style="margin-top: 8px">
        <el-pagination  size="small" background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="form.PageIndex" :page-size="form.PageSize" :page-sizes="[5, 10, 20, 50, 100]"
          layout="total,sizes, prev, pager, next" :total="total">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { QueryWarehouseInspectionData } from "@/api/finishProduct/inboundQuery";
import { exportTableByRef } from "@/utils/exportExcel/generalExportExcel";
import { shortcuts } from "@/utils/dataMenu";
import { setTodayDate, setLastDate } from "@/utils/dataMenu";
import { useTableColumnWidth } from "@/hooks/useTableColumnWidth";
import { useI18n } from "vue-i18n";
import { ElMessage, ElNotification, ElLoading } from "element-plus";
import dayjs from "dayjs";
import { ref, reactive, onMounted, onBeforeMount, onUnmounted, nextTick, watch } from "vue";

const { t } = useI18n();

const tableRef = ref();
const formRef = ref();

const heardStyle = {
  background: "rgb(102, 146, 217)",
  color: "#ffffff",
};

const tableData = ref<any[]>([]);
const tableHeight = ref(0);
const total = ref(0);

const date = ref<[string, string]>([setLastDate(true) as string, setTodayDate(true) as string]);

const defaultTime = [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)];

const form = reactive({
  PageIndex: 1,
  PageSize: 20,
  SearchModel: {
    id: 0,
    wo: "",
    pn: "",
    name: "",
    spec: "",
    pcbsn: "",
    result: "",
    checkuser: "",
    checktime: "",
    ProductCode: "",
  },
  StartTime: "",
  EndTime: "",
});

const options = [
  { value: "", label: "ALL" },
  { value: "PASS", label: "PASS" },
  { value: "FAIL", label: "FAIL" },
];

const { getColumnWidth } = useTableColumnWidth(tableRef, tableData, {
  excludeLabels: [t("publicText.index")],
});

watch(date, (newValue) => {
  if (newValue) {
    form.StartTime = newValue[0];
    form.EndTime = newValue[1];
  } else {
    form.StartTime = "";
    form.EndTime = "";
  }
}, { immediate: true });

const getData = () => {
  QueryWarehouseInspectionData(form).then(({ data }: any) => {
    if (data.Success) {
      tableData.value = data.Data.list;
      total.value = data.Data.Total;
    } else {
      tableData.value = [];
      form.PageIndex = 1;
    }
  });
};

const dataSubmit = () => {
  form.PageIndex = 1;
  form.PageSize = 20;

  QueryWarehouseInspectionData(form).then((res: any) => {
    if (res.Success) {
      tableData.value = res.Data.list;
      total.value = res.Data.Total;
    } else {
      tableData.value = [];
      form.PageIndex = 1;
    }
  });
};

const handleSizeChange = (val: number) => {
  form.PageIndex = 1;
  form.PageSize = val;
  getData();
};

const handleCurrentChange = (val: number) => {
  form.PageIndex = val;
  getData();
};

const handleExport = async () => {
  if (tableData.value.length === 0) {
    ElNotification({
      title: t('publicText.tip'),
      message: t('finishProduct.inboundQuery.emptyList'),
      type: "error",
    });
    return;
  }
  try {
    const loading = ElLoading.service({
      lock: true,
      text: "Loading...",
      background: "rgba(0, 0, 0, 0.2)",
    });
    const res: any = await QueryWarehouseInspectionData({ ...form, PageSize: total.value });
    loading.close();
    const allData = res.data.Data.list;
    await exportTableByRef(tableRef.value, allData, {
      fileName: `${t('finishProduct.inboundQuery.inspectionQuery')}${dayjs().format("YYYYMMDD-HHmmss")}`,
      i18nT: t,
    });
  } catch (error: any) {
    ElMessage.error(error.message || t('publicText.failure'));
  }
};

const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 210;
  });
};

onBeforeMount(() => {
  const today = setTodayDate(true) as string;
  const lastWeek = setLastDate(true) as string;
  date.value = [lastWeek, today];
});

onMounted(() => {
  getData();
  getScreenHeight();
  window.addEventListener("resize", getScreenHeight);
});

onUnmounted(() => {
  window.removeEventListener("resize", getScreenHeight);
});
</script>

<style lang="scss" scoped>
.smtinstpro {
  padding: 20px;
}

.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.table {
  position: relative;

  .btn {
    display: flex;
    position: absolute;
    right: 0;
    top: -2.2rem;
    z-index: 99;
  }
}
</style>
