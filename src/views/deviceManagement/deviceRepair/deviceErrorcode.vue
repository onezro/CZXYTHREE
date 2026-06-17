<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <div class="flex justify-between items-center">
        <!-- 查询表单 -->
        <el-form ref="queryFormRef" :inline="true" :model="queryParams" label-width="auto" @submit.prevent>
          <el-form-item :label="t('deviceManage.faultCode.code')" class="mb-2">
            <el-input v-model="queryParams.Code" :placeholder="t('deviceManage.faultCode.codePlaceholder')"
              clearable style="width: 150px" size="small" />
          </el-form-item>
          <el-form-item :label="t('deviceManage.faultCode.name')" class="mb-2">
            <el-input v-model="queryParams.Name" :placeholder="t('deviceManage.faultCode.namePlaceholder')"
              clearable style="width: 150px" size="small" />
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
        highlight-current-row tooltip-effect="light">
        <el-table-column type="index" :label="t('publicText.index')" width="55" fixed="left" align="center">
          <template #default="{ $index }">
            {{ $index + 1 + (queryParams.PageIndex - 1) * queryParams.PageSize }}
          </template>
        </el-table-column>
        <el-table-column prop="Code" :label="t('deviceManage.faultCode.code')" :min-width="getColumnWidth('Code')" />
        <el-table-column prop="Name" :label="t('deviceManage.faultCode.name')" :min-width="getColumnWidth('Name')" />
        <el-table-column prop="Description" :label="t('deviceManage.faultCode.description')" :min-width="getColumnWidth('Description')" />
        <el-table-column prop="CreateBy" :label="t('deviceManage.faultCode.createBy')" :min-width="getColumnWidth('CreateBy')" />
        <el-table-column prop="CreateTime" :label="t('deviceManage.faultCode.createTime')" :min-width="getColumnWidth('CreateTime')" />
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
        <el-form-item :label="t('deviceManage.faultCode.code')" prop="Code" required>
          <el-input v-model="formData.Code" :placeholder="t('deviceManage.faultCode.codePlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('deviceManage.faultCode.name')" prop="Name" required>
          <el-input v-model="formData.Name" :placeholder="t('deviceManage.faultCode.namePlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('deviceManage.faultCode.description')" prop="Description">
          <el-input v-model="formData.Description" :placeholder="t('deviceManage.faultCode.descriptionPlaceholder')" type="textarea" :rows="3" />
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
import { GetFaultCodes, UpdateFaultCode, DeleteFaultCode, CreateFaultCode } from '@/api/deviceManage/deviceRepair';

const { t } = useI18n();
const userStore = useUserStoreWithOut();

const tableData = ref<any[]>([]);
const total = ref(0);
const tableHeight = ref(0);
const tableRef = ref();
const loading = ref(false);
const submitLoading = ref(false);

const queryParams = reactive({
  Code: '',
  Name: '',
  PageIndex: 1,
  PageSize: 20,
});

const dialogVisible = ref(false);
const isEdit = ref(false);
const formRef = ref();
const formData = reactive({
  CodeId: 0,
  Code: '',
  Name: '',
  Description: '',
  CreateBy: '',  // 编辑时保留原创建人，用于更新接口
});

const formRules = {
  Code: [{ required: true, message: t('message.pleaseInput') + t('deviceManage.faultCode.code'), trigger: 'blur' }],
  Name: [{ required: true, message: t('message.pleaseInput') + t('deviceManage.faultCode.name'), trigger: 'blur' }],
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
    const res: any = await GetFaultCodes(queryParams);
    if (res.Success) {
      tableData.value = res.Data.Items || [];
      total.value = res.Data.Total || 0;
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
  queryParams.Code = '';
  queryParams.Name = '';
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
  formData.CodeId = row.CodeId;
  formData.Code = row.Code;
  formData.Name = row.Name;
  formData.Description = row.Description || '';
  formData.CreateBy = row.CreateBy || '';  // 保存原创建人
  dialogVisible.value = true;
};

const resetFormData = () => {
  formData.CodeId = 0;
  formData.Code = '';
  formData.Name = '';
  formData.Description = '';
  formData.CreateBy = '';
};

const submitForm = async () => {
  await formRef.value.validate();
  submitLoading.value = true;
  try {
    const currentUser = userStore.getUserInfo || 'system';
    let res: any;
    if (isEdit.value) {
      res = await UpdateFaultCode({
        CodeId: formData.CodeId,
        UpdateBy: currentUser,
        Code: formData.Code,
        Name: formData.Name,
        Description: formData.Description,
        CreateBy: formData.CreateBy, // 按接口要求传递
      });
      if (res.Success) ElMessage.success(t('message.editSuccess'));
    } else {
      res = await CreateFaultCode({
        Code: formData.Code,
        Name: formData.Name,
        Description: formData.Description,
        CreateBy: currentUser,
      });
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
    `${t('publicText.confirm')}${t('publicText.delete')}【${row.Code}】?`,
    t('publicText.tip'),
    { confirmButtonText: t('publicText.confirm'), cancelButtonText: t('publicText.cancel'), type: 'warning' }
  )
    .then(async () => {
      loading.value = true;
      try {
        const res: any = await DeleteFaultCode({ CodeId: row.CodeId });
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