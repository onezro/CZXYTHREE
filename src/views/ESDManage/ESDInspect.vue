<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <!-- 状态筛选 -->
      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
        <el-tab-pane :label="t('esd.inspect.all')" name="all" />
        <el-tab-pane :label="t('esd.inspect.pending')" name="0" />
        <el-tab-pane :label="t('esd.inspect.executing')" name="3" />
      </el-tabs>

      <!-- 任务列表 -->
      <el-table ref="tableRef" :data="pagedTasks" border :height="tableHeight" stripe size="small"
        v-loading="loading" highlight-current-row>
        <el-table-column type="index" :label="t('publicText.index')" width="55" align="center">
          <template #default="{ $index }">
            {{ $index + 1 + (query.PageIndex - 1) * query.PageSize }}
          </template>
        </el-table-column>
        <el-table-column prop="TaskCode" :label="t('esd.inspect.taskCode')" :min-width="getColumnWidth('TaskCode')" />
        <el-table-column prop="EsdType" :label="t('esd.inspect.esdType')" :min-width="getColumnWidth('EsdType')" />
        <el-table-column prop="FormName" :label="t('esd.inspect.formName')" :min-width="getColumnWidth('FormName')" />
        <el-table-column prop="FormCode" :label="t('esd.inspect.formCode')" :min-width="getColumnWidth('FormCode')" />
        <el-table-column prop="ExecuteStatus" :label="t('esd.inspect.executeStatus')"
          :min-width="getColumnWidth('ExecuteStatus')" align="center">
          <template #default="{ row }">
            <el-tag :type="getExecuteStatusType(row.ExecuteStatus)">
              {{ getExecuteStatusText(row.ExecuteStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="t('publicText.operation')" fixed="right" width="120" align="center">
          <template #default="{ row }">
            <el-button size="small" type="primary" icon="EditPen" @click="openInspect(row)">
              {{ t('esd.inspect.inspect') }}
            </el-button>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty />
        </template>
      </el-table>

      <el-pagination class="mt-2" align="center" background size="small" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" :current-page="query.PageIndex" :page-size="query.PageSize"
        :page-sizes="[10, 20, 50, 100]" layout="total,sizes, prev, pager, next" :total="filteredTasks.length" />
    </el-card>

    <!-- 点检抽屉 -->
    <el-drawer v-model="drawerVisible" :title="t('esd.inspect.title')" size="75%" :close-on-click-modal="false"
      @closed="handleDrawerClosed">
      <div v-loading="detailLoading" class="inspect-body">
        <!-- 任务信息 -->
        <el-descriptions :column="4" border size="small" class="mb-2">
          <el-descriptions-item :label="t('esd.inspect.taskCode')">{{ inspectTask.TaskCode || '-'
            }}</el-descriptions-item>
          <el-descriptions-item :label="t('esd.inspect.esdType')">{{ inspectTask.EsdType || '-'
            }}</el-descriptions-item>
          <el-descriptions-item :label="t('esd.inspect.formName')">{{ inspectTask.FormName || '-'
            }}</el-descriptions-item>
          <el-descriptions-item :label="t('esd.inspect.formCode')">{{ inspectTask.FormCode || '-'
            }}</el-descriptions-item>
          <el-descriptions-item :label="t('esd.inspect.productionBatch')">{{ inspectTask.ProductionBatch || '-'
            }}</el-descriptions-item>
        </el-descriptions>

        <!-- 车间/线体筛选 -->
        <div class="flex items-center mb-2" style="gap: 12px">
          <span class="filter-label">{{ t('esd.inspect.workshop') }}</span>
          <el-select v-model="filterWorkshop" size="small" style="width: 150px" @change="onWorkshopChange">
            <el-option v-for="w in workshopColumns" :key="w.code" :label="w.Workshop" :value="w.Workshop" />
          </el-select>
          <template v-if="lineColumns.length">
            <span class="filter-label">{{ t('esd.inspect.lineName') }}</span>
            <el-select v-model="filterLine" size="small" clearable style="width: 150px" @change="fetchDetail">
              <el-option v-for="l in lineColumns" :key="l.name" :label="l.name" :value="l.name" />
            </el-select>
          </template>
          <el-button size="small" @click="resetFilter">{{ t('publicText.reset') }}</el-button>
          <el-button size="small" type="success" plain :disabled="detailLoading" @click="handleAppend">
            {{ t('esd.inspect.appendDetail') }}
          </el-button>
        </div>

        <!-- 进度 -->
        <div class="flex items-center mb-2" style="gap: 12px">
          <el-progress :percentage="progressPercentRounded" :stroke-width="14" style="flex: 1" />
          <span class="progress-text">{{ completedCount }}/{{ totalItems }}</span>
        </div>

        <!-- 点检明细 -->
        <el-table :data="detailList" border size="small" :height="detailTableHeight" row-key="ExecutionDetailId">
          <el-table-column type="index" :label="t('publicText.index')" width="55" align="center" />
          <el-table-column prop="CheckContent" :label="t('esd.inspect.checkContent')" min-width="160"
            show-overflow-tooltip />
          <el-table-column prop="MeasureDevice" :label="t('esd.inspect.measureDevice')" min-width="120"
            show-overflow-tooltip />
          <el-table-column :label="t('esd.inspect.limits')" min-width="120" align="center">
            <template #default="{ row }">{{ row.LowerLimit }} ~ {{ row.UpperLimit }}</template>
          </el-table-column>
          <el-table-column prop="WorkStation" :label="t('esd.inspect.workStation')" min-width="100" />
          <el-table-column prop="ResponsibleUser" :label="t('esd.inspect.responsibleUser')" min-width="100" />
          <el-table-column :label="t('esd.inspect.checkValue')" min-width="200" align="center">
            <template #default="{ row }">
              <el-input v-if="row._status === 0" v-model="row._inputValue" size="small"
                :disabled="row._saving" :placeholder="t('esd.inspect.checkValuePlaceholder')"
                @keyup.enter="confirmValue(row)" />
              <span v-else>{{ row._actualValue }}</span>
            </template>
          </el-table-column>
         
          <el-table-column :label="t('esd.inspect.abnormalInfo')" min-width="240">
            <template #default="{ row }">
              <template v-if="row._status === 2">
                <el-input v-model="row.AbnormalPhenomenon" size="small" class="mb-1"
                  :placeholder="t('esd.inspect.abnormalPhenomenon')" />
                <el-input v-model="row.ProblemLocation" size="small" class="mb-1"
                  :placeholder="t('esd.inspect.problemLocation')" />
                <el-input v-model="row.PreliminaryCause" size="small"
                  :placeholder="t('esd.inspect.preliminaryCause')" />
              </template>
              <template v-else-if="row.AbnormalPhenomenon || row.ProblemLocation || row.PreliminaryCause">
                <div>{{ t('esd.inspect.abnormalPhenomenon') }}：{{ row.AbnormalPhenomenon || '-' }}</div>
                <div>{{ t('esd.inspect.problemLocation') }}：{{ row.ProblemLocation || '-' }}</div>
                <div>{{ t('esd.inspect.preliminaryCause') }}：{{ row.PreliminaryCause || '-' }}</div>
              </template>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('publicText.operation')" width="100" fixed="right" align="center">
            <template #default="{ row }">
              <el-button v-if="row._status === 0" size="small" type="success" :loading="row._saving"
                :disabled="row._saving" @click="confirmValue(row)">
                {{ t('publicText.confirm') }}
              </el-button>
              <el-button v-else size="small" type="primary" @click="resetItem(row)">
                {{ t('esd.inspect.modify') }}
              </el-button>
            </template>
          </el-table-column>
           <el-table-column :label="t('esd.inspect.result')" min-width="100" align="center" fixed="right">
            <template #default="{ row }">
              <el-tag v-if="row._status === 0" type="info">{{ t('esd.inspect.unchecked') }}</el-tag>
              <el-tag v-else :type="row._status === 1 ? 'success' : 'danger'">
                {{ row._status === 1 ? t('esd.inspect.qualified') : t('esd.inspect.unqualified') }}
              </el-tag>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty />
          </template>
        </el-table>
      </div>

      <template #footer>
        <el-button @click="drawerVisible = false">{{ t('publicText.close') }}</el-button>
        <el-button type="primary" :loading="submitting" @click="submitTask">
          {{ t('esd.inspect.submit') }}
        </el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick, onBeforeMount, onMounted, onBeforeUnmount } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { useUserStoreWithOut } from '@/stores/modules/user';
import { calculateColumnsWidth } from '@/utils/tableminWidth';
import {
  QueryExecutionTaskList,
  QueryExecutionDetail,
  UpdateExecutionDetail,
  SubmitExecutionTask,
  AddExecutionDetail,
} from '@/api/esdManage/ESDInspect';
import { GetSMTValorLine, GetICTValorLine } from '@/api/smtApply/changeover';
import { GetMillingValorLine } from '@/api/smtApply/changeoverMill';

const { t } = useI18n();
const userStore = useUserStoreWithOut();

// 后端 QueryExecutionTaskList 不支持按执行状态过滤（与 PDA 一致），故一次拉全后前端筛选+分页
const FETCH_PAGE_SIZE = 100;

// ==================== 任务列表 ====================
const activeTab = ref('all');
const allTasks = ref<any[]>([]);
const loading = ref(false);
const query = reactive({ PageIndex: 1, PageSize: 20 });
const tableRef = ref();
const tableHeight = ref(0);

const getExecuteStatusText = (status: number) => {
  if (status === 0) return t('esd.inspect.pending');
  if (status === 3) return t('esd.inspect.executing');
  return status ?? '-';
};
const getExecuteStatusType = (status: number) => {
  if (status === 0) return 'info';
  if (status === 3) return 'success';
  return 'info';
};

// 按执行状态筛选（全部 / 待执行 0 / 执行中 3）
const filteredTasks = computed(() => {
  if (activeTab.value === 'all') return allTasks.value;
  const state = Number(activeTab.value);
  return allTasks.value.filter((item: any) => item.ExecuteStatus === state);
});

// 前端分页
const pagedTasks = computed(() => {
  const start = (query.PageIndex - 1) * query.PageSize;
  return filteredTasks.value.slice(start, start + query.PageSize);
});

const fetchTasks = async () => {
  loading.value = true;
  try {
    const first: any = await QueryExecutionTaskList({ pageIndex: 1, pageSize: FETCH_PAGE_SIZE });
    if (!first?.Success) {
      ElMessage.error(first?.Message || t('message.queryFailure'));
      allTasks.value = [];
      return;
    }
    let rows = first.Data?.rows || [];
    const totalCount = first.Data?.total || 0;
    const pages = Math.ceil(totalCount / FETCH_PAGE_SIZE);
    for (let i = 2; i <= pages; i++) {
      const res: any = await QueryExecutionTaskList({ pageIndex: i, pageSize: FETCH_PAGE_SIZE });
      if (res?.Success) rows = rows.concat(res.Data?.rows || []);
    }
    allTasks.value = rows;
    query.PageIndex = 1;
  } catch (error) {
    console.error('查询点检任务失败:', error);
    ElMessage.error(t('message.queryFailure'));
    allTasks.value = [];
  } finally {
    loading.value = false;
  }
};

const handleTabChange = () => {
  query.PageIndex = 1;
};
const handleSizeChange = (val: number) => {
  query.PageSize = val;
  query.PageIndex = 1;
};
const handleCurrentChange = (val: number) => {
  query.PageIndex = val;
};

// ==================== 点检抽屉 ====================
const drawerVisible = ref(false);
const detailLoading = ref(false);
const submitting = ref(false);
const inspectTask = ref<any>({});
const detailList = ref<any[]>([]);
const totalItems = ref(0);
const filterWorkshop = ref('');
const filterLine = ref('');
const lineColumns = ref<{ name: string }[]>([]);

const workshopColumns = ref([
  { Workshop: 'SMT车间', code: 'SMT' },
  { Workshop: 'ICT车间', code: 'ICT' },
  { Workshop: '铣板车间', code: 'MILL' },
  { Workshop: '组装车间', code: 'ASSY' },
  { Workshop: '电子料仓库', code: '' },
  { Workshop: '半成品仓库', code: '' },
  { Workshop: '成品仓库', code: '' },
  { Workshop: '不良品仓库', code: '' },
  { Workshop: '喷涂三防车间', code: '' },
  { Workshop: 'DIP车间', code: '' },
  { Workshop: '自动化车间', code: '' },
  { Workshop: '老化测试车间', code: '' },
  { Workshop: '成品包装车间', code: '' },
  { Workshop: '各车间', code: 'ALL' },
]);

const completedCount = computed(() => detailList.value.filter((i: any) => i._status !== 0).length);
const progressPercent = computed(() =>
  totalItems.value === 0 ? 0 : (completedCount.value / totalItems.value) * 100
);
const progressPercentRounded = computed(() => Math.round(progressPercent.value));

const openInspect = (row: any) => {
  inspectTask.value = { ...row };
  filterWorkshop.value = row.Workshop || '';
  filterLine.value = row.LineName || '';
  lineColumns.value = [];
  detailList.value = [];
  totalItems.value = 0;
  drawerVisible.value = true;
  if (filterWorkshop.value) fetchLineData(filterWorkshop.value);
  fetchDetail();
};

// 根据车间获取线体
const fetchLineData = (workshopName: string) => {
  const selected = workshopColumns.value.find((w) => w.Workshop === workshopName);
  const code = selected?.code;
  lineColumns.value = [];
  let apiFn: any = null;
  if (code === 'SMT') apiFn = GetSMTValorLine;
  else if (code === 'ICT') apiFn = GetICTValorLine;
  else if (code === 'MILL') apiFn = GetMillingValorLine;
  if (!apiFn) return;
  apiFn({}).then((res: any) => {
    if (res.Success && res.Data) {
      lineColumns.value = res.Data.map((v: any) => ({ name: v.line }));
    }
  });
};

const onWorkshopChange = () => {
  filterLine.value = '';
  fetchLineData(filterWorkshop.value);
  fetchDetail();
};

const resetFilter = () => {
  filterWorkshop.value = '';
  filterLine.value = '';
  lineColumns.value = [];
  fetchDetail();
};

// 解析数值：支持普通数字与科学计数法（如 1.00e06），非法返回 NaN
const parseNumber = (value: any) => {
  if (value === null || value === undefined) return NaN;
  const str = String(value).trim();
  if (!/^[+-]?(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?$/.test(str)) return NaN;
  return Number(str);
};

const fetchDetail = async () => {
  if (!inspectTask.value.TaskId) return;
  detailLoading.value = true;
  try {
    const res: any = await QueryExecutionDetail({
      TaskId: Number(inspectTask.value.TaskId),
      TaskCode: inspectTask.value.TaskCode,
      Workshop: filterWorkshop.value,
      LineName: filterLine.value,
    });
    if (res.Success) {
      const data = res.Data || [];
      detailList.value = data.map((item: any) => {
        let initStatus = 0;
        let actualVal = '';
        if (item.CheckValue !== null && item.CheckValue !== undefined && String(item.CheckValue).trim() !== '') {
          const val = parseNumber(item.CheckValue);
          if (!isNaN(val)) {
            const lower = parseNumber(item.LowerLimit);
            const upper = parseNumber(item.UpperLimit);
            if (!isNaN(lower) && !isNaN(upper)) {
              initStatus = val >= lower && val <= upper ? 1 : 2;
            } else {
              initStatus = 1;
            }
          }
          actualVal = item.CheckValue;
        }
        return {
          ...item,
          _status: initStatus,
          _actualValue: actualVal,
          _inputValue: '',
          AbnormalPhenomenon: item.AbnormalPhenomenon || '',
          ProblemLocation: item.ProblemLocation || '',
          PreliminaryCause: item.PreliminaryCause || '',
        };
      });
      totalItems.value = detailList.value.length;
      if (data.length > 0) {
        const first = data[0];
        inspectTask.value = {
          ...inspectTask.value,
          TaskId: first.TaskId ?? inspectTask.value.TaskId,
          TaskCode: first.TaskCode || inspectTask.value.TaskCode,
          EsdType: first.EsdType || inspectTask.value.EsdType,
          FormName: first.FormName || inspectTask.value.FormName,
          FormCode: first.FormCode || inspectTask.value.FormCode,
          ProductionBatch: first.ProductionBatch || inspectTask.value.ProductionBatch,
        };
      }
    } else {
      ElMessage.error(res.Message || t('message.queryFailure'));
    }
  } catch (error) {
    console.error('查询点检明细失败:', error);
    ElMessage.error(t('message.queryFailure'));
  } finally {
    detailLoading.value = false;
  }
};

// 修改：将已判定项恢复为待录入
const resetItem = (row: any) => {
  row._status = 0;
  row._inputValue = String(row._actualValue);
  row._actualValue = '';
};

// 确认检测值并判定（回车/确定时保存单条明细）
const confirmValue = async (row: any) => {
  if (row._status !== 0 || row._saving) return;
  const inputStr = String(row._inputValue || '').trim();
  const val = parseNumber(inputStr);
  if (isNaN(val)) {
    ElMessage.warning(t('esd.inspect.invalidNumber'));
    return;
  }
  const lower = parseNumber(row.LowerLimit);
  const upper = parseNumber(row.UpperLimit);
  if (isNaN(lower) || isNaN(upper)) {
    ElMessage.warning(t('esd.inspect.invalidLimit'));
    return;
  }
  row._saving = true;
  try {
    const res: any = await UpdateExecutionDetail({
      ExecutionDetailId: row.ExecutionDetailId,
      CheckValue: inputStr,
      UserName: userStore.getUserInfo || 'system',
    });
    if (!res.Success) {
      ElMessage.error(res.Message || t('esd.inspect.saveDetailFailure'));
      return;
    }
    row._status = val >= lower && val <= upper ? 1 : 2;
    row._actualValue = inputStr;
    row._inputValue = '';
    if (row._status === 2) {
      ElMessage.warning(t('esd.inspect.ngTip'));
    }
  } catch (error) {
    console.error('保存点检明细失败:', error);
    ElMessage.error(t('esd.inspect.saveDetailFailure'));
  } finally {
    row._saving = false;
  }
};

// 追加明细（按当前明细整组追加）
const handleAppend = () => {
  ElMessageBox.prompt(t('esd.inspect.appendCountTip'), t('esd.inspect.appendDetail'), {
    confirmButtonText: t('publicText.confirm'),
    cancelButtonText: t('publicText.cancel'),
    inputPattern: /^[1-9]\d*$/,
    inputErrorMessage: t('esd.inspect.appendCountInvalid'),
  })
    .then(async (val: any) => {
      try {
        const res: any = await AddExecutionDetail({
          taskCode: inspectTask.value.TaskCode,
          addCount: Number(val.value),
        });
        if (res.Success) {
          ElMessage.success(res.Message || t('esd.inspect.appendSuccess'));
          await fetchDetail();
        } else {
          ElMessage.error(res.Message || t('esd.inspect.appendFailure'));
        }
      } catch (error) {
        console.error('追加明细失败:', error);
        ElMessage.error(t('esd.inspect.appendFailure'));
      }
    })
    .catch(() => { });
};

// 提交点检
const submitTask = () => {
  const ngItems = detailList.value.filter((item: any) => item._status === 2);
  const invalidNg = ngItems.some(
    (item: any) => !item.AbnormalPhenomenon || !item.ProblemLocation || !item.PreliminaryCause
  );
  if (invalidNg) {
    ElMessage.warning(t('esd.inspect.submitValidate'));
    return;
  }

  const details = detailList.value.map((item: any) => ({
    ExecutionDetailId: item.ExecutionDetailId,
    CheckValue: String(item._actualValue),
    ProductionBatch: item.ProductionBatch || inspectTask.value.ProductionBatch || '',
    AbnormalPhenomenon: item.AbnormalPhenomenon || '',
    ProblemLocation: item.ProblemLocation || '',
    PreliminaryCause: item.PreliminaryCause || '',
  }));

  ElMessageBox.confirm(t('esd.inspect.confirmSubmit'), t('publicText.tip'), {
    confirmButtonText: t('publicText.confirm'),
    cancelButtonText: t('publicText.cancel'),
    type: 'warning',
  })
    .then(async () => {
      submitting.value = true;
      try {
        const res: any = await SubmitExecutionTask({
          TaskId: Number(inspectTask.value.TaskId),
          TaskCode: inspectTask.value.TaskCode,
          Inspector: userStore.getUserInfo || 'system',
          ProductionBatch: inspectTask.value.ProductionBatch || '',
          Details: details,
        });
        if (res.Success) {
          ElMessage.success(t('esd.inspect.submitSuccess'));
          drawerVisible.value = false;
          fetchTasks();
        } else {
          ElMessage.error(res.Message || t('esd.inspect.submitFailure'));
        }
      } catch (error) {
        console.error('提交点检失败:', error);
        ElMessage.error(t('esd.inspect.submitFailure'));
      } finally {
        submitting.value = false;
      }
    })
    .catch(() => { });
};

const handleDrawerClosed = () => {
  detailList.value = [];
  totalItems.value = 0;
  lineColumns.value = [];
};

// ==================== 高度与列宽自适应 ====================
const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 210;
  });
};

const detailTableHeight = computed(() => Math.max(200, window.innerHeight - 300));

const tableColumns = computed(() => {
  if (!tableRef.value) return [];
  return tableRef.value.columns
    .map((item: any) => ({ prop: item.property, label: item.label }))
    .filter(
      (item: any) =>
        item.label !== t('publicText.index') && item.label !== t('publicText.operation')
    );
});

const columnWidths = computed(() =>
  calculateColumnsWidth(tableColumns.value, pagedTasks.value, { padding: 25, fontSize: 13 })
);

const getColumnWidth = (prop: string) => columnWidths.value[prop] || 'auto';

// ==================== 生命周期 ====================
onBeforeMount(() => {
  getScreenHeight();
  fetchTasks();
});

onMounted(() => window.addEventListener('resize', getScreenHeight));
onBeforeUnmount(() => window.removeEventListener('resize', getScreenHeight));
</script>

<style scoped>
.el-pagination {
  justify-content: center;
}

.filter-label {
  font-size: 13px;
  color: #606266;
}

.progress-text {
  font-size: 13px;
  color: #606266;
  white-space: nowrap;
}

.inspect-body {
  height: 100%;
}
</style>
