<template>
  <div class="parametEnable">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <el-form ref="formRef" :model="form" :inline="true" size="small" @submit.prevent>
        <el-form-item :label="t('report.smtProduction.product')" style="margin-bottom: 10px">
          <el-select v-model="form.productName" style="width: 300px" filterable
            :placeholder="t('report.smtProduction.clickToSelect')">
            <el-option v-for="item in itemList" :key="item.PartNumber" :label="item.PartNumber"
              :value="item.PartNumber" />
          </el-select>
        </el-form-item>
        <el-form-item style="margin-bottom: 10px">
          <el-button type="primary" @click="addVisible = true">{{ t('report.smtProduction.add') }}</el-button>
          <el-button type="primary" @click="getNowData">{{ t('report.smtProduction.queryCurrentStatus') }}</el-button>
          <el-button type="primary" @click="getHistoryData">{{ t('report.smtProduction.queryHistoryStatus')
            }}</el-button>
        </el-form-item>
      </el-form>
      <el-table ref="tableRef" :data="pagedTableData" :height="tableHeight" border stripe size="small"
        style="width: 100%">
        <el-table-column prop="ProductName" :label="t('report.smtProduction.product')"
          :min-width="getColumnWidth('ProductName')" />
        <el-table-column prop="LineName" :label="t('report.smtProduction.line')"
          :min-width="getColumnWidth('LineName')" />
        <el-table-column prop="Side" :label="t('report.smtProduction.side')" :min-width="getColumnWidth('Side')"
          :filters="[
            { text: 'Top', value: 'Top' },
            { text: 'Bot', value: 'Bot' },
          ]"
          :filter-method="filterMethod" />
        <el-table-column prop="CycleTime" :label="t('report.smtProduction.cycleTime')"
          :min-width="getColumnWidth('CycleTime')" />
        <el-table-column prop="UserName" :label="t('report.smtProduction.operator')"
          :min-width="getColumnWidth('UserName')" />
        <el-table-column prop="UpdateTime" :label="t('report.smtProduction.operateTime')"
          :min-width="getColumnWidth('UpdateTime')" />
        <el-table-column fixed="right" :label="t('publicText.operation')" width="150" align="center">
          <template #default="scope">
            <el-button v-if="delectShow" type="primary" icon="Edit" size="small" @click="handleChange(scope.row)" />
            <el-button v-if="delectShow" type="danger" icon="Delete" size="small" @click="handleDelete(scope.row)" />
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="margin-top: 8px">
        <el-pagination background size="small" @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="currentPage" :page-size="pageSize" :page-sizes="[5, 10, 20, 50, 100]"
          layout="total,sizes, prev, pager, next, jumper" :total="tableData.length" />
      </div>
    </el-card>

    <!-- 添加弹窗 -->
    <el-dialog :title="t('report.smtProduction.addTitle')" v-model="addVisible" width="500px" @close="addCancel">
      <el-form ref="addFormRef" :model="addForm" label-width="80px" size="small">
        <el-form-item :label="t('report.smtProduction.product')">
          <el-select v-model="addForm.productName" filterable :placeholder="t('report.smtProduction.clickToSelect')"
            style="width: 100%">
            <el-option v-for="item in itemList" :key="item.PartNumber" :label="item.PartNumber"
              :value="item.PartNumber" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('report.smtProduction.side')">
          <el-select v-model="addForm.side" filterable :placeholder="t('report.smtProduction.clickToSelect')"
            style="width: 100%">
            <el-option v-for="item in pon" :key="item.value" :label="item.value" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('report.smtProduction.line')">
          <el-select v-model="addForm.lineName" clearable :placeholder="t('report.smtProduction.clickToSelect')"
            style="width: 100%">
            <el-option v-for="item in lineList" :key="item.value" :label="item.value" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('report.smtProduction.cycle')">
          <el-input-number v-model="addForm.cycleTime" :controls="false" style="width: 100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addCancel">{{ t('publicText.cancel') }}</el-button>
        <el-button type="primary" @click="addData">{{ t('publicText.confirm') }}</el-button>
      </template>
    </el-dialog>

    <!-- 修改弹窗 -->
    <el-dialog :title="t('report.smtProduction.editTitle')" v-model="dialogVisible" width="500px" @close="changeCancel">
      <el-form ref="changeFormRef" :model="changeForm" label-width="80px" size="small">
        <el-form-item :label="t('report.smtProduction.product')">
          <el-input v-model="changeForm.productName" disabled />
        </el-form-item>
        <el-form-item :label="t('report.smtProduction.side')">
          <el-select v-model="changeForm.side" filterable disabled style="width: 100%">
            <el-option v-for="item in pon" :key="item.value" :label="item.value" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('report.smtProduction.line')">
          <el-select v-model="changeForm.lineName" disabled style="width: 100%">
            <el-option v-for="item in lineList" :key="item.value" :label="item.value" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('report.smtProduction.cycle')">
          <el-input-number v-model="changeForm.cycleTime" :controls="false" style="width: 100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="changeCancel">{{ t('publicText.cancel') }}</el-button>
        <el-button type="primary" @click="changeData">{{ t('publicText.confirm') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { XYL_OEE_ProductCycle } from "@/api/smtSet/pcbonlineTime";
import { useTableColumnWidth } from "@/hooks/useTableColumnWidth";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { useI18n } from "vue-i18n";
import { ElMessage, ElLoading } from "element-plus";
import { ref, reactive, computed, onMounted, onBeforeUnmount, nextTick } from "vue";

const { t } = useI18n();
const userStore = useUserStoreWithOut();

const tableRef = ref();
const tableHeight = ref(0);
const tableData = ref<any[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);
const delectShow = ref(false);
const dialogVisible = ref(false);
const addVisible = ref(false);
const itemList = ref<any[]>([]);
let loadingInstance: any = null;

const form = reactive({
  userName: userStore.getUserInfo || "",
  productName: "",
  cycleTime: 0,
  side: "",
  lineName: "",
  position: "",
});

const addForm = reactive({
  userName: userStore.getUserInfo || "",
  productName: "",
  cycleTime: 0,
  side: "",
  lineName: "",
  position: "",
});

const changeForm = reactive({
  userName: userStore.getUserInfo || "",
  productName: "",
  cycleTime: 0,
  side: "",
  lineName: "",
  position: "",
});

const pon = [{ value: "TOP" }, { value: "BOT" }];

const lineList = [
  { value: "Line1", label: "Line1" },
  { value: "Line2", label: "Line2" },
  { value: "Line3", label: "Line3" },
  { value: "Line4", label: "Line4" },
  { value: "Line5", label: "Line5" },
  { value: "Line6", label: "Line6" },
  { value: "Line7", label: "Line7" },
];

const { getColumnWidth } = useTableColumnWidth(tableRef, tableData, {
  excludeLabels: [t("publicText.operation")],
});

const pagedTableData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return tableData.value.slice(start, end);
});

const startLoading = () => {
  loadingInstance = ElLoading.service({ lock: true, text: "加载中~", background: "rgba(0, 0, 0, 0.2)" });
};
const endLoading = () => { loadingInstance?.close(); };

const getAll = () => {
  startLoading();
  XYL_OEE_ProductCycle({ operationType: "QA" })
    .then((res: any) => {
      if (res.Success) {
        ElMessage.success(t("report.smtProduction.initSuccess"));
        itemList.value = res.Data || [];
      } else {
        ElMessage.error(res.Message);
      }
      endLoading();
    })
    .catch((res: any) => {
      ElMessage.error(res);
      endLoading();
    });
};

const getNowData = () => {
  XYL_OEE_ProductCycle({ ...form, operationType: "Q" })
    .then((res: any) => {
      if (res.Success) {
        delectShow.value = true;
        currentPage.value = 1;
        tableData.value = res.Data || [];
      } else {
        ElMessage.error(res.Message);
        tableData.value = [];
      }
    })
    .catch((res: any) => {
      ElMessage.error(res);
    });
};

const getHistoryData = () => {
  if (form.productName === "") {
    return;
  }
  delectShow.value = false;
  XYL_OEE_ProductCycle({ ...form, operationType: "QH" })
    .then((res: any) => {
      if (res.Success) {
        currentPage.value = 1;
        tableData.value = res.Data || [];
      } else {
        ElMessage.error(res.Message);
        tableData.value = [];
      }
    })
    .catch((res: any) => {
      ElMessage.error(res);
    });
};

const addData = () => {
  if (addForm.userName === "" || addForm.cycleTime === 0 || addForm.side === "" || addForm.lineName === "") {
    return;
  }
  XYL_OEE_ProductCycle({ ...addForm, operationType: "I" })
    .then((res: any) => {
      if (typeof res !== "string") {
        if (res.Success) {
          ElMessage.success(t("report.smtProduction.addSuccess"));
          getNowData();
          addVisible.value = false;
        } else {
          ElMessage.error(res.Message);
        }
      } else {
        ElMessage.error(JSON.parse(res.replace(/[\r\n\s+]/g, "")).Message);
      }
    })
    .catch((res: any) => {
      console.log(res);
      ElMessage.error(res);
    });
};

const changeData = () => {
  XYL_OEE_ProductCycle({ ...changeForm, operationType: "U" })
    .then((res: any) => {
      if (res.Success) {
        ElMessage.success(t("report.smtProduction.editSuccess"));
        dialogVisible.value = false;
        getNowData();
        getAll();
      } else {
        ElMessage.error(res.Message);
      }
    })
    .catch((res: any) => {
      ElMessage.error(res);
    });
};

const handleChange = (row: any) => {
  dialogVisible.value = true;
  changeForm.userName = userStore.getUserInfo || "";
  changeForm.productName = row.ProductName;
  changeForm.cycleTime = row.CycleTime;
  changeForm.lineName = row.LineName;
  changeForm.side = row.Side;
};

const handleDelete = (row: any) => {
  XYL_OEE_ProductCycle({
    userName: userStore.getUserInfo || "",
    productName: row.ProductName,
    cycleTime: row.CycleTime,
    side: row.Side,
    lineName: row.LineName,
    position: row.Position,
    operationType: "D",
  })
    .then((res: any) => {
      if (res.Success) {
        ElMessage.success(t("report.smtProduction.deleteSuccess"));
        if (delectShow.value) {
          getNowData();
        } else {
          getHistoryData();
        }
      } else {
        ElMessage.error(res.Message);
      }
    })
    .catch((res: any) => {
      ElMessage.error(res);
    });
};

const addCancel = () => {
  addForm.userName = userStore.getUserInfo || "";
  addForm.productName = "";
  addForm.cycleTime = 0;
  addForm.side = "";
  addForm.lineName = "";
  addForm.position = "";
  addVisible.value = false;
};

const changeCancel = () => {
  dialogVisible.value = false;
};

const handleSizeChange = (val: number) => {
  currentPage.value = 1;
  pageSize.value = val;
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
};

const filterMethod = (value: string, row: any) => {
  return row.Side === value;
};

const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 190;
  });
};

onMounted(() => {
  getScreenHeight();
  window.addEventListener("resize", getScreenHeight);
  getAll();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", getScreenHeight);
});
</script>

<style lang="scss" scoped>
.parametEnable {
  padding: 8px;
}
</style>
