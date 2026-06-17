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
        <!-- 已移除顶部的三个全局按钮 -->
      </div>

      <el-table :data="tableData" ref="tableRef" border :height="tableHeight" style="width: 100%" stripe size="small"
        highlight-current-row tooltip-effect="light" v-loading="loading">
        <el-table-column type="index" :label="t('publicText.index')" width="55" fixed="left" align="center">
          <template #default="{ $index }">
            {{ $index + 1 + (queryParams.pageIndex - 1) * queryParams.pageSize }}
          </template>
        </el-table-column>
        <el-table-column prop="PartCode" :label="t('deviceManage.sparePart.partCode')" :min-width="getColumnWidth('PartCode')" />
        <el-table-column prop="PartName" :label="t('deviceManage.sparePart.partName')" :min-width="getColumnWidth('PartName')" />
        <el-table-column prop="PartSpec" :label="t('deviceManage.sparePart.partSpec')" :min-width="getColumnWidth('PartSpec')" />
        <el-table-column prop="Unit" :label="t('deviceManage.sparePart.unit')" :min-width="getColumnWidth('Unit')" />
        <el-table-column prop="Quantity" :label="t('deviceManage.sparePart.quantity')" :min-width="getColumnWidth('Quantity')" align="right" />
        <el-table-column prop="Status" :label="t('deviceManage.sparePart.status')" :min-width="getColumnWidth('Status')" align="center">
          <template #default="{ row }">
            <el-tag :type="row.Status === 'ENABLE' ? 'success' : 'danger'" size="small">
              {{ row.Status === 'ENABLE' ? t('deviceManage.sparePart.statusEnable') : t('deviceManage.sparePart.statusDisable') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="LastUpdateTime" :label="t('deviceManage.sparePart.lastUpdateTime')" :min-width="getColumnWidth('LastUpdateTime')" />
        <!-- 操作列：三个按钮 -->
        <el-table-column :label="$t('publicText.operation')" fixed="right" width="150" align="center">
          <template #default="{ row }">
              <el-tooltip :content="$t('deviceManage.sparePart.transIn')" placement="top">
                <el-button size="small" type="success" @click="openInStock(row)" icon="Upload" />
              </el-tooltip>
               <el-tooltip :content="$t('deviceManage.sparePart.transOut')" placement="top">
                <el-button size="small" type="warning" @click="openOutStock(row)" icon="Download" />
               </el-tooltip>
                <el-tooltip :content="$t('deviceManage.sparePart.transaction')" placement="top">
                    <el-button size="small" type="primary" @click="openTransactionForPart(row)" icon="Document" />
                </el-tooltip>
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

    <!-- ========== 入库对话框 ========== -->
    <el-dialog :title="t('deviceManage.sparePart.inStockTitle')" v-model="inStockDialogVisible" width="550px" align-center
      :close-on-click-modal="false" @closed="handleInStockDialogClosed">
      <el-form ref="inStockFormRef" :model="inStockForm" :rules="inStockRules" label-width="100px" size="small" label-position="right">
        <!-- 备件编码（只读显示） -->
        <el-form-item :label="t('deviceManage.sparePart.partCode')" prop="partCode">
          <el-input v-model="inStockForm.partCode" disabled />
        </el-form-item>
        <el-form-item :label="t('deviceManage.sparePart.quantity')" prop="quantity" required>
          <el-input-number v-model="inStockForm.quantity" :min="1" :placeholder="t('deviceManage.sparePart.quantityPlaceholder')" style="width: 100%" controls-position="right" />
        </el-form-item>
        <el-form-item :label="t('deviceManage.sparePart.unitPrice')" prop="unitPrice">
          <el-input-number v-model="inStockForm.unitPrice" :min="0" :precision="2" :placeholder="t('deviceManage.sparePart.unitPricePlaceholder')" style="width: 100%" controls-position="right" />
        </el-form-item>
        <el-form-item :label="t('deviceManage.sparePart.sourceType')" prop="sourceType">
          <el-input v-model="inStockForm.sourceType" :placeholder="t('deviceManage.sparePart.sourceTypePlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('deviceManage.sparePart.sourceId')" prop="sourceId">
          <el-input v-model="inStockForm.sourceId" :placeholder="t('deviceManage.sparePart.sourceIdPlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('deviceManage.sparePart.remark')" prop="remark">
          <el-input v-model="inStockForm.remark" :placeholder="t('deviceManage.sparePart.remarkPlaceholder')" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="inStockDialogVisible = false">{{ t('publicText.cancel') }}</el-button>
        <el-button type="primary" @click="submitInStock" :loading="submitLoading">{{ t('publicText.confirm') }}</el-button>
      </template>
    </el-dialog>

    <!-- ========== 出库对话框 ========== -->
    <el-dialog :title="t('deviceManage.sparePart.outStockTitle')" v-model="outStockDialogVisible" width="550px" align-center
      :close-on-click-modal="false" @closed="handleOutStockDialogClosed">
      <el-form ref="outStockFormRef" :model="outStockForm" :rules="outStockRules" label-width="100px" size="small" label-position="right">
        <!-- 备件编码（只读显示） -->
        <el-form-item :label="t('deviceManage.sparePart.partCode')" prop="partCode">
          <el-input v-model="outStockForm.partCode" disabled />
        </el-form-item>
        <el-form-item :label="t('deviceManage.sparePart.quantity')" prop="quantity" required>
          <el-input-number v-model="outStockForm.quantity" :min="1" :placeholder="t('deviceManage.sparePart.quantityPlaceholder')" style="width: 100%" controls-position="right" />
        </el-form-item>
        <el-form-item :label="t('deviceManage.sparePart.unitPrice')" prop="unitPrice">
          <el-input-number v-model="outStockForm.unitPrice" :min="0" :precision="2" :placeholder="t('deviceManage.sparePart.unitPricePlaceholder')" style="width: 100%" controls-position="right" />
        </el-form-item>
        <el-form-item :label="t('deviceManage.sparePart.sourceType')" prop="sourceType">
          <el-input v-model="outStockForm.sourceType" :placeholder="t('deviceManage.sparePart.sourceTypePlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('deviceManage.sparePart.sourceId')" prop="sourceId">
          <el-input v-model="outStockForm.sourceId" :placeholder="t('deviceManage.sparePart.sourceIdPlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('deviceManage.sparePart.remark')" prop="remark">
          <el-input v-model="outStockForm.remark" :placeholder="t('deviceManage.sparePart.remarkPlaceholder')" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="outStockDialogVisible = false">{{ t('publicText.cancel') }}</el-button>
        <el-button type="primary" @click="submitOutStock" :loading="submitLoading">{{ t('publicText.confirm') }}</el-button>
      </template>
    </el-dialog>

    <!-- ========== 流水查询对话框 ========== -->
    <el-dialog :title="t('deviceManage.sparePart.transactionTitle')" v-model="transactionDialogVisible" width="80%" align-center
      :close-on-click-modal="false" @closed="handleTransactionDialogClosed">
      <div style="margin-bottom: 12px">
        <el-form :inline="true" :model="transQuery" label-width="auto" size="small">
          <el-form-item :label="t('deviceManage.sparePart.partCode')">
            <el-input v-model="transQuery.partCode" :placeholder="t('deviceManage.sparePart.partCodePlaceholder')" clearable style="width: 150px" />
          </el-form-item>
          <el-form-item :label="t('deviceManage.sparePart.transType')">
            <el-select v-model="transQuery.transType" :placeholder="t('deviceManage.sparePart.transTypePlaceholder')" clearable style="width: 120px">
              <el-option :label="t('deviceManage.sparePart.transIn')" value="IN" />
              <el-option :label="t('deviceManage.sparePart.transOut')" value="OUT" />
            </el-select>
          </el-form-item>
          <el-form-item :label="t('deviceManage.sparePart.sourceType')">
            <el-input v-model="transQuery.sourceType" :placeholder="t('deviceManage.sparePart.sourceTypePlaceholder')" clearable style="width: 150px" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchTransaction" size="small">{{ t('publicText.query') }}</el-button>
            <el-button @click="resetTransactionSearch" size="small">{{ t('publicText.reset') }}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table ref="transTableRef" :data="transData" border stripe size="small" v-loading="transLoading" height="400">
        <el-table-column type="index" :label="t('publicText.index')" width="55" align="center">
          <template #default="{ $index }">
            {{ $index + 1 + (transQuery.pageIndex - 1) * transQuery.pageSize }}
          </template>
        </el-table-column>
        <el-table-column prop="TransId" :label="t('deviceManage.sparePart.transId')" min-width="80" />
        <el-table-column prop="PartCode" :label="t('deviceManage.sparePart.partCode')" min-width="120" />
        <el-table-column prop="PartName" :label="t('deviceManage.sparePart.partName')" min-width="120" />
        <el-table-column prop="TransType" :label="t('deviceManage.sparePart.transType')" min-width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.TransType === 'IN' ? 'success' : 'danger'" size="small">
              {{ row.TransType === 'IN' ? t('deviceManage.sparePart.transIn') : t('deviceManage.sparePart.transOut') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="Quantity" :label="t('deviceManage.sparePart.quantity')" :min-width="getColumnWidth2('Quantity')" align="right" />
        <el-table-column prop="BeforeQty" :label="t('deviceManage.sparePart.beforeQty')" :min-width="getColumnWidth2('BeforeQty')" align="right" />
        <el-table-column prop="AfterQty" :label="t('deviceManage.sparePart.afterQty')" :min-width="getColumnWidth2('AfterQty')" align="right" />
        <el-table-column prop="UnitPrice" :label="t('deviceManage.sparePart.unitPrice')" :min-width="getColumnWidth2('UnitPrice')" align="right" />
        <el-table-column prop="TotalPrice" :label="t('deviceManage.sparePart.totalPrice')" :min-width="getColumnWidth2('TotalPrice')" align="right" />
        <el-table-column prop="SourceType" :label="t('deviceManage.sparePart.sourceType')" :min-width="getColumnWidth2('SourceType')" />
        <el-table-column prop="SourceId" :label="t('deviceManage.sparePart.sourceId')" min-width="100" />
        <el-table-column prop="OperatorUser" :label="t('deviceManage.sparePart.operatorUser')" :min-width="getColumnWidth2('OperatorUser')" />
        <el-table-column prop="Remark" :label="t('deviceManage.sparePart.remark')" min-width="120" show-overflow-tooltip />
        <el-table-column prop="CreateTime" :label="t('deviceManage.sparePart.createTime')" :min-width="getColumnWidth2('CreateTime')" />
      </el-table>
      <div style="margin-top: 8px">
        <el-pagination align="center" background size="small" @size-change="handleTransSizeChange"
          @current-change="handleTransCurrentChange" :current-page="transQuery.pageIndex" :page-size="transQuery.pageSize"
          :page-sizes="[10, 20, 50, 100]" layout="total,sizes, prev, pager, next" :total="transTotal" />
      </div>
      <template #footer>
        <el-button @click="transactionDialogVisible = false">{{ t('publicText.close') }}</el-button>
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
import { GetStocks, GetTransaction, InStock, OutStock } from '@/api/deviceManage/sparePart';

const { t } = useI18n();
const userStore = useUserStoreWithOut();

// ---------- 主表格数据 ----------
const tableData = ref<any[]>([]);
const total = ref(0);
const tableHeight = ref(0);
const tableRef = ref();
const transTableRef = ref();

const loading = ref(false);
const submitLoading = ref(false);

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
// 表格列宽自适应
const tableColumns2 = computed(() => {
  if (!transTableRef.value) return [];
  const columns = transTableRef.value.columns
    .map((item: any) => ({ prop: item.property, label: item.label }))
    .filter((item: any) => item.label !== t('publicText.index') && item.label !== t('publicText.operation'));
  return columns;
});
const columnWidths2 = computed(() => {
  return calculateColumnsWidth(tableColumns2.value, transData.value, { padding: 25, fontSize: 13 });    
});
const getColumnWidth2 = (prop: string) => columnWidths2.value[prop] || 'auto';

// ---------- 获取库存列表 ----------
const getData = async () => {
  loading.value = true;
  try {
    const res: any = await GetStocks(queryParams);
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

// ---------- 入库对话框 ----------
const inStockDialogVisible = ref(false);
const inStockFormRef = ref();
const inStockForm = reactive({
  partId: 0,          // 隐藏存储，用于提交
  partCode: '',       // 显示用
  quantity: 0,
  unitPrice: 0,
  sourceType: '',
  sourceId: '',
  remark: '',
});
const inStockRules = {
  // partId 由行传入，不需校验
  quantity: [{ required: true, message: t('message.pleaseInput') + t('deviceManage.sparePart.quantity'), trigger: 'blur' }],
};

const openInStock = (row: any) => {
  resetInStockForm();
  inStockForm.partId = row.PartId;
  inStockForm.partCode = row.PartCode;
  inStockDialogVisible.value = true;
};
const resetInStockForm = () => {
  inStockForm.partId = 0;
  inStockForm.partCode = '';
  inStockForm.quantity = 0;
  inStockForm.unitPrice = 0;
  inStockForm.sourceType = '';
  inStockForm.sourceId = '';
  inStockForm.remark = '';
};
const submitInStock = async () => {
  await inStockFormRef.value.validate();
  submitLoading.value = true;
  try {
    const currentUser = userStore.getUserInfo || 'system';
    const payload = {
      partId: inStockForm.partId,
      quantity: inStockForm.quantity,
      unitPrice: inStockForm.unitPrice,
      sourceType: inStockForm.sourceType,
      sourceId: inStockForm.sourceId,
      operatorUser: currentUser,
      remark: inStockForm.remark,
    };
    const res: any = await InStock(payload);
    if (res.Success) {
      ElMessage.success(t('deviceManage.sparePart.inStockSuccess'));
      inStockDialogVisible.value = false;
      getData();
    } else {
      ElMessage.error(res.Message || t('deviceManage.sparePart.inStockFailure'));
    }
  } catch (error) {
    console.error('入库失败:', error);
    ElMessage.error(t('deviceManage.sparePart.inStockFailure'));
  } finally {
    submitLoading.value = false;
  }
};
const handleInStockDialogClosed = () => {
  inStockFormRef.value?.resetFields();
  resetInStockForm();
};

// ---------- 出库对话框 ----------
const outStockDialogVisible = ref(false);
const outStockFormRef = ref();
const outStockForm = reactive({
  partId: 0,
  partCode: '',
  quantity: 0,
  unitPrice: 0,
  sourceType: '',
  sourceId: '',
  remark: '',
});
const outStockRules = {
  quantity: [{ required: true, message: t('message.pleaseInput') + t('deviceManage.sparePart.quantity'), trigger: 'blur' }],
};

const openOutStock = (row: any) => {
  resetOutStockForm();
  outStockForm.partId = row.PartId;
  outStockForm.partCode = row.PartCode;
  outStockDialogVisible.value = true;
};
const resetOutStockForm = () => {
  outStockForm.partId = 0;
  outStockForm.partCode = '';
  outStockForm.quantity = 0;
  outStockForm.unitPrice = 0;
  outStockForm.sourceType = '';
  outStockForm.sourceId = '';
  outStockForm.remark = '';
};
const submitOutStock = async () => {
  await outStockFormRef.value.validate();
  submitLoading.value = true;
  try {
    const currentUser = userStore.getUserInfo || 'system';
    const payload = {
      partId: outStockForm.partId,
      quantity: outStockForm.quantity,
      unitPrice: outStockForm.unitPrice,
      sourceType: outStockForm.sourceType,
      sourceId: outStockForm.sourceId,
      operatorUser: currentUser,
      remark: outStockForm.remark,
    };
    const res: any = await OutStock(payload);
    if (res.Success) {
      ElMessage.success(t('deviceManage.sparePart.outStockSuccess'));
      outStockDialogVisible.value = false;
      getData();
    } else {
      ElMessage.error(res.Message || t('deviceManage.sparePart.outStockFailure'));
    }
  } catch (error) {
    console.error('出库失败:', error);
    ElMessage.error(t('deviceManage.sparePart.outStockFailure'));
  } finally {
    submitLoading.value = false;
  }
};
const handleOutStockDialogClosed = () => {
  outStockFormRef.value?.resetFields();
  resetOutStockForm();
};

// ---------- 流水查询对话框 ----------
const transactionDialogVisible = ref(false);
const transData = ref<any[]>([]);
const transTotal = ref(0);
const transLoading = ref(false);
const transQuery = reactive({
  partId: 0,
  partCode: '',
  transType: '',
  sourceType: '',
  pageIndex: 1,
  pageSize: 20,
});

const fetchTransaction = async () => {
  transLoading.value = true;
  try {
    const params: any = {
      pageIndex: transQuery.pageIndex,
      pageSize: transQuery.pageSize,
    };
    if (transQuery.partId > 0) params.partId = transQuery.partId;
    if (transQuery.partCode) params.partCode = transQuery.partCode;
    if (transQuery.transType) params.transType = transQuery.transType;
    if (transQuery.sourceType) params.sourceType = transQuery.sourceType;
    const res: any = await GetTransaction(params);
    if (res.Success) {
      transData.value = res.Data?.Items || [];
      transTotal.value = res.Data?.Total || 0;
    } else {
      ElMessage.error(res.Message || t('message.queryFailure'));
    }
  } catch (error) {
    console.error('查询流水失败:', error);
    transData.value = [];
    transTotal.value = 0;
  } finally {
    transLoading.value = false;
  }
};

const searchTransaction = () => {
  transQuery.pageIndex = 1;
  fetchTransaction();
};
const resetTransactionSearch = () => {
  transQuery.partId = 0;
  transQuery.partCode = '';
  transQuery.transType = '';
  transQuery.sourceType = '';
  transQuery.pageIndex = 1;
  fetchTransaction();
};
const handleTransSizeChange = (val: number) => {
  transQuery.pageSize = val;
  transQuery.pageIndex = 1;
  fetchTransaction();
};
const handleTransCurrentChange = (val: number) => {
  transQuery.pageIndex = val;
  fetchTransaction();
};

// 从表格行打开流水（带 partId）
const openTransactionForPart = (row: any) => {
  transQuery.partId = row.PartId;
  transQuery.partCode = '';
  transQuery.transType = '';
  transQuery.sourceType = '';
  transQuery.pageIndex = 1;
  transactionDialogVisible.value = true;
  fetchTransaction();
};

const handleTransactionDialogClosed = () => {
  // 关闭时重置查询条件，但不清除数据以免闪白
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