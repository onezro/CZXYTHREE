<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <div class="flex justify-between items-center">
        <!-- 查询表单 -->
        <el-form ref="formRef" :inline="true" :model="getForm" label-width="auto" @submit.prevent>
          <el-form-item :label="t('deviceManage.deviceLedger.machineryCode')" class="mb-2">
            <el-input v-model="getForm.MachineryCode"
              :placeholder="t('deviceManage.deviceLedger.machineryCodePlaceholder')" clearable style="width: 150px"
              size="small" />
          </el-form-item>
          <el-form-item :label="t('deviceManage.deviceLedger.machineryName')" class="mb-2">
            <el-input v-model="getForm.MachineryName"
              :placeholder="t('deviceManage.deviceLedger.machineryNamePlaceholder')" clearable style="width: 150px"
              size="small" />
          </el-form-item>
          <el-form-item :label="t('deviceManage.deviceLedger.productionLine')" class="mb-2">
            <el-input v-model="getForm.ProductionLine"
              :placeholder="t('deviceManage.deviceLedger.productionLinePlaceholder')" clearable style="width: 150px"
              size="small" />
          </el-form-item>
          <el-form-item class="mb-2">
            <el-button type="primary" @click="handleSearch" :size="'small'">{{
              t("publicText.query")
            }}</el-button>
            <el-button @click="resetSearch" :size="'small'">{{ t("publicText.reset") }}</el-button>
          </el-form-item>
        </el-form>

        <div class="mb-2">
          <el-button type="success" @click="openExportDialog" :disabled="tableData.length === 0" :size="'small'">
            {{ t("publicText.export") }}
          </el-button>
          <el-button type="warning" @click="openAdd" :size="'small'">
            {{ t("publicText.add") }}
          </el-button>
        </div>
      </div>

      <el-table :data="tableData" ref="repairRoomRef" border :height="tableHeight" style="width: 100%" stripe
        size="small" highlight-current-row tooltip-effect="light" v-loading="loading">
        <el-table-column type="index" :label="t('publicText.index')" width="55" fixed="left" align="center">
          <template #default="{ $index }">
            {{ $index + 1 + (getForm.PageIndex - 1) * getForm.PageSize }}
          </template>
        </el-table-column>
        <el-table-column prop="machinery_code" :label="t('deviceManage.deviceLedger.machineryCode')"
          :min-width="getColumnWidth('machinery_code')" />
        <el-table-column prop="machinery_name" :label="t('deviceManage.deviceLedger.machineryName')"
          :min-width="getColumnWidth('machinery_name')" />
        <el-table-column prop="machinery_brand" :label="t('deviceManage.deviceLedger.machineryBrand')"
          :min-width="getColumnWidth('machinery_brand')" />
        <el-table-column prop="machinery_spec" :label="t('deviceManage.deviceLedger.specification')"
          :min-width="getColumnWidth('machinery_spec')" />
        <el-table-column prop="production_line" :label="t('deviceManage.deviceLedger.productionLine')"
          :min-width="getColumnWidth('production_line')" />
        <el-table-column prop="workshop_name" :label="t('deviceManage.deviceLedger.workshopName')"
          :min-width="getColumnWidth('workshop_name')" />
        <el-table-column prop="machinery_type_code" :label="t('deviceManage.deviceLedger.machineryTypeCode')"
          :min-width="getColumnWidth('machinery_type_code')" />
        <el-table-column prop="machinery_type_name" :label="t('deviceManage.deviceLedger.machineryType')"
          :min-width="getColumnWidth('machinery_type_name')" />
        <el-table-column prop="admin_name" :label="t('deviceManage.deviceLedger.adminName')"
          :min-width="getColumnWidth('admin_name')" />
        <el-table-column prop="status" :label="t('deviceManage.deviceLedger.machineryStatus')"
          :min-width="getColumnWidth('status')" />
        <el-table-column prop="create_by" :label="t('deviceManage.deviceLedger.createBy')"
          :min-width="getColumnWidth('create_by')" />
        <el-table-column prop="create_time" :label="t('deviceManage.deviceLedger.createTime')"
          :min-width="getColumnWidth('create_time')" />
        <el-table-column :label="$t('publicText.operation')" fixed="right" width="120" align="center">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="openEdit(row)" icon="Edit">

            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)" icon="Delete">

            </el-button>
          </template>
        </el-table-column>
        <template #empty>
          <div class="flex items-center justify-center h-100%">
            <el-empty />
          </div>
        </template>
      </el-table>

      <div style="margin-top: 8px">
        <el-pagination align="center" background :size="'small'" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" :current-page="getForm.PageIndex" :page-size="getForm.PageSize"
          :page-sizes="[10, 20, 50, 100, 200]" layout="total,sizes, prev, pager, next" :total="total" />
      </div>
    </el-card>

    <!-- 导出选择对话框 -->
    <el-dialog :title="t('deviceManage.badRecord.exportTitle')" v-model="deducedVisible" width="30%"
      @close="deducedVisible = false" :append-to-body="true" :close-on-click-modal="false">
      <el-select v-model="deducedVal" :placeholder="t('deviceManage.badRecord.selectExportRange')">
        <el-option :label="t('deviceManage.badRecord.currentPage')" :value="'1'" />
        <el-option :label="t('deviceManage.badRecord.allData')" :value="'0'" />
      </el-select>
      <template #footer>
        <el-button @click="deducedVisible = false">{{ t('publicText.cancel') }}</el-button>
        <el-button type="primary" @click="handleExport">{{ t('publicText.confirm') }}</el-button>
      </template>
    </el-dialog>

    <!-- 新增/编辑设备对话框 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="600px" align-center :close-on-click-modal="false"
      @closed="handleDialogClosed">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px" size="small">
        <el-form-item :label="t('deviceManage.deviceLedger.machineryCode')" prop="MachineryCode">
          <el-input v-model="formData.MachineryCode"
            :placeholder="t('deviceManage.deviceLedger.machineryCodePlaceholder')" :disabled="isEdit" />
        </el-form-item>
        <el-form-item :label="t('deviceManage.deviceLedger.machineryName')" prop="MachineryName">
          <el-input v-model="formData.MachineryName"
            :placeholder="t('deviceManage.deviceLedger.machineryNamePlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('deviceManage.deviceLedger.machineryBrand')" prop="MachineryBrand">
          <el-input v-model="formData.MachineryBrand"
            :placeholder="t('deviceManage.deviceLedger.machineryBrandPlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('deviceManage.deviceLedger.specification')" prop="MachinerySpec">
          <el-input v-model="formData.MachinerySpec"
            :placeholder="t('deviceManage.deviceLedger.specificationPlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('deviceManage.deviceLedger.MachineryTypeId')" prop="MachineryTypeId">
          <el-input v-model="formData.MachineryTypeId" :placeholder="t('deviceManage.deviceLedger.MachineryTypeId')" />
        </el-form-item>
        <el-form-item :label="t('deviceManage.deviceLedger.machineryTypeCode')" prop="MachineryTypeCode">
          <el-input v-model="formData.MachineryTypeCode"
            :placeholder="t('deviceManage.deviceLedger.machineryTypeCodePlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('deviceManage.deviceLedger.machineryType')" prop="MachineryTypeName">
          <el-input v-model="formData.MachineryTypeName"
            :placeholder="t('deviceManage.deviceLedger.machineryTypePlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('deviceManage.deviceLedger.workshopName')" prop="WorkShopName">
          <el-input v-model="formData.WorkShopName"
            :placeholder="t('deviceManage.deviceLedger.workshopNamePlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('deviceManage.deviceLedger.productionLine')" prop="ProductionLine">
          <el-input v-model="formData.ProductionLine"
            :placeholder="t('deviceManage.deviceLedger.productionLinePlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('deviceManage.deviceLedger.machineryStatus')" prop="MachineryStatus">
          <el-select v-model="formData.MachineryStatus"
            :placeholder="t('deviceManage.deviceLedger.machineryStatusPlaceholder')" clearable>
            <el-option label="运行中" value="running" />
            <el-option label="停机" value="stopped" />
            <el-option label="维修" value="maintenance" />
            <el-option label="未知" value="unknow" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('deviceManage.deviceLedger.adminCode')" prop="AdminCode">
          <el-input v-model="formData.AdminCode" :placeholder="t('deviceManage.deviceLedger.adminCodePlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('deviceManage.deviceLedger.adminName')" prop="AdminName">
          <el-input v-model="formData.AdminName" :placeholder="t('deviceManage.deviceLedger.adminNamePlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('deviceManage.deviceLedger.enableFlag')" prop="EnableFlag" v-if="isEdit">
          <el-switch v-model="formData.EnableFlag" active-value="1" inactive-value="0" />
        </el-form-item>
        <el-form-item :label="t('deviceManage.deviceLedger.remark')" prop="Remark">
          <el-input v-model="formData.Remark" type="textarea" :rows="2"
            :placeholder="t('deviceManage.deviceLedger.remarkPlaceholder')" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">{{ t('publicText.cancel') }}</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitLoading">{{ t('publicText.confirm') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  computed,
  onBeforeMount,
  onMounted,
  onBeforeUnmount,
  nextTick,
} from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n";
import { useUserStoreWithOut } from "@/stores/modules/user";
import {
  GetPagedMachineries,
  AddMachinery,
  UpdataMachinery,
  DeleteMachineryById,
} from "@/api/deviceManage/deviceLedger";
import { exportTableByRef } from "@/utils/exportExcel/generalExportExcel";
import { useExport } from "@/utils/exportExcel/loadingExcel";
import { calculateColumnsWidth } from "@/utils/tableminWidth";

const { showLoading, hideLoading, handleExportSuccess, handleExportError } = useExport();
const { t } = useI18n();
const userStore = useUserStoreWithOut();

// 表格数据
const tableData = ref<any[]>([]);
const total = ref(0);
const tableHeight = ref(0);
const repairRoomRef = ref();
const loading = ref(false);
const submitLoading = ref(false);

// 查询参数
const getForm = reactive({
  MachineryCode: "",
  MachineryName: "",
  MachineryBrand: "",
  MachineryTypeId: "",
  WorkShopName: "",
  ProductionLine: "",
  MachineryStatus: "",
  AdminCode: "",
  AdminName: "",
  EnableFlag: "",
  PageIndex: 1,
  PageSize: 50,
});

// 导出相关
const deducedVisible = ref(false);
const deducedVal = ref("0");

// 新增/编辑对话框
const dialogVisible = ref(false);
const isEdit = ref(false);
const formRef = ref();
const formData = reactive({
  MachineryId: "",
  MachineryCode: "",
  MachineryName: "",
  MachineryBrand: "",
  MachinerySpec: "",
  MachineryTypeId: "",
  MachineryTypeCode: "",
  MachineryTypeName: "",
  WorkShopName: "",
  ProductionLine: "",
  MachineryStatus: "",
  AdminCode: "",
  AdminName: "",
  EnableFlag: "1",
  Remark: "",
});

// 表单验证规则
const formRules = {
  MachineryCode: [{ required: true, message: t("message.pleaseInput") + t("deviceManage.deviceLedger.machineryCode"), trigger: "blur" }],
  MachineryName: [{ required: true, message: t("message.pleaseInput") + t("deviceManage.deviceLedger.machineryName"), trigger: "blur" }],
  MachineryBrand: [{ required: true, message: t("message.pleaseInput") + t("deviceManage.deviceLedger.machineryBrand"), trigger: "blur" }],
  WorkShopName: [{ required: true, message: t("message.pleaseInput") + t("deviceManage.deviceLedger.workshopName"), trigger: "blur" }],
  ProductionLine: [{ required: true, message: t("message.pleaseInput") + t("deviceManage.deviceLedger.productionLine"), trigger: "blur" }],
};

const dialogTitle = computed(() => isEdit.value ? t("publicText.edit") : t("publicText.add"));

// 表格列宽自动计算
const tableColumns = computed(() => {
  if (!repairRoomRef.value) return [];
  const columns = repairRoomRef.value.columns
    .map((item: any) => ({ prop: item.property, label: item.label }))
    .filter((item: any) => item.label !== t("publicText.index") && item.label !== t("publicText.operation"));
  return columns;
});

const columnWidths = computed(() => {
  return calculateColumnsWidth(tableColumns.value, tableData.value, { padding: 25, fontSize: 13 });
});

const getColumnWidth = (prop: string) => columnWidths.value[prop] || "auto";

// 获取数据
const getData = async () => {
  loading.value = true;
  try {
    const res: any = await GetPagedMachineries(getForm);
    tableData.value = res.Data.Items || [];
    total.value = res.Data.TotalCount || 0;
  } catch (error) {
    console.error("查询失败:", error);
    tableData.value = [];
    total.value = 0;
  } finally {
    loading.value = false;
  }
};

// 搜索与重置
const handleSearch = () => {
  getForm.PageIndex = 1;
  getData();
};

const resetSearch = () => {
  getForm.MachineryCode = "";
  getForm.MachineryName = "";
  getForm.ProductionLine = "";
  getForm.PageIndex = 1;
  getData();
};

// 分页
const handleSizeChange = (val: number) => {
  getForm.PageSize = val;
  getForm.PageIndex = 1;
  getData();
};

const handleCurrentChange = (val: number) => {
  getForm.PageIndex = val;
  getData();
};

// 导出
const openExportDialog = () => {
  deducedVisible.value = true;
};

const handleExport = async () => {
  deducedVisible.value = false;
  showLoading(t("deviceManage.badRecord.exportLoading") || "正在导出表格数据...");
  try {
    let dataToExport = [...tableData.value];
    if (deducedVal.value === "0") {
      const allParams = { ...getForm, PageIndex: 1, PageSize: total.value };
      const res: any = await GetPagedMachineries(allParams);
      if (res.Success) {
        dataToExport = res.Data.Items || [];
      } else {
        ElMessage.error(res.Message || t("deviceManage.deviceLedger.exportFailed"));
        hideLoading();
        return;
      }
    }
    await exportTableByRef(repairRoomRef.value, dataToExport, {
      fileName: `${t("deviceManage.deviceLedger.exportFileName") || "设备台账"}`,
      sheetName: t("deviceManage.deviceLedger.exportFileName") || "Sheet1",
      excludeProps: ["publicText.index", "publicText.operation"],
      i18nT: t,
    });
    handleExportSuccess(t("deviceManage.deviceLedger.exportFileName") || "设备台账");
  } catch (err) {
    handleExportError(err);
  } finally {
    hideLoading();
  }
};

// 新增
const openAdd = () => {
  isEdit.value = false;
  resetFormData();
  dialogVisible.value = true;
};

// 编辑
const openEdit = (row: any) => {
  isEdit.value = true;
  Object.assign(formData, {
    MachineryId: row.machinery_id,
    MachineryCode: row.machinery_code,
    MachineryName: row.machinery_name,
    MachineryBrand: row.machinery_brand,
    MachinerySpec: row.machinery_spec,
    MachineryTypeId: row.machinery_type_id,
    MachineryTypeCode: row.machinery_type_code,
    MachineryTypeName: row.machinery_type_name,
    WorkShopName: row.workshop_name,
    ProductionLine: row.production_line,
    MachineryStatus: row.status,
    AdminCode: row.admin_code,
    AdminName: row.admin_name,
    EnableFlag: row.enable_flag,
    Remark: row.remark,
  });
  dialogVisible.value = true;
};

// 重置表单数据
const resetFormData = () => {
  formData.MachineryId = "";
  formData.MachineryCode = "";
  formData.MachineryName = "";
  formData.MachineryBrand = "";
  formData.MachinerySpec = "";
  formData.MachineryTypeId = "";
  formData.MachineryTypeCode = "";
  formData.MachineryTypeName = "";
  formData.WorkShopName = "";
  formData.ProductionLine = "";
  formData.MachineryStatus = "";
  formData.AdminCode = "";
  formData.AdminName = "";
  formData.EnableFlag = "1";
  formData.Remark = "";
};

// 提交表单
const submitForm = async () => {
  await formRef.value.validate();
  submitLoading.value = true;
  try {
    let res: any;
    const currentUser = userStore.getUserInfo || "系统管理员";
    if (isEdit.value) {
      const updateParams = {
        MachineryId: formData.MachineryId,
        ModifierName: currentUser,
        Remark: formData.Remark,
        MachineryCode: formData.MachineryCode,
        MachineryName: formData.MachineryName,
        MachineryBrand: formData.MachineryBrand,
        MachinerySpec: formData.MachinerySpec,
        MachineryTypeId: formData.MachineryTypeId,
        WorkShopName: formData.WorkShopName,
        ProductionLine: formData.ProductionLine,
        MachineryStatus: formData.MachineryStatus,
        AdminCode: formData.AdminCode,
        AdminName: formData.AdminName,
        EnableFlag: formData.EnableFlag,
      };
      res = await UpdataMachinery(updateParams);
      if (res.Success) ElMessage.success(t("message.editSuccess"));
    } else {
      const addParams = {
        MachineryCode: formData.MachineryCode,
        MachineryName: formData.MachineryName,
        MachineryBrand: formData.MachineryBrand,
        MachinerySpec: formData.MachinerySpec,
        MachineryTypeId: formData.MachineryTypeId,
        MachineryTypeCode: formData.MachineryTypeCode,
        MachineryTypeName: formData.MachineryTypeName,
        WorkShopName: formData.WorkShopName,
        ProductionLine: formData.ProductionLine,
        MachineryStatus: formData.MachineryStatus,
        AdminCode: formData.AdminCode,
        AdminName: formData.AdminName,
        CreaterName: currentUser,
        Remark: formData.Remark,
      };
      res = await AddMachinery(addParams);
      if (res.Success) ElMessage.success(t("message.addSuccess"));
    }
    if (res?.Success) {
      dialogVisible.value = false;
      getData();
    } else {
      ElMessage.error(res?.Message || (isEdit.value ? t("message.editFailure") : t("message.addFailure")));
    }
  } catch (error) {
    console.error("提交失败:", error);
    ElMessage.error(t("message.submitFailure"));
  } finally {
    submitLoading.value = false;
  }
};

// 删除
const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    `${t("publicText.confirm")}${t("publicText.delete")}【${row.machinery_code} - ${row.machinery_name}】?`,
    t("publicText.tip"),
    { confirmButtonText: t("publicText.confirm"), cancelButtonText: t("publicText.cancel"), type: "warning" }
  )
    .then(async () => {
      loading.value = true;
      try {
        const res: any = await DeleteMachineryById(row.machinery_id);
        if (res.Success) {
          ElMessage.success(t("message.deleteSuccess"));
          if (tableData.value.length === 1 && getForm.PageIndex > 1) getForm.PageIndex--;
          getData();
        } else {
          ElMessage.error(res.Message || t("message.deleteFailure"));
        }
      } catch (error) {
        ElMessage.error(t("message.deleteFailure"));
      } finally {
        loading.value = false;
      }
    })
    .catch(() => ElMessage.info(t("publicText.cancel")));
};

const handleDialogClosed = () => {
  formRef.value?.resetFields();
  resetFormData();
};

// 表格高度自适应
const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 190;
  });
};

onBeforeMount(() => {
  getScreenHeight();
  getData();
});

onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", getScreenHeight);
});
</script>

<style scoped>
.el-pagination {
  justify-content: center;
}
</style>