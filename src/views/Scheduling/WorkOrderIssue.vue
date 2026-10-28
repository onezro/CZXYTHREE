<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <el-form ref="formRef" :inline="true" size="small"  @submit.prevent>
        <el-form-item :label="t('Scheduling.WorkOrderIssue.groupOrder')" prop="groupOrder" class="mb-2">
          <el-input v-model="getForm.group_order" :placeholder="t('Scheduling.WorkOrderIssue.pleaseInputGroupOrder')"
            clearable @clear="queryReturnMaterials" @keyup.enter="queryReturnMaterials" style="width: 200px" />
        </el-form-item>
        <el-form-item :label="t('Scheduling.WorkOrderIssue.ncOrderLine')" prop="nc_order_line" class="mb-2">
          <el-input v-model="getForm.nc_order_line" :placeholder="t('Scheduling.WorkOrderIssue.ncOrderLine')" clearable
            @clear="queryReturnMaterials" @keyup.enter="queryReturnMaterials" style="width: 200px" />
        </el-form-item>
        <el-form-item :label="t('Scheduling.WorkOrderIssue.reelId')" prop="reelId" class="mb-2">
          <el-input v-model="getForm.reel_id" :placeholder="t('Scheduling.WorkOrderIssue.reelId')" clearable
            @clear="queryReturnMaterials" @keyup.enter="queryReturnMaterials" style="width: 200px" />
        </el-form-item>
        <el-form-item :label="t('Scheduling.WorkOrderIssue.uploadStatus')" prop="upload_status" class="mb-2">
          <el-select v-model="getForm.upload_status" clearable
            :placeholder="t('Scheduling.WorkOrderIssue.uploadStatus')" style="width: 140px"
            @change="queryReturnMaterials">
            <el-option :label="t('Scheduling.WorkOrderIssue.notUploaded')" :value="0" />
            <el-option :label="t('Scheduling.WorkOrderIssue.uploaded')" :value="1" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item :label="t('Scheduling.WorkOrderIssue.timeRange')" prop="queryTime" class="mb-2">
          <el-date-picker style="width: 350px;" v-model="queryTime" type="datetimerange" range-separator="-"
            :start-placeholder="t('Scheduling.WorkOrderIssue.startTimePlaceholder')"
            :end-placeholder="t('Scheduling.WorkOrderIssue.endTimePlaceholder')"
            value-format="YYYY-MM-DDTHH:mm:ss" :shortcuts="shortcuts1" :default-time="[
              new Date(2000, 1, 1, 0, 0, 0),
              new Date(2000, 1, 1, 23, 59, 59),
            ]" :clearable="false" @change="handleDateRangeChange" :disabled-date="disabledDate" />
        </el-form-item> -->
        <el-form-item class="mb-2">
          <el-button type="primary" @click="queryReturnMaterials">{{ t('publicText.query') }}</el-button>
        </el-form-item>
        <el-form-item class="mb-2">
          <el-button @click="resetQuery">{{ t('publicText.reset') }}</el-button>
        </el-form-item>
      </el-form>

      <!-- 上表格：工单组列表 -->
      <el-table :data="tableData" size="small" :style="{ width: '100%' }" :height="masterTableHeight"
        :tooltip-effect="'dark'" border fit ref="tableRef"
        :header-cell-style="{ backgroundColor: '#006487', color: '#fff' }" highlight-current-row
        @row-click="handleRowClick">
        <el-table-column type="index" align="center" fixed :label="t('publicText.index')" width="50">
          <template #default="scope">
            <span>{{ (getForm.PageIndex - 1) * getForm.PageSize + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="t('Scheduling.WorkOrderIssue.groupOrder')" prop="group_order"
          :min-width="getColumnWidth('group_order')" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="call-order-link" @click.stop="handleViewMaterialBalance(row)">
              {{ row.group_order }}
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="t('Scheduling.WorkOrderIssue.ncOrderLine')" prop="nc_order_line"
          :min-width="getColumnWidth('nc_order_line')" show-overflow-tooltip />
        <el-table-column :label="t('Scheduling.WorkOrderIssue.createTime')" prop="create_time"
          :min-width="getColumnWidth('create_time')" show-overflow-tooltip>
          <template #default="{ row }">
            {{ formatDate(row.create_time) }}
          </template>
        </el-table-column>
        <el-table-column :label="t('Scheduling.WorkOrderIssue.uploadStatus')" prop="upload_status_name"
          :min-width="getColumnWidth('upload_status_name')" align="center">
          <template #default="{ row }">
            <el-tag :type="row.upload_status === 1 ? 'success' : 'info'" size="small">
              {{ row.upload_status_name || '-' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="t('Scheduling.WorkOrderIssue.confirmStatus')" prop="confirm_status_name"
          :min-width="getColumnWidth('confirm_status_name')" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.confirm_status === 0" type="warning" size="small">
              {{ row.confirm_status_name || t('Scheduling.WorkOrderIssue.unconfirmed') }}
            </el-tag>
            <el-tag v-else-if="row.confirm_status === 1" type="success" size="small">
              {{ row.confirm_status_name || t('Scheduling.WorkOrderIssue.confirmed') }}
            </el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column :label="t('publicText.operation')" fixed="right" width="300" align="center">
          <template #default="{ row }">
             <el-button type="primary" size="small" :disabled="row.upload_status === 1" @click.stop="handleCalculateIssue(row)">
              {{ t('Scheduling.WorkOrderIssue.sendIssueData') }}
            </el-button>
            <el-button type="warning" size="small"
              :disabled="row.upload_status === 1 || !isCalculated(row) || row.confirm_status === 1"
              @click.stop="handleConfirmIssue(row)">
              {{ t('Scheduling.WorkOrderIssue.confirmIssue') }}
            </el-button>
            <el-button type="success" size="small" :disabled="row.confirm_status === 0 || row.upload_status === 1"
              @click.stop="handleSendIssue(row)">
              {{ t('Scheduling.WorkOrderIssue.issueMaterials') }}
            </el-button>
            <el-button type="danger" size="small" :disabled="row.upload_status === 1" @click.stop="handleResetIssue(row)">
              {{ t('Scheduling.WorkOrderIssue.resetIssueData') }}
            </el-button>
          </template>
        </el-table-column>
        <template #empty>
          <div class="flex items-center justify-center h-100%">
            <el-empty />
          </div>
        </template>
      </el-table>
      <div class="mt-2">
        <el-pagination :size="'small'" background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :pager-count="5" :current-page="getForm.PageIndex" :page-size="getForm.PageSize"
          :page-sizes="[30, 50, 100, 200, 300]" layout="total,sizes, prev, pager, next" :total="total">
        </el-pagination>
      </div>

      <!-- 下表格：明细 -->
      <div class="detail-header">
        <span>{{ t('Scheduling.WorkOrderIssue.detailTitle') }}
          <template v-if="currentRow.group_order">: {{ currentRow.group_order }}</template>
        </span>
      </div>
      <el-table :data="pagedDetailData" size="small" :style="{ width: '100%' }" :height="detailTableHeight"
        :tooltip-effect="'dark'" border fit ref="detailTableRef" :row-class-name="detailRowClassName"
        :header-cell-style="{ backgroundColor: '#006487', color: '#fff' }">
        <el-table-column type="index" align="center" fixed :label="t('publicText.index')" width="50">
          <template #default="scope">
            {{ scope.$index + (detailPage.PageIndex - 1) * detailPage.PageSize + 1 }}
          </template>
        </el-table-column>
        <el-table-column :label="t('Scheduling.WorkOrderIssue.programMerge')" prop="program_merge"
          :min-width="getColumnWidth1('program_merge')" show-overflow-tooltip fixed="left" />
        <el-table-column :label="t('Scheduling.WorkOrderIssue.planStartTime')" prop="plan_start_time"
          :min-width="getColumnWidth1('plan_start_time')">
          <template #default="{ row }">
            {{ formatDate(row.plan_start_time) }}
          </template>
        </el-table-column>
        <el-table-column :label="t('Scheduling.WorkOrderIssue.planEndTime')" prop="plan_end_time"
          :min-width="getColumnWidth1('plan_end_time')">
          <template #default="{ row }">
            {{ formatDate(row.plan_end_time) }}
          </template>
        </el-table-column>
        <el-table-column :label="t('Scheduling.WorkOrderIssue.line')" prop="line" :min-width="getColumnWidth1('line')"
          show-overflow-tooltip />
        <el-table-column :label="t('Scheduling.WorkOrderIssue.erpFeedCode')" prop="erp_feed_code"
          :min-width="getColumnWidth1('erp_feed_code')" show-overflow-tooltip />
        <el-table-column :label="t('Scheduling.WorkOrderIssue.erpMoLineNo')" prop="erp_mo_line_no"
          :min-width="getColumnWidth1('erp_mo_line_no')" show-overflow-tooltip />
        <el-table-column :label="t('Scheduling.WorkOrderIssue.reelId')" prop="reel_id"
          :min-width="getColumnWidth1('reel_id')" show-overflow-tooltip />
        <el-table-column :label="t('Scheduling.WorkOrderIssue.materialPn')" prop="material_pn"
          :min-width="getColumnWidth1('material_pn')" show-overflow-tooltip />
        <el-table-column :label="t('Scheduling.WorkOrderIssue.bomQty')" prop="bom_qty"
          :min-width="getColumnWidth1('bom_qty')" align="center" />
        <el-table-column :label="t('Scheduling.WorkOrderIssue.totalQty')" prop="total_qty"
          :min-width="getColumnWidth1('total_qty')" align="center" />
        <el-table-column :label="t('Scheduling.WorkOrderIssue.reelOriginalQty')" prop="reel_original_qty"
          :min-width="getColumnWidth1('reel_original_qty')" align="center" />
        <el-table-column :label="t('Scheduling.WorkOrderIssue.deductQty')" prop="deduct_qty"
          :min-width="getColumnWidth1('deduct_qty')" align="center" />
        <el-table-column :label="t('Scheduling.WorkOrderIssue.remainQtyAfter')" prop="remain_qty_after"
          :min-width="getColumnWidth1('remain_qty_after')" align="center" />
        <el-table-column :label="t('Scheduling.WorkOrderIssue.actRetQty')" prop="act_ret_qty"
          :min-width="getColumnWidth1('act_ret_qty')" align="center" />
        <el-table-column :label="t('Scheduling.WorkOrderIssue.batchId')" prop="batch_id"
          :min-width="getColumnWidth1('batch_id')" show-overflow-tooltip />
        <el-table-column :label="t('Scheduling.WorkOrderIssue.supperlier')" prop="supperlier"
          :min-width="getColumnWidth1('supperlier')" show-overflow-tooltip />
        <el-table-column :label="t('Scheduling.WorkOrderIssue.supperlierName')" prop="supperlier_name"
          :min-width="getColumnWidth1('supperlier_name')" show-overflow-tooltip />
        <el-table-column :label="t('Scheduling.WorkOrderIssue.status')" prop="status"
          :min-width="getColumnWidth1('status')" align="center" />
        <template #empty>
          <div class="flex items-center justify-center h-100%">
            <el-empty />
          </div>
        </template>
      </el-table>
      <div class="mt-2">
        <el-pagination :size="'small'" background @size-change="handleDetailSizeChange"
          @current-change="handleDetailCurrentChange" :pager-count="5" :current-page="detailPage.PageIndex"
          :page-size="detailPage.PageSize" :page-sizes="[30, 50, 100, 200, 300]" layout="total,sizes, prev, pager, next"
          :total="detailPage.total" />
      </div>
    </el-card>

    <!-- 物料平衡汇总弹窗 -->
    <el-dialog v-model="balanceDialogVisible" :title="balanceDialogTitle" width="90%" top="5vh" destroy-on-close>
      <el-table v-loading="balanceDialogLoading" :data="balanceDialogPaged" size="small" border fit
        :header-cell-style="{ backgroundColor: '#006487', color: '#fff' }" style="width: 100%" height="500">
        <el-table-column type="index" align="center" :label="t('publicText.index')" width="50"
          :index="(index: number, row: any) => (balancePage.PageIndex - 1) * balancePage.PageSize + index + 1" />
        <el-table-column :label="t('Scheduling.WorkOrderIssue.materialPn')" prop="material_pn" min-width="140" show-overflow-tooltip />
        <el-table-column :label="t('Scheduling.WorkOrderIssue.issueQty')" prop="issue_qty" min-width="100" align="right" />
        <el-table-column :label="t('Scheduling.WorkOrderIssue.bomDemandQty')" prop="bom_demand_qty" min-width="110" align="right" />
        <el-table-column :label="t('Scheduling.WorkOrderIssue.issueMinusBomQty')" prop="issue_minus_bom_qty" min-width="140" align="right">
          <template #default="{ row }">
            <span :style="{ color: Number(row.issue_minus_bom_qty) > 0 ? '#67c23a' : Number(row.issue_minus_bom_qty) < 0 ? '#f56c6c' : '' }">
              {{ row.issue_minus_bom_qty }}
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="t('Scheduling.WorkOrderIssue.actualReturnQty')" prop="actual_return_qty" min-width="110" align="right" />
        <el-table-column :label="t('Scheduling.WorkOrderIssue.returnCheckApplicable')" prop="return_check_applicable" min-width="140" align="center">
          <template #default="{ row }">
            {{ row.return_check_applicable === 1 || row.return_check_applicable === '是' ? t('Scheduling.WorkOrderIssue.yes') : t('Scheduling.WorkOrderIssue.no') }}
          </template>
        </el-table-column>
        <el-table-column :label="t('Scheduling.WorkOrderIssue.expectedReturnQty')" prop="expected_return_qty" min-width="110" align="right" />
        <el-table-column :label="t('Scheduling.WorkOrderIssue.materialShortageQty')" prop="material_shortage_qty" min-width="120" align="right">
          <template #default="{ row }">
            <span v-if="Number(row.material_shortage_qty) > 0" style="color: #f56c6c; font-weight: bold;">{{ row.material_shortage_qty }}</span>
            <span v-else>{{ row.material_shortage_qty || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="t('Scheduling.WorkOrderIssue.overReturnQty')" prop="over_return_qty" min-width="110" align="right">
          <template #default="{ row }">
            <span v-if="Number(row.over_return_qty) > 0" style="color: #e6a23c; font-weight: bold;">{{ row.over_return_qty }}</span>
            <span v-else>{{ row.over_return_qty || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="t('Scheduling.WorkOrderIssue.shortReturnQty')" prop="short_return_qty" min-width="110" align="right">
          <template #default="{ row }">
            <span v-if="Number(row.short_return_qty) > 0" style="color: #f56c6c; font-weight: bold;">{{ row.short_return_qty }}</span>
            <span v-else>{{ row.short_return_qty || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="t('Scheduling.WorkOrderIssue.calculateTime')" prop="calculate_time" min-width="160" align="center">
          <template #default="{ row }">
            {{ formatDate(row.calculate_time) }}
          </template>
        </el-table-column>
        <template #empty>
          <el-empty />
        </template>
      </el-table>
      <div class="mt-2">
        <el-pagination background size="small" layout="total, sizes, prev, pager, next"
          :page-sizes="[20, 50, 100, 200]" :total="balanceDialogData.length"
          :current-page="balancePage.PageIndex" :page-size="balancePage.PageSize"
          @size-change="handleBalanceSizeChange" @current-change="handleBalanceCurrentChange" />
      </div>
      <template #footer>
        <el-button @click="balanceDialogVisible = false">{{ t('publicText.close') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { QueryReturnMaterials, QueryReturnMaterialDetails, IssueMaterials, ResetIssueData, SendIssueData, ConfirmIssueData, QueryMaterialBalanceSummary } from "@/api/Scheduling/WorkOrderIssue";
import { useTableColumnWidth } from "@/hooks/useTableColumnWidth";
import { ref, reactive, nextTick, onMounted, onBeforeUnmount, watch, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useUserStoreWithOut } from "@/stores/modules/user";
import dayjs from "dayjs";
import { useI18n } from "vue-i18n";

const userStore = useUserStoreWithOut();
const { t } = useI18n();
const tableRef = ref();
const detailTableRef = ref();
const masterTableHeight = ref(0);
const detailTableHeight = ref(0);
const tableData = ref<any[]>([]);
const detailData = ref<any[]>([]);
const detailPage = reactive({
  PageIndex: 1,
  PageSize: 50,
  total: 0,
});
const pagedDetailData = computed(() => {
  const start = (detailPage.PageIndex - 1) * detailPage.PageSize;
  return detailData.value.slice(start, start + detailPage.PageSize);
});

const isUnusedStatus = (row: any) => row?.status === "未使用";

const sortDetailData = (list: any[]) => {
  return [...list].sort((a, b) => {
    const aFirst = isUnusedStatus(a) ? 0 : 1;
    const bFirst = isUnusedStatus(b) ? 0 : 1;
    return aFirst - bFirst;
  });
};

const detailRowClassName = ({ row }: any) => (isUnusedStatus(row) ? "unused-row" : "");

const total = ref(0);
const currentRow = reactive<any>({});

// 本次会话中已执行过“计算”的工单组，用于控制“确认”按钮的显示
const calculatedGroupOrders = ref<Set<string>>(new Set());
const isCalculated = (row: any) => {
  if (row?.confirm_status === 0 || row?.confirm_status === 1) return true;
  return !!row?.group_order && calculatedGroupOrders.value.has(row.group_order);
};

const getForm = reactive({
  PageIndex: 1,
  PageSize: 50,
  group_order: '',
  nc_order_line: '',
  reel_id: '',
  status: 0,
  upload_status: 0,
  // start_time: '',
  // end_time: '',
});

const queryTime = ref<any[]>([]);

const handleDateRangeChange = (val: any[]) => {
  // getForm.start_time = val?.[0] || "";
  // getForm.end_time = val?.[1] || "";
};

const disabledDate = (time: Date) => {
  const now = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  return time.getTime() < oneMonthAgo.getTime() || time.getTime() > now.getTime();
};

const getDefaultDateRange = (): string[] => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return [
    dayjs(start).format("YYYY-MM-DDTHH:mm:ss"),
    dayjs(end).format("YYYY-MM-DDTHH:mm:ss"),
  ];
};

const { getColumnWidth } = useTableColumnWidth(tableRef, tableData, {
  excludeLabels: [t('publicText.index'), t('publicText.operation')],
  excludeTypes: ['index']
});

const { getColumnWidth: getColumnWidth1 } = useTableColumnWidth(detailTableRef, detailData, {
  excludeLabels: [t('publicText.index')],
  excludeTypes: ['index']
});

const formatDate = (dateStr: string) => {
  if (!dateStr || dateStr.startsWith("1900-01-01")) return "-";
  return dayjs(dateStr).format("YYYY-MM-DD HH:mm:ss");
};

const queryReturnMaterials = () => {
  const params: any = {
    reel_id: getForm.reel_id,
    status: getForm.status,
    upload_status: getForm.upload_status,
    group_order: getForm.group_order,
    nc_order_line: getForm.nc_order_line,
  };
  // if (getForm.start_time) params.start_time = getForm.start_time;
  // if (getForm.end_time) params.end_time = getForm.end_time;

  QueryReturnMaterials(params)
    .then((res: any) => {
      if (res.Success && Array.isArray(res.Data)) {
        tableData.value = res.Data;
        total.value = res.Data.length;
      } else {
        tableData.value = [];
        total.value = 0;
      }
      clearDetail();
    })
    .catch(() => {
      tableData.value = [];
      total.value = 0;
      clearDetail();
    });
};

const clearDetail = () => {
  Object.keys(currentRow).forEach(k => delete currentRow[k]);
  detailData.value = [];
  detailPage.PageIndex = 1;
  detailPage.total = 0;
};

const handleRowClick = (row: any) => {
  Object.keys(currentRow).forEach(k => delete currentRow[k]);
  Object.assign(currentRow, row);
  queryDetail(row.group_order);
};

const queryDetail = (group_order: string) => {
  if (!group_order) return;
  QueryReturnMaterialDetails({ group_order })
    .then((res: any) => {
      if (res.Success && Array.isArray(res.Data)) {
        detailData.value = sortDetailData(res.Data);
        detailPage.total = detailData.value.length;
        detailPage.PageIndex = 1;
      } else {
        detailData.value = [];
        detailPage.total = 0;
        detailPage.PageIndex = 1;
      }
    })
    .catch(() => {
      detailData.value = [];
      detailPage.total = 0;
      detailPage.PageIndex = 1;
    });
};

const handleDetailSizeChange = (val: number) => {
  detailPage.PageSize = val;
  detailPage.PageIndex = 1;
};

const handleDetailCurrentChange = (val: number) => {
  detailPage.PageIndex = val;
};

const resetQuery = () => {
  queryTime.value = getDefaultDateRange();
  getForm.group_order = '';
  getForm.nc_order_line = '';
  getForm.reel_id = '';
  getForm.upload_status = 0;
  getForm.PageIndex = 1;
  tableData.value = [];
  total.value = 0;
  clearDetail();
};

const handleCalculateIssue = (row: any) => {
  const group_order = row?.group_order;
  if (!group_order) {
    ElMessage.warning(t("Scheduling.WorkOrderIssue.pleaseInputGroupOrder"));
    return;
  }
  ElMessageBox.confirm(
    t("Scheduling.WorkOrderIssue.confirmSendIssueData", [group_order]),
    t("publicText.tip"),
    {
      confirmButtonText: t("publicText.confirm"),
      cancelButtonText: t("publicText.cancel"),
      type: "warning",
    }
  )
    .then(() => {
      calculateIssue(group_order);
    })
    .catch(() => { });
};

const calculateIssue = (group_order: string) => {
  IssueMaterials({
    group_order: group_order,
    operator_name: userStore.getUserInfo || "",
    published_bom_status: "",
    confirm_all_pointed: true
  })
    .then((res: any) => {
      if (res.Success) {
        ElMessage.success(res.Message || t("publicText.success"));
        calculatedGroupOrders.value.add(group_order);
        queryReturnMaterials();
      } else {
        ElMessage.error(res.Message || t("publicText.failure"));
      }
    })
    .catch(() => { });
};

const handleConfirmIssue = (row: any) => {
  const group_order = row?.group_order;
  if (!group_order) {
    ElMessage.warning(t("Scheduling.WorkOrderIssue.pleaseInputGroupOrder"));
    return;
  }
  ElMessageBox.confirm(
    t("Scheduling.WorkOrderIssue.confirmConfirmIssue", [group_order]),
    t("publicText.tip"),
    {
      confirmButtonText: t("publicText.confirm"),
      cancelButtonText: t("publicText.cancel"),
      type: "warning",
    }
  )
    .then(() => {
      confirmIssue(group_order);
    })
    .catch(() => { });
};

const confirmIssue = (group_order: string) => {
  ConfirmIssueData({ group_order })
    .then((res: any) => {
      if (res.Success) {
        ElMessage.success(res.Message || t("Scheduling.WorkOrderIssue.confirmSuccess"));
        calculatedGroupOrders.value.add(group_order);
        queryReturnMaterials();
      } else {
        ElMessage.error(res.Message || t("Scheduling.WorkOrderIssue.confirmFailure"));
      }
    })
    .catch(() => { });
};

const handleResetIssue = (row: any) => {
  console.log(row);
  const group_order = row?.group_order;
  if (!group_order) {
    ElMessage.warning(t("Scheduling.WorkOrderIssue.pleaseInputGroupOrder"));
    return;
  }
  ElMessageBox.confirm(
    t("Scheduling.WorkOrderIssue.confirmResetIssueData", [group_order]),
    t("publicText.tip"),
    {
      confirmButtonText: t("publicText.confirm"),
      cancelButtonText: t("publicText.cancel"),
      type: "warning",
    }
  )
    .then(() => {
      resetIssueData(group_order);
    })
    .catch(() => { });
};

const resetIssueData = (group_order: string) => {
  ResetIssueData({ group_order })
    .then((res: any) => {
      if (res.Success) {
        ElMessage.success(res.Message || t("Scheduling.WorkOrderIssue.resetSuccess"));
        queryReturnMaterials();
      } else {
        ElMessage.error(res.Message || t("Scheduling.WorkOrderIssue.resetFailure"));
      }
    })
    .catch(() => { });
};

const handleSendIssue = (row: any) => {
  const group_order = row?.group_order;
  if (!group_order) {
    ElMessage.warning(t("Scheduling.WorkOrderIssue.pleaseInputGroupOrder"));
    return;
  }
  ElMessageBox.confirm(
    t("Scheduling.WorkOrderIssue.confirmAllPointed"),
    t("publicText.tip"),
    {
      confirmButtonText: t("publicText.confirm"),
      cancelButtonText: t("publicText.cancel"),
      type: "warning",
    }
  )
    .then(() => {
      sendIssueData(group_order);
    })
    .catch(() => { });
};

const sendIssueData = (group_order: string) => {
  SendIssueData({
    group_order,
    operator_name: userStore.getUserInfo || "",
  })
    .then((res: any) => {
      if (res.Success) {
        ElMessage.success(res.Message || t("Scheduling.WorkOrderIssue.sendSuccess"));
        queryReturnMaterials();
      } else {
        ElMessage.error(res.Message || t("Scheduling.WorkOrderIssue.sendFailure"));
      }
    })
    .catch(() => { });
};

// 物料平衡汇总弹窗
const balanceDialogVisible = ref(false);
const balanceDialogLoading = ref(false);
const balanceDialogTitle = ref("");
const balanceDialogData = ref<any[]>([]);
const balancePage = reactive({ PageIndex: 1, PageSize: 20 });
const balanceDialogPaged = computed(() => {
  const start = (balancePage.PageIndex - 1) * balancePage.PageSize;
  return balanceDialogData.value.slice(start, start + balancePage.PageSize);
});
const handleBalanceSizeChange = (val: number) => {
  balancePage.PageSize = val;
  balancePage.PageIndex = 1;
};
const handleBalanceCurrentChange = (val: number) => {
  balancePage.PageIndex = val;
};

const handleViewMaterialBalance = (row: any) => {
  const group_order = row?.group_order;
  if (!group_order) {
    ElMessage.warning(t("Scheduling.WorkOrderIssue.pleaseInputGroupOrder"));
    return;
  }
  balanceDialogTitle.value = `${t("Scheduling.WorkOrderIssue.balanceDialogTitle")}: ${group_order}`;
  balanceDialogVisible.value = true;
  balanceDialogLoading.value = true;
  balancePage.PageIndex = 1;
  QueryMaterialBalanceSummary({ group_order })
    .then((res: any) => {
      if (res.Success && Array.isArray(res.Data)) {
        balanceDialogData.value = res.Data;
      } else {
        balanceDialogData.value = [];
        ElMessage.warning(res.Message || t("publicText.query"));
      }
    })
    .catch(() => {
      balanceDialogData.value = [];
    })
    .finally(() => {
      balanceDialogLoading.value = false;
    });
};

const handleSizeChange = (val: number) => {
  getForm.PageSize = val;
  getForm.PageIndex = 1;
  queryReturnMaterials();
};

const handleCurrentChange = (val: number) => {
  getForm.PageIndex = val;
  queryReturnMaterials();
};

const getScreenHeight = () => {
  nextTick(() => {
    const availableHeight = window.innerHeight - 180;
    masterTableHeight.value = Math.max(Math.floor(availableHeight * 0.4), 180);
    detailTableHeight.value = Math.max(availableHeight - masterTableHeight.value - 80, 200);
  });
};

watch(
  () => queryTime.value,
  (newVal: any[]) => {
    handleDateRangeChange(newVal);
  },
);

onMounted(() => {
  getScreenHeight();
  window.addEventListener("resize", getScreenHeight);
  queryTime.value = getDefaultDateRange();
  queryReturnMaterials();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", getScreenHeight);
});
</script>

<style scoped>
.el-pagination {
  justify-content: center;
}

.mt-2 {
  margin-top: 8px;
}

.mb-2 {
  margin-bottom: 8px;
}

.detail-header {
  /* margin-top: 10px; */
  padding: 6px 10px;
  font-size: 16px;
  font-weight: 600;
  /* color: #fff; */
  /* background-color: #006487; */
  border-radius: 4px 4px 0 0;
}

:deep(.el-table .unused-row > td.el-table__cell) {
  background-color: #f56c6c !important;
  color: #fff;
}

.call-order-link {
  color: #006487;
  text-decoration: underline;
  cursor: pointer;
}
</style>
