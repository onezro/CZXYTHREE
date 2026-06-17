<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <div class="flex justify-between items-center">
        <!-- 查询表单 -->
        <el-form ref="queryFormRef" :inline="true" :model="queryParams" label-width="auto" @submit.prevent>
          <el-form-item :label="t('deviceManage.repairRecord.orderNo')" class="mb-2">
            <el-input v-model="queryParams.orderNo" :placeholder="t('deviceManage.repairRecord.orderNoPlaceholder')"
              clearable style="width: 160px" size="small" />
          </el-form-item>
          <el-form-item :label="t('deviceManage.repairRecord.repairUserName')" class="mb-2">
            <el-input v-model="queryParams.repairUserName" :placeholder="t('deviceManage.repairRecord.repairUserNamePlaceholder')"
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
        highlight-current-row tooltip-effect="light" v-loading="loading">
        <el-table-column type="index" :label="t('publicText.index')" width="55" fixed="left" align="center">
          <template #default="{ $index }">
            {{ $index + 1 + (queryParams.pageIndex - 1) * queryParams.pageSize }}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="RecordId" :label="t('deviceManage.repairRecord.recordId')" :min-width="getColumnWidth('RecordId')" /> -->
        <el-table-column prop="OrderNo" :label="t('deviceManage.repairRecord.orderNo')" :min-width="getColumnWidth('OrderNo')" />
        <el-table-column prop="RepairType" :label="t('deviceManage.repairRecord.repairType')" :min-width="getColumnWidth('RepairType')" />
        <el-table-column prop="RepairUserName" :label="t('deviceManage.repairRecord.repairUserName')" :min-width="getColumnWidth('RepairUserName')" />
        <el-table-column prop="SignInTime" :label="t('deviceManage.repairRecord.signInTime')" :min-width="getColumnWidth('SignInTime')" />
        <el-table-column prop="RepairStartTime" :label="t('deviceManage.repairRecord.repairStartTime')" :min-width="getColumnWidth('RepairStartTime')" />
        <el-table-column prop="RepairEndTime" :label="t('deviceManage.repairRecord.repairEndTime')" :min-width="getColumnWidth('RepairEndTime')" />
        <el-table-column prop="RepairResult" :label="t('deviceManage.repairRecord.repairResult')" :min-width="getColumnWidth('RepairResult')" show-overflow-tooltip />
        <el-table-column prop="PastTo" :label="t('deviceManage.repairRecord.pastTo')" :min-width="getColumnWidth('PastTo')" />
        <el-table-column prop="ReplacePartFlag" :label="t('deviceManage.repairRecord.replacePartFlag')" :min-width="getColumnWidth('ReplacePartFlag')" align="center">
          <template #default="{ row }">
            <el-tag :type="row.ReplacePartFlag ? 'success' : 'info'" size="small">
              {{ row.ReplacePartFlag ? t('publicText.yes') : t('publicText.no') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="CreateTime" :label="t('deviceManage.repairRecord.createTime')" :min-width="getColumnWidth('CreateTime')" />
        <el-table-column prop="CreateBy" :label="t('deviceManage.repairRecord.createBy')" :min-width="getColumnWidth('CreateBy')" />
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
          @current-change="handleCurrentChange" :current-page="queryParams.pageIndex" :page-size="queryParams.pageSize"
          :page-sizes="[10, 20, 50, 100, 200]" layout="total,sizes, prev, pager, next" :total="total" />
      </div>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="800px" align-center :close-on-click-modal="false"
      @closed="handleDialogClosed">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px" size="small" label-position="right">
        <el-row :gutter="20">
          <el-col :span="12">
            <!-- 编辑时显示记录ID，只读 -->
            <el-form-item :label="t('deviceManage.repairRecord.recordId')" prop="RecordId" v-if="isEdit">
              <el-input v-model="formData.RecordId" disabled />
            </el-form-item>
            <el-form-item :label="t('deviceManage.repairRecord.repairOrderId')" prop="RepairOrderId" required>
              <el-input-number v-model="formData.RepairOrderId" :min="1" :placeholder="t('deviceManage.repairRecord.repairOrderIdPlaceholder')" style="width: 100%" controls-position="right" />
            </el-form-item>
            <el-form-item :label="t('deviceManage.repairRecord.repairType')" prop="RepairType">
              <el-input v-model="formData.RepairType" :placeholder="t('deviceManage.repairRecord.repairTypePlaceholder')" />
            </el-form-item>
            <el-form-item :label="t('deviceManage.repairRecord.repairUserId')" prop="RepairUserId">
              <el-input v-model="formData.RepairUserId" :placeholder="t('deviceManage.repairRecord.repairUserIdPlaceholder')" />
            </el-form-item>
            <el-form-item :label="t('deviceManage.repairRecord.repairUserName')" prop="RepairUserName">
              <el-input v-model="formData.RepairUserName" :placeholder="t('deviceManage.repairRecord.repairUserNamePlaceholder')" />
            </el-form-item>
            <el-form-item :label="t('deviceManage.repairRecord.signInTime')" prop="SignInTime">
              <el-date-picker v-model="formData.SignInTime" type="datetime" :placeholder="t('deviceManage.repairRecord.signInTimePlaceholder')" style="width: 100%" value-format="YYYY-MM-DD HH:mm:ss" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('deviceManage.repairRecord.repairStartTime')" prop="RepairStartTime">
              <el-date-picker v-model="formData.RepairStartTime" type="datetime" :placeholder="t('deviceManage.repairRecord.repairStartTimePlaceholder')" style="width: 100%" value-format="YYYY-MM-DD HH:mm:ss" />
            </el-form-item>
            <el-form-item :label="t('deviceManage.repairRecord.repairEndTime')" prop="RepairEndTime">
              <el-date-picker v-model="formData.RepairEndTime" type="datetime" :placeholder="t('deviceManage.repairRecord.repairEndTimePlaceholder')" style="width: 100%" value-format="YYYY-MM-DD HH:mm:ss" />
            </el-form-item>
            <el-form-item :label="t('deviceManage.repairRecord.repairResult')" prop="RepairResult">
              <el-input v-model="formData.RepairResult" :placeholder="t('deviceManage.repairRecord.repairResultPlaceholder')" />
            </el-form-item>
            <el-form-item :label="t('deviceManage.repairRecord.pastTo')" prop="PastTo">
              <el-input v-model="formData.PastTo" :placeholder="t('deviceManage.repairRecord.pastToPlaceholder')" />
            </el-form-item>
            <el-form-item :label="t('deviceManage.repairRecord.replacePartFlag')" prop="ReplacePartFlag">
              <el-switch v-model="formData.ReplacePartFlag" active-value="true" inactive-value="false" />
            </el-form-item>
            <el-form-item :label="t('deviceManage.repairRecord.remark')" prop="Remark">
              <el-input v-model="formData.Remark" :placeholder="t('deviceManage.repairRecord.remarkPlaceholder')" type="textarea" :rows="2" />
            </el-form-item>
          </el-col>
        </el-row>
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
import { GetRepairRecords, CreateRepairRecord, UpdateRepairRecord, DeleteRepairRecord } from '@/api/deviceManage/deviceRepair';

const { t } = useI18n();
const userStore = useUserStoreWithOut();

const tableData = ref<any[]>([]);
const total = ref(0);
const tableHeight = ref(0);
const tableRef = ref();
const loading = ref(false);
const submitLoading = ref(false);

// 查询参数（字段名小写，符合接口）
const queryParams = reactive({
  orderNo: '',
  repairUserName: '',
  pageIndex: 1,
  pageSize: 20,
});

// 表单数据
const dialogVisible = ref(false);
const isEdit = ref(false);
const formRef = ref();
const formData = reactive({
  RecordId: 0,
  RepairOrderId: 0,
  RepairType: '',
  RepairUserId: '',
  RepairUserName: '',
  SignInTime: '',
  RepairStartTime: '',
  RepairEndTime: '',
  RepairResult: '',
  PastTo: '',
  ReplacePartFlag: false,
  Remark: '',
  CreateBy: '',    // 新增时必填，编辑时不传
  UpdateBy: '',    // 编辑时必填
});

// 校验规则（只校验必填）
const formRules = {
  RepairOrderId: [{ required: true, message: t('message.pleaseInput') + t('deviceManage.repairRecord.repairOrderId'), trigger: 'blur' }],
};

const dialogTitle = computed(() => (isEdit.value ? t('publicText.edit') : t('publicText.add')));

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

// 获取列表数据
const getData = async () => {
  loading.value = true;
  try {
    const res: any = await GetRepairRecords(queryParams);
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
  queryParams.orderNo = '';
  queryParams.repairUserName = '';
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

// 打开新增
const openAdd = () => {
  isEdit.value = false;
  resetFormData();
  dialogVisible.value = true;
};

// 打开编辑
const openEdit = (row: any) => {
  isEdit.value = true;
  // 回填所有字段
  formData.RecordId = row.RecordId;
  formData.RepairOrderId = row.RepairOrderId;
  formData.RepairType = row.RepairType || '';
  formData.RepairUserId = row.RepairUserId || '';
  formData.RepairUserName = row.RepairUserName || '';
  formData.SignInTime = row.SignInTime || '';
  formData.RepairStartTime = row.RepairStartTime || '';
  formData.RepairEndTime = row.RepairEndTime || '';
  formData.RepairResult = row.RepairResult || '';
  formData.PastTo = row.PastTo || '';
  formData.ReplacePartFlag = row.ReplacePartFlag ?? false;
  formData.Remark = row.Remark || '';
  formData.CreateBy = row.CreateBy || '';  // 仅用于展示，实际编辑不传
  dialogVisible.value = true;
};

const resetFormData = () => {
  formData.RecordId = 0;
  formData.RepairOrderId = 0;
  formData.RepairType = '';
  formData.RepairUserId = '';
  formData.RepairUserName = '';
  formData.SignInTime = '';
  formData.RepairStartTime = '';
  formData.RepairEndTime = '';
  formData.RepairResult = '';
  formData.PastTo = '';
  formData.ReplacePartFlag = false;
  formData.Remark = '';
  formData.CreateBy = '';
  formData.UpdateBy = '';
};

// 提交表单
const submitForm = async () => {
  await formRef.value.validate();
  submitLoading.value = true;
  try {
    const currentUser = userStore.getUserInfo || 'system';
    let res: any;
    // 公共载荷
    const payload: any = {
      RepairOrderId: formData.RepairOrderId,
      RepairType: formData.RepairType,
      RepairUserId: formData.RepairUserId,
      RepairUserName: formData.RepairUserName,
      SignInTime: formData.SignInTime,
      RepairStartTime: formData.RepairStartTime,
      RepairEndTime: formData.RepairEndTime,
      RepairResult: formData.RepairResult,
      PastTo: formData.PastTo,
      ReplacePartFlag: formData.ReplacePartFlag,
      Remark: formData.Remark,
    };

    if (isEdit.value) {
      payload.RecordId = formData.RecordId;
      payload.UpdateBy = currentUser;
      res = await UpdateRepairRecord(payload);
      if (res.Success) ElMessage.success(t('message.editSuccess'));
    } else {
      payload.CreateBy = currentUser;
      res = await CreateRepairRecord(payload);
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

// 删除记录
const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    `${t('publicText.confirm')}${t('publicText.delete')}【${row.OrderNo}】的维修记录?`,
    t('publicText.tip'),
    { confirmButtonText: t('publicText.confirm'), cancelButtonText: t('publicText.cancel'), type: 'warning' }
  )
    .then(async () => {
      loading.value = true;
      try {
        const res: any = await DeleteRepairRecord({ RecordId: row.RecordId });
        if (res.Success) {
          ElMessage.success(t('message.deleteSuccess'));
          if (tableData.value.length === 1 && queryParams.pageIndex > 1) queryParams.pageIndex--;
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