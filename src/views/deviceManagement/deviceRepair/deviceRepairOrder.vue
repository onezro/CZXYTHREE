<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <div class="flex justify-between items-center">
        <!-- 查询表单 -->
        <el-form ref="queryFormRef" :inline="true" :model="queryParams" label-width="auto" @submit.prevent>
          <el-form-item :label="t('deviceManage.repairOrder.orderNo')" class="mb-2">
            <el-input v-model="queryParams.OrderNo" :placeholder="t('deviceManage.repairOrder.orderNoPlaceholder')"
              clearable style="width: 160px" size="small" />
          </el-form-item>
          <el-form-item :label="t('deviceManage.repairOrder.machineryCode')" class="mb-2">
            <el-input v-model="queryParams.MachineryCode" :placeholder="t('deviceManage.repairOrder.machineryCodePlaceholder')"
              clearable style="width: 140px" size="small" />
          </el-form-item>
          <el-form-item :label="t('deviceManage.repairOrder.status')" class="mb-2">
            <el-select v-model="queryParams.Status" :placeholder="t('deviceManage.repairOrder.statusPlaceholder')"
              clearable style="width: 130px" size="small">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
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
        <!-- 表格列保持不变 -->
        <el-table-column type="index" :label="t('publicText.index')" width="55" fixed="left" align="center">
          <template #default="{ $index }">
            {{ $index + 1 + (queryParams.PageIndex - 1) * queryParams.PageSize }}
          </template>
        </el-table-column>
        <el-table-column prop="OrderNo" :label="t('deviceManage.repairOrder.orderNo')" :min-width="getColumnWidth('OrderNo')" />
        <el-table-column prop="MachineryCode" :label="t('deviceManage.repairOrder.machineryCode')" :min-width="getColumnWidth('MachineryCode')" />
        <el-table-column prop="MachineryName" :label="t('deviceManage.repairOrder.machineryName')" :min-width="getColumnWidth('MachineryName')" />
        <el-table-column prop="FaultCode" :label="t('deviceManage.repairOrder.faultCode')" :min-width="getColumnWidth('FaultCode')" />
        <el-table-column prop="FaultLevel" :label="t('deviceManage.repairOrder.faultLevel')" :min-width="getColumnWidth('FaultLevel')" align="center">
          <template #default="{ row }">
            <el-tag :type="row.FaultLevel === 1 ? 'danger' : row.FaultLevel === 2 ? 'warning' : 'info'" size="small">
              {{ row.FaultLevel }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="FaultDesc" :label="t('deviceManage.repairOrder.faultDesc')" :min-width="getColumnWidth('FaultDesc')" show-overflow-tooltip />
        <el-table-column prop="Status" :label="t('deviceManage.repairOrder.status')" :min-width="getColumnWidth('Status')" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.Status)" size="small">
              {{ getStatusLabel(row.Status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="ReportUser" :label="t('deviceManage.repairOrder.reportUser')" :min-width="getColumnWidth('ReportUser')" />
        <el-table-column prop="CreateTime" :label="t('deviceManage.repairOrder.createTime')" :min-width="getColumnWidth('CreateTime')" />
        <el-table-column prop="CreateBy" :label="t('deviceManage.repairOrder.createBy')" :min-width="getColumnWidth('CreateBy')" />
        <el-table-column :label="$t('publicText.operation')" fixed="right" width="140" align="center">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="openEdit(row)" icon="Edit" />
            <el-button size="small" type="danger" @click="handleCancel(row)" icon="CircleClose" />
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
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="800px" align-center :close-on-click-modal="false"
      @closed="handleDialogClosed">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px" size="small" label-position="right">
        <el-row :gutter="20">
          <el-col :span="12">
            <!-- 工单号（编辑时显示） -->
            <el-form-item :label="t('deviceManage.repairOrder.orderNo')" prop="OrderNo" v-if="isEdit">
              <el-input v-model="formData.OrderNo" disabled />
            </el-form-item>
            <!-- 设备下拉选择（原为数字输入框） -->
            <el-form-item :label="t('deviceManage.repairOrder.machineryId')" prop="MachineryId" required>
              <el-select v-model="formData.MachineryId" :placeholder="t('deviceManage.repairOrder.machineryIdPlaceholder')" style="width: 100%" filterable>
                <el-option
                  v-for="item in machineryOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <!-- 故障码下拉选择（原为数字输入框） -->
            <el-form-item :label="t('deviceManage.repairOrder.faultCodeId')" prop="FaultCodeId" required>
              <el-select v-model="formData.FaultCodeId" :placeholder="t('deviceManage.repairOrder.faultCodeIdPlaceholder')" style="width: 100%" filterable>
                <el-option
                  v-for="item in faultCodeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="t('deviceManage.repairOrder.faultLevel')" prop="FaultLevel">
              <el-select v-model="formData.FaultLevel" :placeholder="t('deviceManage.repairOrder.faultLevelPlaceholder')" style="width: 100%">
                <el-option :label="1" :value="1" />
                <el-option :label="2" :value="2" />
                <el-option :label="3" :value="3" />
              </el-select>
            </el-form-item>
            <el-form-item :label="t('deviceManage.repairOrder.faultDesc')" prop="FaultDesc">
              <el-input v-model="formData.FaultDesc" :placeholder="t('deviceManage.repairOrder.faultDescPlaceholder')" />
            </el-form-item>
            <el-form-item :label="t('deviceManage.repairOrder.faultTime')" prop="FaultTime">
              <el-date-picker v-model="formData.FaultTime" type="datetime" :placeholder="t('deviceManage.repairOrder.faultTimePlaceholder')" style="width: 100%" value-format="YYYY-MM-DD HH:mm:ss" />
            </el-form-item>
            <el-form-item :label="t('deviceManage.repairOrder.reportSource')" prop="ReportSource">
              <el-input v-model="formData.ReportSource" :placeholder="t('deviceManage.repairOrder.reportSourcePlaceholder')" />
            </el-form-item>
            <!-- <el-form-item :label="t('deviceManage.repairOrder.reportUser')" prop="ReportUser">
              <el-input v-model="formData.ReportUser" :placeholder="t('deviceManage.repairOrder.reportUserPlaceholder')" />
            </el-form-item> -->
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('deviceManage.repairOrder.status')" prop="Status">
              <el-select v-model="formData.Status" :placeholder="t('deviceManage.repairOrder.statusPlaceholder')" style="width: 100%">
                <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item :label="t('deviceManage.repairOrder.dispatchTime')" prop="DispatchTime">
              <el-date-picker v-model="formData.DispatchTime" type="datetime" :placeholder="t('deviceManage.repairOrder.dispatchTimePlaceholder')" style="width: 100%" value-format="YYYY-MM-DD HH:mm:ss" />
            </el-form-item>
            <el-form-item :label="t('deviceManage.repairOrder.repairStartTime')" prop="RepairStartTime">
              <el-date-picker v-model="formData.RepairStartTime" type="datetime" :placeholder="t('deviceManage.repairOrder.repairStartTimePlaceholder')" style="width: 100%" value-format="YYYY-MM-DD HH:mm:ss" />
            </el-form-item>
            <el-form-item :label="t('deviceManage.repairOrder.repairEndTime')" prop="RepairEndTime">
              <el-date-picker v-model="formData.RepairEndTime" type="datetime" :placeholder="t('deviceManage.repairOrder.repairEndTimePlaceholder')" style="width: 100%" value-format="YYYY-MM-DD HH:mm:ss" />
            </el-form-item>
            <el-form-item :label="t('deviceManage.repairOrder.confirmTime')" prop="ConfirmTime">
              <el-date-picker v-model="formData.ConfirmTime" type="datetime" :placeholder="t('deviceManage.repairOrder.confirmTimePlaceholder')" style="width: 100%" value-format="YYYY-MM-DD HH:mm:ss" />
            </el-form-item>
            <!-- <el-form-item :label="t('deviceManage.repairOrder.confirmBy')" prop="ConfirmBy">
              <el-input v-model="formData.ConfirmBy" :placeholder="t('deviceManage.repairOrder.confirmByPlaceholder')" />
            </el-form-item> -->
            <el-form-item :label="t('deviceManage.repairOrder.repairResult')" prop="RepairResult">
              <el-input v-model="formData.RepairResult" :placeholder="t('deviceManage.repairOrder.repairResultPlaceholder')" />
            </el-form-item>
            <el-form-item :label="t('deviceManage.repairOrder.isOutsource')" prop="IsOutsource">
              <el-switch v-model="formData.IsOutsource" active-value="true" inactive-value="false" />
            </el-form-item>
            <el-form-item :label="t('deviceManage.repairOrder.outsourceVendor')" prop="OutsourceVendor">
              <el-input v-model="formData.OutsourceVendor" :placeholder="t('deviceManage.repairOrder.outsourceVendorPlaceholder')" />
            </el-form-item>
            <el-form-item :label="t('deviceManage.repairOrder.rootCause')" prop="RootCause">
              <el-input v-model="formData.RootCause" :placeholder="t('deviceManage.repairOrder.rootCausePlaceholder')" />
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
import {
  GetRepairOrders,
  CreateRepairOrder,
  UpdateRepairOrder,
  CancelRepairOrder, // 新增：获取设备列表
  GetFaultCodes,         // 已有，用于故障码下拉
} from '@/api/deviceManage/deviceRepair';
import {GetPagedMachineries} from '@/api/deviceManage/deviceLedger';

const { t } = useI18n();
const userStore = useUserStoreWithOut();

const tableData = ref<any[]>([]);
const total = ref(0);
const tableHeight = ref(0);
const tableRef = ref();
const loading = ref(false);
const submitLoading = ref(false);

// 状态枚举
const statusOptions = [
  { value: 'CREATED', label: t('deviceManage.repairOrder.statusCreated') },
  { value: 'COMPLETED', label: t('deviceManage.repairOrder.statusDispatched') },
  { value: 'REPAIRING', label: t('deviceManage.repairOrder.statusRepairing') },
  { value: 'COMPLETED', label: t('deviceManage.repairOrder.statusCompleted') },
  { value: 'CANCELED', label: t('deviceManage.repairOrder.statusCanceled') },
];

const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    CREATED: 'info',
    DISPATCHED: 'warning',
    REPAIRING: 'primary',
    COMPLETED: 'success',
    CANCELED: 'danger',
  };
  return map[status] || 'info';
};

const getStatusLabel = (status: string) => {
  const found = statusOptions.find(item => item.value === status);
  return found ? found.label : status;
};

// 查询参数
const queryParams = reactive({
  OrderNo: '',
  MachineryCode: '',
  Status: '',
  PageIndex: 1,
  PageSize: 20,
});

// 表单数据
const dialogVisible = ref(false);
const isEdit = ref(false);
const formRef = ref();
const formData = reactive({
  RepairOrderId: 0,
  OrderNo: '',
  MachineryId: 0,
  FaultCodeId: 0,
  FaultLevel: 0,
  FaultDesc: '',
  FaultTime: '',
  ReportSource: '',
  ReportUser: userStore.getUserInfo || 'system',
  Status: 'CREATED',
  DispatchTime: '',
  RepairStartTime: '',
  RepairEndTime: '',
  ConfirmTime: '',
  ConfirmBy: '',
  RepairResult: '',
  IsOutsource: false,
  OutsourceVendor: '',
  RootCause: '',
  CreateBy: '',
});

// 校验规则（必填项）
const formRules = {
  MachineryId: [{ required: true, message: t('message.pleaseSelect') + t('deviceManage.repairOrder.machineryId'), trigger: 'change' }],
  FaultCodeId: [{ required: true, message: t('message.pleaseSelect') + t('deviceManage.repairOrder.faultCodeId'), trigger: 'change' }],
};

const dialogTitle = computed(() => (isEdit.value ? t('publicText.edit') : t('publicText.add')));

// ---------- 下拉选项数据 ----------
const machineryOptions = ref<{ label: string; value: number }[]>([]);
const faultCodeOptions = ref<{ label: string; value: number }[]>([]);

// 获取设备下拉列表
const fetchMachineryOptions = async () => {
  try {
    const res: any = await GetPagedMachineries({ PageIndex: 1, PageSize: 100});
    // if (res.Success && res.Data?.Items) {
      machineryOptions.value = res.Data.Items.map((item: any) => ({
        label: `${item.machinery_code} - ${item.machinery_name}`,
        value: item.machinery_id,
      }));
    // }
  } catch (error) {
    console.error('获取设备列表失败:', error);
  }
};

// 获取故障码下拉列表
const fetchFaultCodeOptions = async () => {
  try {
    const res: any = await GetFaultCodes({ PageIndex: 1, PageSize: 500 });
    if (res.Success && res.Data?.Items) {
      faultCodeOptions.value = res.Data.Items.map((item: any) => ({
        label: `${item.Code} - ${item.Name}`,
        value: item.CodeId,
      }));
    }
  } catch (error) {
    console.error('获取故障码列表失败:', error);
  }
};
// ---------- 下拉选项数据结束 ----------

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
    const res: any = await GetRepairOrders(queryParams);
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
  queryParams.PageIndex = 1;
  getData();
};

const resetSearch = () => {
  queryParams.OrderNo = '';
  queryParams.MachineryCode = '';
  queryParams.Status = '';
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

// 打开新增
const openAdd = () => {
  isEdit.value = false;
  resetFormData();
  formData.Status = 'CREATED';
  formData.ReportUser = userStore.getUserInfo || 'system';
  dialogVisible.value = true;
};

// 打开编辑
const openEdit = (row: any) => {
  isEdit.value = true;
  formData.RepairOrderId = row.RepairOrderId;
  formData.OrderNo = row.OrderNo;
  formData.MachineryId = row.MachineryId;
  formData.FaultCodeId = row.FaultCodeId;
  formData.FaultLevel = row.FaultLevel ?? 0;
  formData.FaultDesc = row.FaultDesc || '';
  formData.FaultTime = row.FaultTime || '';
  formData.ReportSource = row.ReportSource || '';
  formData.ReportUser = row.ReportUser || '';
  formData.Status = row.Status || 'CREATED';
  formData.DispatchTime = row.DispatchTime || '';
  formData.RepairStartTime = row.RepairStartTime || '';
  formData.RepairEndTime = row.RepairEndTime || '';
  formData.ConfirmTime = row.ConfirmTime || '';
  formData.ConfirmBy = row.ConfirmBy || '';
  formData.RepairResult = row.RepairResult || '';
  formData.IsOutsource = row.IsOutsource ?? false;
  formData.OutsourceVendor = row.OutsourceVendor || '';
  formData.RootCause = row.RootCause || '';
  formData.CreateBy = row.CreateBy || '';
  dialogVisible.value = true;
};

const resetFormData = () => {
  formData.RepairOrderId = 0;
  formData.OrderNo = '';
  formData.MachineryId = 0;
  formData.FaultCodeId = 0;
  formData.FaultLevel = 0;
  formData.FaultDesc = '';
  formData.FaultTime = '';
  formData.ReportSource = '';
  formData.ReportUser = '';
  formData.Status = 'CREATED';
  formData.DispatchTime = '';
  formData.RepairStartTime = '';
  formData.RepairEndTime = '';
  formData.ConfirmTime = '';
  formData.ConfirmBy = '';
  formData.RepairResult = '';
  formData.IsOutsource = false;
  formData.OutsourceVendor = '';
  formData.RootCause = '';
  formData.CreateBy = '';
};

// 提交表单
const submitForm = async () => {
  await formRef.value.validate();
  submitLoading.value = true;
  try {
    const currentUser = userStore.getUserInfo || 'system';
    let res: any;
    const payload: any = {
      MachineryId: formData.MachineryId,
      FaultCodeId: formData.FaultCodeId,
      FaultLevel: formData.FaultLevel,
      FaultDesc: formData.FaultDesc,
      FaultTime: formData.FaultTime,
      ReportSource: formData.ReportSource,
      ReportUser: formData.ReportUser,
      Status: formData.Status,
      DispatchTime: formData.DispatchTime,
      RepairStartTime: formData.RepairStartTime,
      RepairEndTime: formData.RepairEndTime,
      ConfirmTime: formData.ConfirmTime,
      ConfirmBy: currentUser,
      RepairResult: formData.RepairResult,
      IsOutsource: formData.IsOutsource,
      OutsourceVendor: formData.OutsourceVendor,
      RootCause: formData.RootCause,
      CreateBy: currentUser
    };

    if (isEdit.value) {
      payload.RepairOrderId = formData.RepairOrderId;
      payload.OrderNo = formData.OrderNo;
      console.log(formData);
      
      res = await UpdateRepairOrder(payload);
      if (res.Success) ElMessage.success(t('message.editSuccess'));
    } else {
      payload.CreateBy = currentUser;
      res = await CreateRepairOrder(payload);
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

// 取消工单
const handleCancel = (row: any) => {
  ElMessageBox.confirm(
    `${t('publicText.confirm')}${t('deviceManage.repairOrder.cancel')}【${row.OrderNo}】?`,
    t('publicText.tip'),
    { confirmButtonText: t('publicText.confirm'), cancelButtonText: t('publicText.cancel'), type: 'warning' }
  )
    .then(async () => {
      loading.value = true;
      try {
        const currentUser = userStore.getUserInfo || 'system';
        const res: any = await CancelRepairOrder({
          RepairOrderId: row.RepairOrderId,
          UpdateBy: currentUser,
        });
        if (res.Success) {
          ElMessage.success(t('deviceManage.repairOrder.cancelSuccess'));
          if (tableData.value.length === 1 && queryParams.PageIndex > 1) queryParams.PageIndex--;
          getData();
        } else {
          ElMessage.error(res.Message || t('deviceManage.repairOrder.cancelFailure'));
        }
      } catch (error) {
        ElMessage.error(t('deviceManage.repairOrder.cancelFailure'));
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
  // 预加载下拉选项
  fetchMachineryOptions();
  fetchFaultCodeOptions();
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