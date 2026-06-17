<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <div class="flex justify-between items-center">
        <!-- 查询表单 -->
        <el-form ref="queryFormRef" :inline="true" :model="queryParams" label-width="auto" @submit.prevent>
          <el-form-item :label="t('esd.device.workshop')" class="mb-2">
            <el-input v-model="queryParams.Workshop" :placeholder="t('esd.device.workshopPlaceholder')" clearable
              style="width: 150px" size="small" />
          </el-form-item>
          <el-form-item :label="t('esd.device.esdType')" class="mb-2">
            <el-input v-model="queryParams.EsdType" :placeholder="t('esd.device.esdTypePlaceholder')" clearable
              style="width: 150px" size="small" />
          </el-form-item>
          <el-form-item :label="t('esd.device.deviceName')" class="mb-2">
            <el-input v-model="queryParams.DeviceName" :placeholder="t('esd.device.deviceNamePlaceholder')" clearable
              style="width: 150px" size="small" />
          </el-form-item>
          <el-form-item class="mb-2">
            <el-button type="primary" @click="handleSearch" :size="'small'">{{ t("publicText.query") }}</el-button>
            <el-button @click="resetSearch" :size="'small'">{{ t("publicText.reset") }}</el-button>
          </el-form-item>
        </el-form>

        <div class="mb-2">
          <el-button type="warning" @click="openAdd" :size="'small'">
            {{ t("publicText.add") }}
          </el-button>
        </div>
      </div>

      <el-table :data="tableData" ref="tableRef" border :height="tableHeight" style="width: 100%" stripe size="small"
        highlight-current-row tooltip-effect="light" v-loading="loading">
        <el-table-column type="index" :label="t('publicText.index')" width="55" fixed="left" align="center">
          <template #default="{ $index }">
            {{ $index + 1 + (queryParams.PageIndex - 1) * queryParams.PageSize }}
          </template>
        </el-table-column>
        <el-table-column prop="Factory" :label="t('esd.device.factory')" :min-width="getColumnWidth('Factory')" />
        <el-table-column prop="Workshop" :label="t('esd.device.workshop')" :min-width="getColumnWidth('Workshop')" />
        <el-table-column prop="LineName" :label="t('esd.device.lineName')" :min-width="getColumnWidth('LineName')" />
        <el-table-column prop="DeviceName" :label="t('esd.device.deviceName')" :min-width="getColumnWidth('DeviceName')" />
        <el-table-column prop="DeviceCode" :label="t('esd.device.deviceCode')" :min-width="getColumnWidth('DeviceCode')" />
        <el-table-column prop="EsdCategory" :label="t('esd.device.esdCategory')" :min-width="getColumnWidth('EsdCategory')" />
        <el-table-column prop="EsdType" :label="t('esd.device.esdType')" :min-width="getColumnWidth('EsdType')" />
        <!-- <el-table-column prop="Status" :label="t('esd.device.status')" :min-width="getColumnWidth('Status')">
          <template #default="{ row }">
            <el-tag :type="row.Status === 0 ? 'success' : 'danger'" size="small">
              {{ row.Status === 0 ? t('esd.device.enable') : t('esd.device.disable') }}
            </el-tag>
          </template>
        </el-table-column> -->
        <el-table-column prop="CreateTime" :label="t('esd.device.createTime')" :min-width="getColumnWidth('CreateTime')" />
        <el-table-column prop="CreateUser" :label="t('esd.device.createUser')" :min-width="getColumnWidth('CreateUser')" />
        <el-table-column :label="$t('publicText.operation')" fixed="right" width="120" align="center">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="openEdit(row)" icon="Edit" />
            <el-button size="small" type="danger" @click="handleDelete(row)" icon="Delete" />
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
          @current-change="handleCurrentChange" :current-page="queryParams.PageIndex" :page-size="queryParams.PageSize"
          :page-sizes="[10, 20, 50, 100, 200]" layout="total,sizes, prev, pager, next" :total="total" />
      </div>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="600px" align-center :close-on-click-modal="false"
      @closed="handleDialogClosed">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px" size="small">
        <el-form-item :label="t('esd.device.factory')" prop="Factory">
          <el-input v-model="formData.Factory" :placeholder="t('esd.device.factoryPlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('esd.device.workshop')" prop="Workshop" required>
          <el-input v-model="formData.Workshop" :placeholder="t('esd.device.workshopPlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('esd.device.lineName')" prop="LineName" required>
          <el-input v-model="formData.LineName" :placeholder="t('esd.device.lineNamePlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('esd.device.deviceName')" prop="DeviceName" required>
          <el-input v-model="formData.DeviceName" :placeholder="t('esd.device.deviceNamePlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('esd.device.deviceCode')" prop="DeviceCode" required>
          <el-input v-model="formData.DeviceCode" :placeholder="t('esd.device.deviceCodePlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('esd.device.esdCategory')" prop="EsdCategory" required>
          <el-input v-model="formData.EsdCategory" :placeholder="t('esd.device.esdCategoryPlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('esd.device.esdType')" prop="EsdType" required>
          <el-input v-model="formData.EsdType" :placeholder="t('esd.device.esdTypePlaceholder')" />
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
import { ref, reactive, computed, onBeforeMount, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { useUserStoreWithOut } from '@/stores/modules/user';
import { calculateColumnsWidth } from '@/utils/tableminWidth';
import { QueryEsdObjectList, AddEsdObject, UpdateEsdObject, DeleteEsdObject } from '@/api/esdManage/base';

const { t } = useI18n();
const userStore = useUserStoreWithOut();

// 表格数据
const tableData = ref<any[]>([]);
const total = ref(0);
const tableHeight = ref(0);
const tableRef = ref();
const loading = ref(false);
const submitLoading = ref(false);

// 查询参数
const queryParams = reactive({
  Workshop: '',
  EsdType: '',
  DeviceName: '',
  PageIndex: 1,
  PageSize: 20,
});

// 新增/编辑对话框
const dialogVisible = ref(false);
const isEdit = ref(false);
const formRef = ref();
const formData = reactive({
  Id: '',
  Factory: '',
  Workshop: '',
  LineName: '',
  DeviceName: '',
  DeviceCode: '',
  EsdCategory: '',
  EsdType: '',
});

// 表单验证规则
const formRules = {
  Workshop: [{ required: true, message: t('message.pleaseInput') + t('esd.device.workshop'), trigger: 'blur' }],
  LineName: [{ required: true, message: t('message.pleaseInput') + t('esd.device.lineName'), trigger: 'blur' }],
  DeviceName: [{ required: true, message: t('message.pleaseInput') + t('esd.device.deviceName'), trigger: 'blur' }],
  DeviceCode: [{ required: true, message: t('message.pleaseInput') + t('esd.device.deviceCode'), trigger: 'blur' }],
  EsdCategory: [{ required: true, message: t('message.pleaseInput') + t('esd.device.esdCategory'), trigger: 'blur' }],
  EsdType: [{ required: true, message: t('message.pleaseInput') + t('esd.device.esdType'), trigger: 'blur' }],
};

const dialogTitle = computed(() => (isEdit.value ? t('publicText.edit') : t('publicText.add')));

// 表格列宽自动计算
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



// 获取数据
const getData = async () => {
  try {
    const res: any = await QueryEsdObjectList(queryParams);
    if (res.Success) {
      tableData.value = res.Data.rows || [];
      total.value = res.Data.total || 0;
    } else {
      ElMessage.error(res.Message || t('message.queryFailure'));
    }
  } catch (error) {
    console.error('查询失败:', error);
    tableData.value = [];
    total.value = 0;
  } finally {
  }
};

// 搜索与重置
const handleSearch = () => {
  queryParams.PageIndex = 1;
  getData();
};

const resetSearch = () => {
  queryParams.Workshop = '';
  queryParams.EsdType = '';
  queryParams.DeviceName = '';
  queryParams.PageIndex = 1;
  getData();
};

// 分页
const handleSizeChange = (val: number) => {
  queryParams.PageSize = val;
  queryParams.PageIndex = 1;
  getData();
};

const handleCurrentChange = (val: number) => {
  queryParams.PageIndex = val;
  getData();
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
    Id: row.Id,
    Factory: row.Factory,
    Workshop: row.Workshop,
    LineName: row.LineName,
    DeviceName: row.DeviceName,
    DeviceCode: row.DeviceCode,
    EsdCategory: row.EsdCategory,
    EsdType: row.EsdType,
  });
  dialogVisible.value = true;
};

// 重置表单数据
const resetFormData = () => {
  formData.Id = '';
  formData.Factory = '';
  formData.Workshop = '';
  formData.LineName = '';
  formData.DeviceName = '';
  formData.DeviceCode = '';
  formData.EsdCategory = '';
  formData.EsdType = '';
};

// 提交表单
const submitForm = async () => {
  await formRef.value.validate();
  submitLoading.value = true;
  try {
    const currentUser = userStore.getUserInfo || 'system';
    let res: any;
    if (isEdit.value) {
      const updateParams = {
        Id: formData.Id,
        Factory: formData.Factory,
        Workshop: formData.Workshop,
        LineName: formData.LineName,
        DeviceName: formData.DeviceName,
        DeviceCode: formData.DeviceCode,
        EsdCategory: formData.EsdCategory,
        EsdType: formData.EsdType,
        UserName: currentUser,
      };
      res = await UpdateEsdObject(updateParams);
      if (res.Success) ElMessage.success(t('message.editSuccess'));
    } else {
      const addParams = {
        Factory: formData.Factory,
        Workshop: formData.Workshop,
        LineName: formData.LineName,
        DeviceName: formData.DeviceName,
        DeviceCode: formData.DeviceCode,
        EsdCategory: formData.EsdCategory,
        EsdType: formData.EsdType,
        UserName: currentUser,
      };
      res = await AddEsdObject(addParams);
      if (res.Success) ElMessage.success(t('message.addSuccess'));
    }
    if (res?.Success) {
      dialogVisible.value = false;
      getData();
    } else {
      ElMessage.error(res?.Message || (isEdit.value ? t('message.editFailure') : t('message.addFailure')));
    }
  } catch (error) {
    console.error('提交失败:', error);
    ElMessage.error(t('message.submitFailure'));
  } finally {
    submitLoading.value = false;
  }
};

// 删除
const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    `${t('publicText.confirm')}${t('publicText.delete')}【${row.DeviceCode} - ${row.DeviceName}】?`,
    t('publicText.tip'),
    { confirmButtonText: t('publicText.confirm'), cancelButtonText: t('publicText.cancel'), type: 'warning' }
  )
    .then(async () => {
    
      try {
        const currentUser = userStore.getUserInfo || 'system';
        const res: any = await DeleteEsdObject({ Id: row.Id, UserName: currentUser });
        if (res.Success) {
          ElMessage.success(t('message.deleteSuccess'));
          if (tableData.value.length === 1 && queryParams.PageIndex > 1) queryParams.PageIndex--;
          getData();
        } else {
          ElMessage.error(res.Message || t('message.deleteFailure'));
        }
      } catch (error) {
        ElMessage.error(t('message.deleteFailure'));
      } finally {
      }
    })
    .catch(() => ElMessage.info(t('publicText.cancel')));
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