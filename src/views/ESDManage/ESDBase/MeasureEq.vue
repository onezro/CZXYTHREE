<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <div class="flex justify-between items-center">
        <!-- 查询表单 -->
        <el-form ref="queryFormRef" :inline="true" :model="queryParams" label-width="auto" @submit.prevent>
          <el-form-item :label="t('esd.measureDevice.device')" class="mb-2">
            <el-input v-model="queryParams.MeasureDevice" :placeholder="t('esd.measureDevice.devicePlaceholder')"
              clearable style="width: 200px" size="small" />
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
        <el-table-column prop="MeasureDevice" :label="t('esd.measureDevice.device')"
          :min-width="getColumnWidth('MeasureDevice')" />
       
        <el-table-column prop="CreateTime" :label="t('esd.measureDevice.createTime')"
          :min-width="getColumnWidth('CreateTime')" />
        <el-table-column prop="CreateUser" :label="t('esd.measureDevice.createUser')"
          :min-width="getColumnWidth('CreateUser')" />
        <el-table-column prop="UpdateTime" :label="t('esd.measureDevice.updateTime')"
          :min-width="getColumnWidth('UpdateTime')" />
        <el-table-column prop="UpdateUser" :label="t('esd.measureDevice.updateUser')"
          :min-width="getColumnWidth('UpdateUser')" />
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
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="500px" align-center :close-on-click-modal="false"
      @closed="handleDialogClosed">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" size="small">
        <el-form-item :label="t('esd.measureDevice.device')" prop="MeasureDevice" required>
          <el-input v-model="formData.MeasureDevice" :placeholder="t('esd.measureDevice.devicePlaceholder')" />
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
import { QueryMeasureDeviceList, AddMeasureDevice, UpdateMeasureDevice, DeleteMeasureDevice } from '@/api/esdManage/base';
import dayjs from 'dayjs';
const { t } = useI18n();
const userStore = useUserStoreWithOut();

const tableData = ref<any[]>([]);
const total = ref(0);
const tableHeight = ref(0);
const tableRef = ref();
const loading = ref(false);
const submitLoading = ref(false);

const queryParams = reactive({
  MeasureDevice: '',
  PageIndex: 1,
  PageSize: 20,
});

const dialogVisible = ref(false);
const isEdit = ref(false);
const formRef = ref();
const formData = reactive({
  Id: '',
  MeasureDevice: '',
});

const formRules = {
  MeasureDevice: [{ required: true, message: t('message.pleaseInput') + t('esd.measureDevice.device'), trigger: 'blur' }],
};

const dialogTitle = computed(() => (isEdit.value ? t('publicText.edit') : t('publicText.add')));

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



const getData = async () => {
  loading.value = true;
  try {
    const res: any = await QueryMeasureDeviceList(queryParams);
    if (res.Success) {
      tableData.value = (res.Data.rows || []).map((item: any) => ({
        ...item,
        CreateTime: dayjs(item.CreateTime).format('YYYY-MM-DD HH:mm:ss'),
        UpdateTime: dayjs(item.UpdateTime).format('YYYY-MM-DD HH:mm:ss'),
      }));
      total.value = res.Data.total || 0;
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
  queryParams.PageIndex = 1;
  getData();
};

const resetSearch = () => {
  queryParams.MeasureDevice = '';
  queryParams.PageIndex = 1;
  getData();
};

const handleSizeChange = (val: number) => {
  queryParams.PageSize = val;
  queryParams.PageIndex = 1;
  getData();
};

const handleCurrentChange = (val: number) => {
  queryParams.PageIndex = val;
  getData();
};

const openAdd = () => {
  isEdit.value = false;
  resetFormData();
  dialogVisible.value = true;
};

const openEdit = (row: any) => {
  isEdit.value = true;
  formData.Id = row.Id;
  formData.MeasureDevice = row.MeasureDevice;
  dialogVisible.value = true;
};

const resetFormData = () => {
  formData.Id = '';
  formData.MeasureDevice = '';
};

const submitForm = async () => {
  await formRef.value.validate();
  submitLoading.value = true;
  try {
    const currentUser = userStore.getUserInfo || 'system';
    let res: any;
    if (isEdit.value) {
      res = await UpdateMeasureDevice({ Id: formData.Id, MeasureDevice: formData.MeasureDevice, UserName: currentUser });
      if (res.Success) ElMessage.success(t('message.editSuccess'));
    } else {
      res = await AddMeasureDevice({ MeasureDevice: formData.MeasureDevice, UserName: currentUser });
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

const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    `${t('publicText.confirm')}${t('publicText.delete')}【${row.MeasureDevice}】?`,
    t('publicText.tip'),
    { confirmButtonText: t('publicText.confirm'), cancelButtonText: t('publicText.cancel'), type: 'warning' }
  )
    .then(async () => {
      loading.value = true;
      try {
        const currentUser = userStore.getUserInfo || 'system';
        const res: any = await DeleteMeasureDevice({ Id: row.Id, UserName: currentUser });
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
        loading.value = false;
      }
    })
    .catch(() => ElMessage.info(t('publicText.cancel')));
};

const handleDialogClosed = () => {
  formRef.value?.resetFields();
  resetFormData();
};

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