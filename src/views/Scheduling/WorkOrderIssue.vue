<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <el-form ref="formRef" :inline="true" size="small" label-width="auto" @submit.prevent>
        <el-form-item :label="t('Scheduling.WorkOrderIssue.groupOrder')" prop="groupOrder" class="mb-2">
          <el-input v-model="getForm.group_order" :placeholder="t('Scheduling.WorkOrderIssue.pleaseInputGroupOrder')" clearable
            @clear="queryReturnMaterials" @keyup.enter="queryReturnMaterials" style="width: 200px" />
        </el-form-item>
        <el-form-item :label="t('Scheduling.WorkOrderIssue.reelId')" prop="reelId" class="mb-2">
          <el-input v-model="getForm.reel_id" :placeholder="t('Scheduling.WorkOrderIssue.reelId')" clearable
            @clear="queryReturnMaterials" @keyup.enter="queryReturnMaterials" style="width: 200px" />
        </el-form-item>
        <el-form-item :label="t('Scheduling.WorkOrderIssue.timeRange')" prop="queryTime" class="mb-2">
          <el-date-picker style="width: 350px;" v-model="queryTime" type="datetimerange" range-separator="-"
            :start-placeholder="t('Scheduling.WorkOrderIssue.startTimePlaceholder')"
            :end-placeholder="t('Scheduling.WorkOrderIssue.endTimePlaceholder')"
            value-format="YYYY-MM-DDTHH:mm:ss" :shortcuts="shortcuts1" :default-time="[
              new Date(2000, 1, 1, 0, 0, 0),
              new Date(2000, 1, 1, 23, 59, 59),
            ]" :clearable="false" @change="handleDateRangeChange" :disabled-date="disabledDate" />
        </el-form-item>
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
        :header-cell-style="{ backgroundColor: '#006487', color: '#fff' }"
        highlight-current-row @row-click="handleRowClick">
        <el-table-column type="index" align="center" fixed :label="t('publicText.index')" width="50">
          <template #default="scope">
            <span>{{ (getForm.PageIndex - 1) * getForm.PageSize + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="t('Scheduling.WorkOrderIssue.groupOrder')" prop="group_order"
          :min-width="getColumnWidth('group_order')" show-overflow-tooltip />
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
        <el-table-column :label="t('publicText.operation')" fixed="right" width="120" align="center">
          <template #default="{ row }">
            <el-button type="success" size="small" @click.stop="handleIssue(row)">
              {{ t('Scheduling.WorkOrderIssue.issueMaterials') }}
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
        <el-pagination :size="'small'" background @size-change="handleSizeChange"
          @current-change="handleCurrentChange" :pager-count="5" :current-page="getForm.PageIndex"
          :page-size="getForm.PageSize" :page-sizes="[30, 50, 100, 200, 300]"
          layout="total,sizes, prev, pager, next" :total="total">
        </el-pagination>
      </div>

      <!-- 下表格：明细 -->
      <div class="detail-header">
        <span>{{ t('Scheduling.WorkOrderIssue.detailTitle') }}
          <template v-if="currentRow.group_order">: {{ currentRow.group_order }}</template>
        </span>
      </div>
      <el-table :data="detailData" size="small" :style="{ width: '100%' }" :height="detailTableHeight"
        :tooltip-effect="'dark'" border fit ref="detailTableRef"
        :header-cell-style="{ backgroundColor: '#006487', color: '#fff' }">
        <el-table-column type="index" align="center" fixed :label="t('publicText.index')" width="50" />
        <el-table-column :label="t('Scheduling.WorkOrderIssue.mesWorkOrder')" prop="mes_work_order"
          :min-width="getColumnWidth1('mes_work_order')" show-overflow-tooltip />
        <el-table-column :label="t('Scheduling.WorkOrderIssue.materialPn')" prop="material_pn"
          :min-width="getColumnWidth1('material_pn')" show-overflow-tooltip />
        <el-table-column :label="t('Scheduling.WorkOrderIssue.reelId')" prop="reel_id"
          :min-width="getColumnWidth1('reel_id')" show-overflow-tooltip />
        <el-table-column :label="t('Scheduling.WorkOrderIssue.totalQty')" prop="total_qty" width="100"
          align="center" />
        <el-table-column :label="t('Scheduling.WorkOrderIssue.remainQty')" prop="remain_qty" width="100"
          align="center" />
        <el-table-column :label="t('Scheduling.WorkOrderIssue.actRetQty')" prop="act_ret_qty" width="100"
          align="center" />
        <el-table-column :label="t('Scheduling.WorkOrderIssue.status')" prop="status" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status ? 'success' : 'info'" size="small">
              {{ row.status_name || '-' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="t('Scheduling.WorkOrderIssue.uploadStatus')" prop="upload_status_name"
          :min-width="getColumnWidth1('upload_status_name')" align="center">
          <template #default="{ row }">
            <el-tag :type="row.upload_status === 1 ? 'success' : 'info'" size="small">
              {{ row.upload_status_name || '-' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="t('Scheduling.WorkOrderIssue.batchId')" prop="batch_id"
          :min-width="getColumnWidth1('batch_id')" />
        <el-table-column :label="t('Scheduling.WorkOrderIssue.outOri')" prop="out_ori"
          :min-width="getColumnWidth1('out_ori')" />
        <el-table-column :label="t('Scheduling.WorkOrderIssue.outWareHouse')" prop="out_ware_house"
          :min-width="getColumnWidth1('out_ware_house')" />
        <el-table-column :label="t('Scheduling.WorkOrderIssue.createTime')" prop="create_time"
          :min-width="getColumnWidth1('create_time')" show-overflow-tooltip>
          <template #default="{ row }">
            {{ formatDate(row.create_time) }}
          </template>
        </el-table-column>
        <template #empty>
          <div class="flex items-center justify-center h-100%">
            <el-empty />
          </div>
        </template>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { QueryReturnMaterials, QueryReturnMaterialDetails, IssueMaterials } from "@/api/Scheduling/WorkOrderIssue";
import { useTableColumnWidth } from "@/hooks/useTableColumnWidth";
import { ref, reactive, nextTick, onMounted, onBeforeUnmount, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useUserStoreWithOut } from "@/stores/modules/user";
import dayjs from "dayjs";
import { useI18n } from "vue-i18n";
import { shortcuts1 } from "@/utils/dataMenu";

const userStore = useUserStoreWithOut();
const { t } = useI18n();
const tableRef = ref();
const detailTableRef = ref();
const masterTableHeight = ref(0);
const detailTableHeight = ref(0);
const tableData = ref<any[]>([]);
const detailData = ref<any[]>([]);
const total = ref(0);
const currentRow = reactive<any>({});

const getForm = reactive({
  PageIndex: 1,
  PageSize: 50,
  group_order: '',
  reel_id: '',
  status: 0,
  upload_status: 0,
  start_time: '',
  end_time: '',
});

const queryTime = ref<any[]>([]);

const handleDateRangeChange = (val: any[]) => {
  getForm.start_time = val?.[0] || "";
  getForm.end_time = val?.[1] || "";
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
  };
  if (getForm.group_order) params.group_order = getForm.group_order;
  if (getForm.start_time) params.start_time = getForm.start_time;
  if (getForm.end_time) params.end_time = getForm.end_time;

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
        detailData.value = res.Data;
      } else {
        detailData.value = [];
      }
    })
    .catch(() => {
      detailData.value = [];
    });
};

const resetQuery = () => {
  queryTime.value = getDefaultDateRange();
  getForm.group_order = '';
  getForm.reel_id = '';
  getForm.PageIndex = 1;
  tableData.value = [];
  total.value = 0;
  clearDetail();
};

const handleIssue = (row: any) => {
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
      issueMaterials(group_order);
    })
    .catch(() => {});
};

const issueMaterials = (group_order: string) => {
  IssueMaterials({
    group_order: group_order,
    operator_name: userStore.getUserInfo || "",
    published_bom_status: "",
    confirm_all_pointed: true
  })
    .then((res: any) => {
      if (res.Success) {
        ElMessage.success(res.Message || t("publicText.success"));
        queryReturnMaterials();
      } else {
        ElMessage.error(res.Message || t("publicText.failure"));
      }
    })
    .catch(() => {});
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
    const availableHeight = window.innerHeight - 190;
    masterTableHeight.value = Math.max(Math.floor(availableHeight * 0.4), 180);
    detailTableHeight.value = Math.max(availableHeight - masterTableHeight.value - 40, 200);
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
</style>
