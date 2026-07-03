<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <div class="flex justify-between items-center">
        <!-- 查询表单 -->
        <el-form ref="searchFormRef" :inline="true" :model="searchForm" label-width="auto" @submit.prevent>
          <el-form-item :label="t('deviceManage.maintenance.itemCode')" class="mb-2">
            <el-input v-model="searchForm.itemCode" :placeholder="t('deviceManage.maintenance.itemCodePlaceholder')"
              clearable style="width: 150px" size="small" />
          </el-form-item>
          <el-form-item :label="t('deviceManage.maintenance.itemName')" class="mb-2">
            <el-input v-model="searchForm.itemName" :placeholder="t('deviceManage.maintenance.itemNamePlaceholder')"
              clearable style="width: 150px" size="small" />
          </el-form-item>
          <el-form-item class="mb-2">
            <el-button type="primary" @click="handleSearch" :size="'small'">{{ t("publicText.query") }}</el-button>
            <el-button @click="resetSearch" :size="'small'">{{ t("publicText.reset") }}</el-button>
          </el-form-item>
        </el-form>

        <div class="mb-2">
          <el-button type="success" @click="openExportDialog" :disabled="filteredData.length === 0" :size="'small'">
            {{ t("publicText.export") }}
          </el-button>
          <el-button type="warning" @click="openAdd" :size="'small'">
            {{ t("publicText.add") }}
          </el-button>
        </div>
      </div>

      <el-table :data="paginatedData" ref="maintenanceTableRef" border :height="tableHeight" style="width: 100%" stripe
        size="small" highlight-current-row tooltip-effect="light" v-loading="loading">
        <el-table-column type="index" :label="t('publicText.index')" width="55" fixed="left" align="center">
          <template #default="{ $index }">
            {{ $index + 1 + (currentPage - 1) * pageSize }}
          </template>
        </el-table-column>
        <el-table-column prop="item_code" :label="t('deviceManage.maintenance.itemCode')"
          :min-width="getColumnWidth('item_code')" />
        <el-table-column prop="item_name" :label="t('deviceManage.maintenance.itemName')"
          :min-width="getColumnWidth('item_name')" />
        <el-table-column prop="description" :label="t('deviceManage.maintenance.description')"
          :min-width="getColumnWidth('description')" />
        <el-table-column prop="inspection_method" :label="t('deviceManage.maintenance.inspectionMethod')"
          :min-width="getColumnWidth('inspection_method')" />
        <el-table-column prop="sort_order" :label="t('deviceManage.maintenance.sortOrder')" width="80" align="center" />
        <el-table-column prop="status" :label="t('deviceManage.maintenance.status')" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status ? 'success' : 'danger'" size="small">
              {{ row.status ? t("deviceManage.maintenance.enable") : t("deviceManage.maintenance.disable") }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="standard_duration" :label="t('deviceManage.maintenance.standardDuration')"
          :min-width="getColumnWidth('standard_duration')" />
        <el-table-column prop="create_by" :label="t('deviceManage.maintenance.createBy')"
          :min-width="getColumnWidth('create_by')" />
        <el-table-column prop="create_time" :label="t('deviceManage.maintenance.createTime')"
          :min-width="getColumnWidth('create_time')" />
        <el-table-column :label="$t('publicText.operation')" fixed="right" width="120" align="center">
          <template #default="{ row }">
            <!-- <el-button size="small" type="primary" @click="openEdit(row)" icon="Edit"></el-button> -->
            <el-button size="small" type="danger" @click="handleDelete(row)" icon="Delete"></el-button>
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
          @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next" :total="filteredData.length" />
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

    <!-- 新增/编辑保养项目对话框 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="600px" align-center :close-on-click-modal="false"
      @closed="handleDialogClosed">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px" size="small">
        <el-form-item :label="t('deviceManage.maintenance.itemCode')" prop="itemCode">
          <el-input v-model="formData.itemCode" :placeholder="t('deviceManage.maintenance.itemCodePlaceholder')"
            :disabled="isEdit" />
        </el-form-item>
        <el-form-item :label="t('deviceManage.maintenance.itemName')" prop="itemName">
          <el-input v-model="formData.itemName" :placeholder="t('deviceManage.maintenance.itemNamePlaceholder')" />
        </el-form-item>
        <!-- <el-form-item :label="t('deviceManage.maintenance.description')" prop="description">
          <el-input v-model="formData.description" type="textarea" :rows="2"
            :placeholder="t('deviceManage.maintenance.descriptionPlaceholder')" />
        </el-form-item> -->
        <el-form-item :label="t('deviceManage.maintenance.inspectionMethod')" prop="inspectionMethod">
          <el-input v-model="formData.inspectionMethod" type="textarea" :rows="2"
            :placeholder="t('deviceManage.maintenance.inspectionMethodPlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('deviceManage.maintenance.sortOrder')" prop="sortOrder">
          <el-input-number v-model="formData.sortOrder" :min="1" controls-position="right" style="width: 100%" />
        </el-form-item>
        <el-form-item :label="t('deviceManage.maintenance.standardDuration')" prop="standardDuration">
          <el-input-number v-model="formData.standardDuration" :min="1" :precision="0" controls-position="right"
            style="width: 100%" />
        </el-form-item>
        <el-form-item :label="t('deviceManage.maintenance.status')" prop="status">
          <el-switch v-model="formData.status" :active-value="1" :inactive-value="0"
            :active-text="t('deviceManage.maintenance.enable')" :inactive-text="t('deviceManage.maintenance.disable')" />
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
  GetAllMaintenanceItems,
  AddMaintenanceItems,
  DeleteMaintenanceItems
} from "@/api/deviceManage/deviceMaintenance";
import { exportTableByRef } from "@/utils/exportExcel/generalExportExcel";
import { useExport } from "@/utils/exportExcel/loadingExcel";
import { calculateColumnsWidth } from "@/utils/tableminWidth";
import dayjs from 'dayjs';

const { showLoading, hideLoading, handleExportSuccess, handleExportError } = useExport();
const { t } = useI18n();
const userStore = useUserStoreWithOut();

// 表格数据
const allData = ref<any[]>([]); // 所有原始数据
const loading = ref(false);
const submitLoading = ref(false);
const tableHeight = ref(0);
const maintenanceTableRef = ref();

// 前端分页与筛选
const searchForm = reactive({
  itemCode: "",
  itemName: "",
});
const currentPage = ref(1);
const pageSize = ref(20);

// 筛选后的数据
const filteredData = computed(() => {
  let data = [...allData.value];
  if (searchForm.itemCode) {
    data = data.filter(item => item.item_code?.toLowerCase().includes(searchForm.itemCode.toLowerCase()));
  }
  if (searchForm.itemName) {
    data = data.filter(item => item.item_name?.toLowerCase().includes(searchForm.itemName.toLowerCase()));
  }
  return data;
});

// 分页后的数据
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredData.value.slice(start, end);
});

// 导出相关
const deducedVisible = ref(false);
const deducedVal = ref("0");

// 新增/编辑对话框
const dialogVisible = ref(false);
const isEdit = ref(false);
const formRef = ref();
const formData = reactive({
  itemId: "",
  itemCode: "",
  itemName: "",
  description: "",
  inspectionMethod: "",
  sortOrder: 0,
  status: "1", // '1' 启用, '0' 禁用
  standardDuration: 0,
});

// 表单验证规则
const formRules = {
  itemCode: [{ required: true, message: t("message.pleaseInput") + t("deviceManage.maintenance.itemCode"), trigger: "blur" }],
  itemName: [{ required: true, message: t("message.pleaseInput") + t("deviceManage.maintenance.itemName"), trigger: "blur" }],
  sortOrder: [{ type: 'number', required: true, message: t("message.pleaseInput") + t("deviceManage.maintenance.sortOrder"), trigger: "blur" }],
  standardDuration: [{ type: 'number', required: true, message: t("message.pleaseInput") + t("deviceManage.maintenance.standardDuration"), trigger: "blur" }],
};

const dialogTitle = computed(() => isEdit.value ? t("publicText.edit") : t("publicText.add"));



// 获取所有保养项目数据
const fetchAllData = async () => {
  loading.value = true;
  try {
    const res: any = await GetAllMaintenanceItems({});
    if (res.Success && Array.isArray(res.Data)) {
      allData.value = res.Data.map((v:any)=>{
        v.create_time = dayjs(v.create_time).format('YYYY-MM-DD HH:mm:ss');
        v.update_time = dayjs(v.update_time).format('YYYY-MM-DD HH:mm:ss');
        return v;
      })

    } else {
      allData.value = [];
      ElMessage.warning(res.Message || t("message.queryFailure"));
    }
  } catch (error) {
    console.error("获取保养项目失败:", error);
    allData.value = [];
    ElMessage.error(t("message.queryFailure"));
  } finally {
    loading.value = false;
  }
};

// 搜索与重置
const handleSearch = () => {
  currentPage.value = 1;
};

const resetSearch = () => {
  searchForm.itemCode = "";
  searchForm.itemName = "";
  currentPage.value = 1;
};

// 前端分页
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  currentPage.value = 1;
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
};

// 导出
const openExportDialog = () => {
  deducedVisible.value = true;
};

const handleExport = async () => {
  deducedVisible.value = false;
  showLoading(t("deviceManage.badRecord.exportLoading") || "正在导出表格数据...");
  try {
    let dataToExport = [...filteredData.value];
    if (deducedVal.value === "1") {
      // 仅导出当前页
      dataToExport = [...paginatedData.value];
    }
    await exportTableByRef(maintenanceTableRef.value, dataToExport, {
      fileName: `${t("deviceManage.maintenance.exportFileName") || "保养项目"}`,
      sheetName: t("deviceManage.maintenance.exportFileName") || "Sheet1",
      excludeProps: ["publicText.index", "publicText.operation"],
      i18nT: t,
    });
    handleExportSuccess(t("deviceManage.maintenance.exportFileName") || "保养项目");
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
  formData.itemId = row.item_id;
  formData.itemCode = row.item_code;
  formData.itemName = row.item_name;
  formData.description = row.description || "";
  formData.inspectionMethod = row.inspection_method || "";
  formData.sortOrder = row.sort_order ?? 0;
  formData.status = row.status ? "1" : "0";
  formData.standardDuration = row.standard_duration ?? 0;
  dialogVisible.value = true;
};

// 重置表单数据
const resetFormData = () => {
  formData.itemId = "";
  formData.itemCode = "";
  formData.itemName = "";
  formData.description = "";
  formData.inspectionMethod = "";
  formData.sortOrder = 0;
  formData.status = "1";
  formData.standardDuration = 0;
};

// 提交表单（新增/编辑）
const submitForm = async () => {
  await formRef.value.validate();
  submitLoading.value = true;
  try {
    const currentUser = userStore.getUserInfo || "System";
    let res: any;
    if (isEdit.value) {
      // 调用更新接口
      const updateParams = {
        item_id: formData.itemId,
        item_code: formData.itemCode,
        item_name: formData.itemName,
        description: formData.description,
        inspection_method: formData.inspectionMethod,
        sort_order: formData.sortOrder,
        status: formData.status === "1",
        standard_duration: formData.standardDuration,
        user: currentUser,
      };
    //   res = await UpdateMaintenanceItem(updateParams);
    //   if (res.Success) ElMessage.success(t("message.editSuccess"));
    } else {
      // 新增
      const addParams = {
        user: currentUser,
        Items: [
          {
            itemCode: formData.itemCode,
            itemName: formData.itemName,
            description: formData.description,
            sortOrder: formData.sortOrder,
            status: formData.status === "1" ? 1 : 0,
            standard_duration: formData.standardDuration,
            inspection_method: formData.inspectionMethod,
          },
        ],
      };
      res = await AddMaintenanceItems(addParams);
      if (res.Success) ElMessage.success(t("message.addSuccess"));
    }
    if (res?.Success) {
      dialogVisible.value = false;
      await fetchAllData();
      // 重置分页到第一页
      currentPage.value = 1;
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
    `${t("publicText.confirm")}${t("publicText.delete")}【${row.item_code} - ${row.item_name}】?`,
    t("publicText.tip"),
    { confirmButtonText: t("publicText.confirm"), cancelButtonText: t("publicText.cancel"), type: "warning" }
  )
    .then(async () => {
      loading.value = true;
      try {
        const currentUser = userStore.getUserInfo || "System";
        const res: any = await DeleteMaintenanceItems({
          user: currentUser,
          ItemIds: [row.item_id],
        });
        if (res.Success) {
          ElMessage.success(t("message.deleteSuccess"));
          await fetchAllData();
          // 如果当前页没有数据且不是第一页，则回退一页
          if (paginatedData.value.length === 1 && currentPage.value > 1) {
            currentPage.value--;
          }
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
// 表格列宽自动计算
const tableColumns = computed(() => {
  if (!maintenanceTableRef.value) return [];
  const columns = maintenanceTableRef.value.columns
    .map((item: any) => ({ prop: item.property, label: item.label }))
    .filter((item: any) => item.label !== t("publicText.index") && item.label !== t("publicText.operation"));
  return columns;
});

const columnWidths = computed(() => {
  return calculateColumnsWidth(tableColumns.value, paginatedData.value, { padding: 25, fontSize: 13 });
});

const getColumnWidth = (prop: string) => columnWidths.value[prop] || "auto";
// 表格高度自适应
const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 190;
  });
};

onBeforeMount(() => {
  getScreenHeight();
  fetchAllData();
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