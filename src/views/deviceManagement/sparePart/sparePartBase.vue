<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <div class="flex justify-between items-center">
        <!-- 查询表单 -->
        <el-form ref="queryFormRef" :inline="true" :model="queryParams" label-width="auto" @submit.prevent>
          <el-form-item :label="t('deviceManage.sparePart.partCode')" class="mb-2">
            <el-input v-model="queryParams.partCode" :placeholder="t('deviceManage.sparePart.partCodePlaceholder')"
              clearable style="width: 150px" size="small" />
          </el-form-item>
          <el-form-item :label="t('deviceManage.sparePart.partName')" class="mb-2">
            <el-input v-model="queryParams.partName" :placeholder="t('deviceManage.sparePart.partNamePlaceholder')"
              clearable style="width: 150px" size="small" />
          </el-form-item>
          <el-form-item :label="t('deviceManage.sparePart.status')" class="mb-2">
            <el-select v-model="queryParams.status" :placeholder="t('deviceManage.sparePart.statusPlaceholder')"
              clearable style="width: 130px" size="small">
              <el-option :label="t('deviceManage.sparePart.statusEnable')" value="ENABLE" />
              <el-option :label="t('deviceManage.sparePart.statusDisable')" value="DISABLE" />
            </el-select>
          </el-form-item>
          <el-form-item class="mb-2">
            <el-button type="primary" @click="handleSearch" :size="'small'">{{ t("publicText.query") }}</el-button>
            <el-button @click="resetSearch" :size="'small'">{{ t("publicText.reset") }}</el-button>
          </el-form-item>
        </el-form>

        <div class="mb-2">
          <el-button type="warning" @click="openAddDialog" :size="'small'">
            {{ t("publicText.add") }}
          </el-button>
        </div>
      </div>

      <el-table :data="tableData" ref="tableRef" border :height="tableHeight" style="width: 100%" stripe size="small"
        highlight-current-row tooltip-effect="light" v-loading="loading">
        <el-table-column type="index" :label="t('publicText.index')" width="55" fixed="left" align="center">
          <template #default="{ $index }">
            {{ $index + 1 + (queryParams.pageIndex - 1) * queryParams.pageSize }}
          </template>
        </el-table-column>
        <el-table-column prop="PartId" :label="t('deviceManage.sparePart.partId')" :min-width="getColumnWidth('PartId')" />
        <el-table-column prop="PartCode" :label="t('deviceManage.sparePart.partCode')" :min-width="getColumnWidth('PartCode')" />
        <el-table-column prop="PartName" :label="t('deviceManage.sparePart.partName')" :min-width="getColumnWidth('PartName')" />
        <el-table-column prop="PartSpec" :label="t('deviceManage.sparePart.partSpec')" :min-width="getColumnWidth('PartSpec')" />
        <el-table-column prop="Unit" :label="t('deviceManage.sparePart.unit')" :min-width="getColumnWidth('Unit')" />
        <el-table-column prop="PartType" :label="t('deviceManage.sparePart.partType')" :min-width="getColumnWidth('PartType')" />
        <el-table-column prop="MinStock" :label="t('deviceManage.sparePart.minStock')" :min-width="getColumnWidth('MinStock')" align="right" />
        <el-table-column prop="MaxStock" :label="t('deviceManage.sparePart.maxStock')" :min-width="getColumnWidth('MaxStock')" align="right" />
        <el-table-column prop="CurrentStock" :label="t('deviceManage.sparePart.currentStock')" :min-width="getColumnWidth('CurrentStock')" align="right" />
        <el-table-column prop="Location" :label="t('deviceManage.sparePart.location')" :min-width="getColumnWidth('Location')" />
        <el-table-column prop="Supplier" :label="t('deviceManage.sparePart.supplier')" :min-width="getColumnWidth('Supplier')" show-overflow-tooltip />
        <el-table-column prop="Status" :label="t('deviceManage.sparePart.status')" :min-width="getColumnWidth('Status')" align="center">
          <template #default="{ row }">
            <el-tag :type="row.Status === 'ENABLE' ? 'success' : 'danger'" size="small">
              {{ row.Status === 'ENABLE' ? t('deviceManage.sparePart.statusEnable') : t('deviceManage.sparePart.statusDisable') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="CreateTime" :label="t('deviceManage.sparePart.createTime')" :min-width="getColumnWidth('CreateTime')" />
        <el-table-column prop="UpdateTime" :label="t('deviceManage.sparePart.updateTime')" :min-width="getColumnWidth('UpdateTime')" />
        <el-table-column :label="$t('publicText.operation')" fixed="right" width="80" align="center">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="openEditDialog(row)" icon="Edit" />
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
          @current-change="handleCurrentChange" :current-page="queryParams.pageIndex" :page-size="queryParams.pageSize"
          :page-sizes="[10, 20, 50, 100, 200]" layout="total,sizes, prev, pager, next" :total="total" />
      </div>
    </el-card>

    <!-- ========== 新增对话框（独立） ========== -->
    <el-dialog :title="t('deviceManage.sparePart.addTitle')" v-model="addDialogVisible" width="700px" align-center
      :close-on-click-modal="false" @closed="handleAddDialogClosed">
      <el-form ref="addFormRef" :model="addFormData" :rules="addFormRules" label-width="100px" size="small" label-position="right">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="t('deviceManage.sparePart.partCode')" prop="partCode" required>
              <el-input v-model="addFormData.partCode" :placeholder="t('deviceManage.sparePart.partCodePlaceholder')" />
            </el-form-item>
            <el-form-item :label="t('deviceManage.sparePart.partName')" prop="partName" required>
              <el-input v-model="addFormData.partName" :placeholder="t('deviceManage.sparePart.partNamePlaceholder')" />
            </el-form-item>
            <el-form-item :label="t('deviceManage.sparePart.partSpec')" prop="partSpec">
              <el-input v-model="addFormData.partSpec" :placeholder="t('deviceManage.sparePart.partSpecPlaceholder')" />
            </el-form-item>
            <el-form-item :label="t('deviceManage.sparePart.unit')" prop="unit">
              <el-input v-model="addFormData.unit" :placeholder="t('deviceManage.sparePart.unitPlaceholder')" />
            </el-form-item>
            <el-form-item :label="t('deviceManage.sparePart.partType')" prop="partType">
              <el-input v-model="addFormData.partType" :placeholder="t('deviceManage.sparePart.partTypePlaceholder')" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('deviceManage.sparePart.minStock')" prop="minStock" required>
              <el-input-number v-model="addFormData.minStock" :min="0" :placeholder="t('deviceManage.sparePart.minStockPlaceholder')" style="width: 100%" controls-position="right" />
            </el-form-item>
            <el-form-item :label="t('deviceManage.sparePart.maxStock')" prop="maxStock">
              <el-input-number v-model="addFormData.maxStock" :min="0" :placeholder="t('deviceManage.sparePart.maxStockPlaceholder')" style="width: 100%" controls-position="right" />
            </el-form-item>
            <el-form-item :label="t('deviceManage.sparePart.location')" prop="location">
              <el-input v-model="addFormData.location" :placeholder="t('deviceManage.sparePart.locationPlaceholder')" />
            </el-form-item>
            <el-form-item :label="t('deviceManage.sparePart.supplier')" prop="supplier">
              <el-input v-model="addFormData.supplier" :placeholder="t('deviceManage.sparePart.supplierPlaceholder')" />
            </el-form-item>
            <el-form-item :label="t('deviceManage.sparePart.remark')" prop="remark">
              <el-input v-model="addFormData.remark" :placeholder="t('deviceManage.sparePart.remarkPlaceholder')" type="textarea" :rows="2" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="t('deviceManage.sparePart.status')" prop="status">
          <el-radio-group v-model="addFormData.status">
            <el-radio label="ENABLE">{{ t('deviceManage.sparePart.statusEnable') }}</el-radio>
            <el-radio label="DISABLE">{{ t('deviceManage.sparePart.statusDisable') }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDialogVisible = false">{{ t('publicText.cancel') }}</el-button>
        <el-button type="primary" @click="submitAddForm" :loading="submitLoading">{{ t('publicText.confirm') }}</el-button>
      </template>
    </el-dialog>

    <!-- ========== 编辑对话框（独立） ========== -->
    <el-dialog :title="t('deviceManage.sparePart.editTitle')" v-model="editDialogVisible" width="700px" align-center
      :close-on-click-modal="false" @closed="handleEditDialogClosed">
      <el-form ref="editFormRef" :model="editFormData" :rules="editFormRules" label-width="100px" size="small" label-position="right">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="t('deviceManage.sparePart.partId')" prop="partId">
              <el-input v-model="editFormData.partId" disabled />
            </el-form-item>
            <el-form-item :label="t('deviceManage.sparePart.partCode')" prop="partCode" required>
              <el-input v-model="editFormData.partCode" :placeholder="t('deviceManage.sparePart.partCodePlaceholder')" />
            </el-form-item>
            <el-form-item :label="t('deviceManage.sparePart.partName')" prop="partName" required>
              <el-input v-model="editFormData.partName" :placeholder="t('deviceManage.sparePart.partNamePlaceholder')" />
            </el-form-item>
            <el-form-item :label="t('deviceManage.sparePart.partSpec')" prop="partSpec">
              <el-input v-model="editFormData.partSpec" :placeholder="t('deviceManage.sparePart.partSpecPlaceholder')" />
            </el-form-item>
            <el-form-item :label="t('deviceManage.sparePart.unit')" prop="unit">
              <el-input v-model="editFormData.unit" :placeholder="t('deviceManage.sparePart.unitPlaceholder')" />
            </el-form-item>
            <el-form-item :label="t('deviceManage.sparePart.partType')" prop="partType">
              <el-input v-model="editFormData.partType" :placeholder="t('deviceManage.sparePart.partTypePlaceholder')" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('deviceManage.sparePart.minStock')" prop="minStock" required>
              <el-input-number v-model="editFormData.minStock" :min="0" :placeholder="t('deviceManage.sparePart.minStockPlaceholder')" style="width: 100%" controls-position="right" />
            </el-form-item>
            <el-form-item :label="t('deviceManage.sparePart.maxStock')" prop="maxStock">
              <el-input-number v-model="editFormData.maxStock" :min="0" :placeholder="t('deviceManage.sparePart.maxStockPlaceholder')" style="width: 100%" controls-position="right" />
            </el-form-item>
            <el-form-item :label="t('deviceManage.sparePart.location')" prop="location">
              <el-input v-model="editFormData.location" :placeholder="t('deviceManage.sparePart.locationPlaceholder')" />
            </el-form-item>
            <el-form-item :label="t('deviceManage.sparePart.supplier')" prop="supplier">
              <el-input v-model="editFormData.supplier" :placeholder="t('deviceManage.sparePart.supplierPlaceholder')" />
            </el-form-item>
            <el-form-item :label="t('deviceManage.sparePart.remark')" prop="remark">
              <el-input v-model="editFormData.remark" :placeholder="t('deviceManage.sparePart.remarkPlaceholder')" type="textarea" :rows="2" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="t('deviceManage.sparePart.status')" prop="status">
          <el-radio-group v-model="editFormData.status">
            <el-radio label="ENABLE">{{ t('deviceManage.sparePart.statusEnable') }}</el-radio>
            <el-radio label="DISABLE">{{ t('deviceManage.sparePart.statusDisable') }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">{{ t('publicText.cancel') }}</el-button>
        <el-button type="primary" @click="submitEditForm" :loading="submitLoading">{{ t('publicText.confirm') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onBeforeMount, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { useUserStoreWithOut } from '@/stores/modules/user';
import { calculateColumnsWidth } from '@/utils/tableminWidth';
import { GetPartsList, CreatePart, UpdatePart } from '@/api/deviceManage/sparePart';

const { t } = useI18n();
const userStore = useUserStoreWithOut();

// ---------- 表格数据 ----------
const tableData = ref<any[]>([]);
const total = ref(0);
const tableHeight = ref(0);
const tableRef = ref();
const loading = ref(false);
const submitLoading = ref(false);

// 查询参数
const queryParams = reactive({
  partCode: '',
  partName: '',
  status: '',
  pageIndex: 1,
  pageSize: 20,
});

// 表格列宽自适应
const tableColumns = computed(() => {
  if (!tableRef.value) return [];
  const columns = tableRef.value.columns
    .map((item: any) => ({ prop: item.property, label: item.label }))
    .filter((item: any) => item.label !== t('publicText.index') && item.label !== t('publicText.operation'));
  return columns;
});

const columnWidths = computed(() => {
  return calculateColumnsWidth(tableColumns.value, tableData.value, { padding: 25, fontSize: 13 });
});

const getColumnWidth = (prop: string) => columnWidths.value[prop] || 'auto';

// ---------- 获取数据 ----------
const getData = async () => {
  loading.value = true;
  try {
    const res: any = await GetPartsList(queryParams);
    if (res.Success) {
      tableData.value = res.Data?.Items || [];
      total.value = res.Data?.Total || 0;
    } else {
      ElMessage.error(res.Message || t('message.queryFailure'));
    }
  } catch (error) {
    console.error('查询失败:', error);
    tableData.value = [];
    total.value = 0;
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  queryParams.pageIndex = 1;
  getData();
};

const resetSearch = () => {
  queryParams.partCode = '';
  queryParams.partName = '';
  queryParams.status = '';
  queryParams.pageIndex = 1;
  getData();
};

const handleSizeChange = (val: number) => {
  queryParams.pageSize = val;
  queryParams.pageIndex = 1;
  getData();
};

const handleCurrentChange = (val: number) => {
  queryParams.pageIndex = val;
  getData();
};

// ---------- 新增对话框 ----------
const addDialogVisible = ref(false);
const addFormRef = ref();
const addFormData = reactive({
  partCode: '',
  partName: '',
  partSpec: '',
  unit: '',
  partType: '',
  minStock: 0,
  maxStock: 0,
  location: '',
  supplier: '',
  remark: '',
  status: 'ENABLE',
});

const addFormRules = {
  partCode: [{ required: true, message: t('message.pleaseInput') + t('deviceManage.sparePart.partCode'), trigger: 'blur' }],
  partName: [{ required: true, message: t('message.pleaseInput') + t('deviceManage.sparePart.partName'), trigger: 'blur' }],
  minStock: [{ required: true, message: t('message.pleaseInput') + t('deviceManage.sparePart.minStock'), trigger: 'blur' }],
};

const openAddDialog = () => {
  resetAddForm();
  addDialogVisible.value = true;
};

const resetAddForm = () => {
  addFormData.partCode = '';
  addFormData.partName = '';
  addFormData.partSpec = '';
  addFormData.unit = '';
  addFormData.partType = '';
  addFormData.minStock = 0;
  addFormData.maxStock = 0;
  addFormData.location = '';
  addFormData.supplier = '';
  addFormData.remark = '';
  addFormData.status = 'ENABLE';
};

const submitAddForm = async () => {
  await addFormRef.value.validate();
  submitLoading.value = true;
  try {
    const currentUser = userStore.getUserInfo || 'system';
    const payload = {
      partCode: addFormData.partCode,
      partName: addFormData.partName,
      partSpec: addFormData.partSpec,
      unit: addFormData.unit,
      partType: addFormData.partType,
      minStock: addFormData.minStock,
      maxStock: addFormData.maxStock,
      location: addFormData.location,
      supplier: addFormData.supplier,
      remark: addFormData.remark,
      status: addFormData.status,
      operatorUser: currentUser,
    };
    const res: any = await CreatePart(payload);
    if (res.Success) {
      ElMessage.success(t('message.addSuccess'));
      addDialogVisible.value = false;
      getData();
    } else {
      ElMessage.error(res.Message || t('message.addFailure'));
    }
  } catch (error) {
    console.error('新增失败:', error);
    ElMessage.error(t('message.submitFailure'));
  } finally {
    submitLoading.value = false;
  }
};

const handleAddDialogClosed = () => {
  addFormRef.value?.resetFields();
  resetAddForm();
};

// ---------- 编辑对话框 ----------
const editDialogVisible = ref(false);
const editFormRef = ref();
const editFormData = reactive({
  partId: 0,
  partCode: '',
  partName: '',
  partSpec: '',
  unit: '',
  partType: '',
  minStock: 0,
  maxStock: 0,
  location: '',
  supplier: '',
  remark: '',
  status: 'ENABLE',
});

const editFormRules = {
  partCode: [{ required: true, message: t('message.pleaseInput') + t('deviceManage.sparePart.partCode'), trigger: 'blur' }],
  partName: [{ required: true, message: t('message.pleaseInput') + t('deviceManage.sparePart.partName'), trigger: 'blur' }],
  minStock: [{ required: true, message: t('message.pleaseInput') + t('deviceManage.sparePart.minStock'), trigger: 'blur' }],
};

const openEditDialog = (row: any) => {
  // 回填数据（使用大写开头的字段名）
  editFormData.partId = row.PartId;
  editFormData.partCode = row.PartCode;
  editFormData.partName = row.PartName;
  editFormData.partSpec = row.PartSpec || '';
  editFormData.unit = row.Unit || '';
  editFormData.partType = row.PartType || '';
  editFormData.minStock = row.MinStock ?? 0;
  editFormData.maxStock = row.MaxStock ?? 0;
  editFormData.location = row.Location || '';
  editFormData.supplier = row.Supplier || '';
  editFormData.remark = row.Remark || '';
  editFormData.status = row.Status || 'ENABLE';
  editDialogVisible.value = true;
};

const resetEditForm = () => {
  editFormData.partId = 0;
  editFormData.partCode = '';
  editFormData.partName = '';
  editFormData.partSpec = '';
  editFormData.unit = '';
  editFormData.partType = '';
  editFormData.minStock = 0;
  editFormData.maxStock = 0;
  editFormData.location = '';
  editFormData.supplier = '';
  editFormData.remark = '';
  editFormData.status = 'ENABLE';
};

const submitEditForm = async () => {
  await editFormRef.value.validate();
  submitLoading.value = true;
  try {
    const currentUser = userStore.getUserInfo || 'system';
    const payload = {
      partId: editFormData.partId,
      partCode: editFormData.partCode,
      partName: editFormData.partName,
      partSpec: editFormData.partSpec,
      unit: editFormData.unit,
      partType: editFormData.partType,
      minStock: editFormData.minStock,
      maxStock: editFormData.maxStock,
      location: editFormData.location,
      supplier: editFormData.supplier,
      remark: editFormData.remark,
      status: editFormData.status,
      operatorUser: currentUser,
    };
    const res: any = await UpdatePart(payload);
    if (res.Success) {
      ElMessage.success(t('message.editSuccess'));
      editDialogVisible.value = false;
      getData();
    } else {
      ElMessage.error(res.Message || t('message.editFailure'));
    }
  } catch (error) {
    console.error('编辑失败:', error);
    ElMessage.error(t('message.submitFailure'));
  } finally {
    submitLoading.value = false;
  }
};

const handleEditDialogClosed = () => {
  editFormRef.value?.resetFields();
  resetEditForm();
};

// ---------- 窗口自适应 ----------
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
  window.addEventListener('resize', getScreenHeight);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', getScreenHeight);
});
</script>

<style scoped>
.el-pagination {
  justify-content: center;
}
</style>