<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <div>
        <el-form ref="formRef" class="form" :inline="true" @submit.prevent>
          <el-form-item :label="t('assemble.processOrder.workOrder')" class="mb-2">
            <el-input :placeholder="t('publicText.pleaseInput')" size="small" clearable style="width: 350px"
              v-model="getForm.SearchModel.WorkOrder" class="input-with-select" @keyup.enter="handleSearch"
              @clear="handleSearch">
            </el-input>
          </el-form-item>
          <el-form-item :label="t('assemble.processOrder.time')" class="mb-2">
            <el-date-picker size="small" v-model="dateInterval" type="datetimerange" :range-separator="t('publicText.to')"
              :start-placeholder="t('publicText.startDate')" style="width: 350px" :end-placeholder="t('publicText.endDate')"
              value-format="YYYY-MM-DD HH:mm:ss" :shortcuts="shortcuts" :default-time="defaultTime"
              :clearable="false">
            </el-date-picker>
          </el-form-item>
          <el-form-item class="mb-2">
            <el-button type="primary" size="small" @click="handleSearch()">{{ t('publicText.query') }}</el-button>
            <el-button type="warning" size="small" @click="addVisible = true">{{ t('publicText.generate') }}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table ref="tableRef" :data="tableData" border :height="tableHeight" style="width: 100%" size="small"
        @row-click="rowDblclick" highlight-current-row>
        <el-table-column :label="t('publicText.index')" width="55" align="center">
          <template #default="scope">
            <span>{{ scope.$index + 1 + (getForm.PageIndex - 1) * getForm.PageSize }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="GenerateNumber" :label="t('assemble.processOrder.generateNumber')" :min-width="getColumnWidth('GenerateNumber')">
        </el-table-column>
        <el-table-column prop="GenerateQty" :label="t('assemble.processOrder.generateQty')" :min-width="getColumnWidth('GenerateQty')"> </el-table-column>
        <el-table-column prop="WorkOrder" :label="t('assemble.processOrder.workOrder')" :min-width="getColumnWidth('WorkOrder')"> </el-table-column>
        <el-table-column prop="CreatedOn" :label="t('assemble.processOrder.createdOn')" :min-width="getColumnWidth('CreatedOn')"> </el-table-column>
        <el-table-column prop="UpdatedBy" :label="t('assemble.processOrder.updatedBy')" :min-width="getColumnWidth('UpdatedBy')"> </el-table-column>
        <el-table-column fixed="right" :label="t('publicText.operation')" width="140" align="center">
          <template #default="{ row }">
            <el-button type="success" size="small" @click.stop="handleEdit(row)">{{ t('assemble.processOrder.export') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="margin-top: 8px">
        <el-pagination background size="small" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" :page-sizes="[5, 10, 20, 50, 100]"
          :current-page="getForm.PageIndex" :page-size="getForm.PageSize"
          layout="total,sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
      <el-tabs v-model="activeName" style="width: 100%">
        <el-tab-pane :label="t('assemble.processOrder.snList')" name="first">
          <el-table :data="tableFirst" ref="myTable" :height="tableHeight1" border stripe size="small">
            <el-table-column :label="t('publicText.index')" width="60" type="index" align="center">
            </el-table-column>
            <el-table-column prop="SN" :label="t('assemble.processOrder.sn')">
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog :title="t('publicText.generate')" v-model="addVisible" width="400px" @close="addCancel()">
      <el-form ref="addFormRef" :model="addForm" label-width="auto" :rules="rules">
        <el-form-item :label="t('assemble.processOrder.materialCode')" prop="MaterialName">
          <el-select v-model="addForm.MaterialName" filterable style="width: 100%">
            <el-option v-for="item in MaterialList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="t('assemble.processOrder.workOrder')" prop="WorkOrder">
          <el-input v-model="addForm.WorkOrder" :placeholder="t('publicText.pleaseInput')" style="width: 100%" />
        </el-form-item>
        <el-form-item :label="t('assemble.processOrder.generateQty')" prop="GenerateQty">
          <el-input v-model="addForm.GenerateQty" :placeholder="t('publicText.pleaseInput')" style="width: 100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addCancel">{{ t('publicText.cancel') }}</el-button>
        <el-button type="primary" @click="handleSubmit()">{{ t('publicText.confirm') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  ExecuteAssGenerateSN,
  GetAssGenerateRecord,
  GetAssGenerateSN,
} from "@/api/assemble/processOrder";
import { exportTableByRef } from "@/utils/exportExcel/generalExportExcel";
import { useTableColumnWidth } from "@/hooks/useTableColumnWidth";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { useI18n } from "vue-i18n";
import { ElMessage, ElNotification } from "element-plus";
import { ref, reactive, watch, onMounted, onBeforeUnmount, nextTick } from "vue";
import { shortcuts, setTodayDate, setLastDate } from "@/utils/dataMenu";
import dayjs from "dayjs";

const { t } = useI18n();
const userStore = useUserStoreWithOut();

const tableRef = ref();
const myTable = ref();
const addFormRef = ref();

const getForm = reactive({
  PageIndex: 1,
  PageSize: 50,
  SearchModel: {
    WorkOrder: "",
  },
  StartTime: "",
  EndTime: "",
});

const dateInterval = ref<[string, string] | null>(null);
const defaultTime = [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)];
const tableHeight = ref(0);
const tableHeight1 = ref(0);
const tableData = ref<any[]>([]);
const total = ref(0);
const tableFirst = ref<any[]>([]);
const activeName = ref("first");
const addVisible = ref(false);
const addForm = reactive({
  WorkOrder: "",
  CreatedBy: userStore.getUserInfo || "",
  GenerateQty: "",
  MaterialName: "1022059902400",
});
const MaterialList = [
  { value: "1022059902400", label: "1022059902400" },
];
const rules = {
  MaterialName: [{ required: true, message: t("assemble.processOrder.materialRequired"), trigger: "change" }],
  GenerateQty: [{ required: true, message: t("assemble.processOrder.qtyRequired"), trigger: "blur" }],
};
const generateNumber = ref("");

const { getColumnWidth } = useTableColumnWidth(tableRef, tableData, {
  excludeLabels: [t("publicText.operation")],
});
watch(dateInterval, (newdata) => {
  if (newdata != null) {
    getForm.StartTime = newdata[0];
    getForm.EndTime = newdata[1];
  } else {
    getForm.StartTime = "";
    getForm.EndTime = "";
  }
});

const getData = () => {
  GetAssGenerateRecord(getForm).then((res: any) => {
    if (res.Data && res.Data.list && res.Data.list.length === 0) {
      tableData.value = [];
    } else {
      tableData.value = res.Data.list.map((item: any) => {
        return {
          ...item,
          CreatedOn: dayjs(item.CreatedOn).format("YYYY-MM-DD HH:mm:ss"),
        };
      });
      total.value = res.Data.Total;
    }
    tableFirst.value = [];
  });
};

const handleSearch = () => {
  getForm.PageIndex = 1;
  getData();
};

const addCancel = () => {
  addVisible.value = false;
  addForm.WorkOrder = "";
  addForm.GenerateQty = "";
};

const handleSubmit = () => {
  addFormRef.value.validate((valid: boolean) => {
    if (valid) {
      ExecuteAssGenerateSN(addForm).then((res: any) => {
        if (res.Success) {
          ElNotification({
            title: t("publicText.tip"),
            message: res.Msg,
            type: "success",
          });
          addVisible.value = false;
          addForm.WorkOrder = "";
          addForm.GenerateQty = "";
          getData();
        } else {
          ElNotification({
            title: t("publicText.tip"),
            message: res.Msg,
            type: "error",
          });
        }
      });
    }
  });
};

const rowDblclick = (row: any) => {
  activeName.value = "first";
  GetAssGenerateSN({ GenerateNumber: row.GenerateNumber }).then((res: any) => {
    tableFirst.value = res.Data;
  });
};

const handleEdit = (row: any) => {
  generateNumber.value = row.GenerateNumber;
  GetAssGenerateSN({ GenerateNumber: row.GenerateNumber }).then((res: any) => {
    if (res.Data.length === 0) {
      ElNotification({
        title: t("publicText.tip"),
        message: t("assemble.processOrder.noData"),
        type: "warning",
      });
      return;
    }
    exportTableByRef(myTable.value, res.Data, {
      fileName: `${generateNumber.value}_${dayjs().format("YYYYMMDD-HHmmss")}`,
      i18nT: t,
    });
  });
};

const handleSizeChange = (value: number) => {
  getForm.PageSize = value;
  getData();
};

const handleCurrentChange = (value: number) => {
  getForm.PageIndex = value;
  getData();
};

const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = (window.innerHeight - 148 - 68 - 68 + 80 - 70) * 0.6;
    tableHeight1.value = (window.innerHeight - 148 - 68 + 80 - 50 - 70) * 0.4;
  });
};

onMounted(() => {
  getScreenHeight();
  window.addEventListener("resize", getScreenHeight);
  dateInterval.value = [setLastDate() as string, setTodayDate() as string];
  getForm.StartTime = dateInterval.value[0];
  getForm.EndTime = dateInterval.value[1];
  getData();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", getScreenHeight);
});
</script>

<style lang="scss" scoped></style>
