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
    <el-drawer v-model="drawerVisible" :title="inspectTask.TaskCode || t('esd.inspect.title')" size="80%"
      :close-on-click-modal="false" @closed="handleDrawerClosed">
      <div v-loading="detailLoading" class="inspect-body">
        <!-- 任务信息 -->
        <el-descriptions :column="4" border size="small" class="mb-2 task-desc">
          <el-descriptions-item :label="t('esd.inspect.taskCode')">{{ inspectTask.TaskCode || '-'
            }}</el-descriptions-item>
          <el-descriptions-item :label="t('esd.inspect.formName')">{{ inspectTask.FormName || '-'
            }}</el-descriptions-item>
          <el-descriptions-item :label="t('esd.inspect.formCode')">{{ inspectTask.FormCode || '-'
            }}</el-descriptions-item>
          <el-descriptions-item :label="t('esd.inspect.productionBatch')">{{ inspectTask.ProductionBatch || '-'
            }}</el-descriptions-item>
        </el-descriptions>

        <el-tabs v-model="detailTab" class="detail-tabs">
          <!-- 未检验：待填写、待提交的模板明细 -->
          <el-tab-pane name="pending" class="detail-pane">
            <template #label>
              {{ t('esd.inspect.pendingTab') }}（{{ templateDetails.length }}）
            </template>

            <div class="pane-body">
              <!-- 本次点检信息（提交时才绑定地点） -->
              <el-card shadow="never" class="location-card mb-2">
                <div class="card-title">
                  <span>{{ t('esd.inspect.locationInfo') }}</span>
                  <span class="card-tip">{{ t('esd.inspect.locationTip') }}</span>
                </div>
                <el-row :gutter="12">
                  <el-col :span="5">
                    <div class="field-label">{{ t('esd.inspect.workshop') }}<span class="required">*</span></div>
                    <el-select v-model="form.Workshop" size="small" clearable style="width: 100%"
                      :placeholder="t('esd.inspect.workshopPlaceholder')" @change="onWorkshopChange">
                      <el-option v-for="w in workshopList" :key="w.Workshop" :label="w.Workshop" :value="w.Workshop" />
                    </el-select>
                  </el-col>
                  <el-col :span="5">
                    <div class="field-label">{{ t('esd.inspect.lineName') }}<span class="required">*</span></div>
                    <el-select v-model="form.LineName" size="small" clearable filterable style="width: 100%"
                      :disabled="!form.Workshop" :placeholder="t('esd.inspect.lineNamePlaceholder')"
                      @change="onLineChange">
                      <el-option v-for="l in lineList" :key="l.name" :label="l.name" :value="l.name" />
                    </el-select>
                  </el-col>
                  <el-col :span="4">
                    <div class="field-label">{{ t('esd.inspect.workStation') }}</div>
                    <el-input v-model="form.WorkStation" size="small"
                      :placeholder="t('esd.inspect.workStationPlaceholder')" />
                  </el-col>
                  <el-col :span="5">
                    <div class="field-label">{{ t('esd.inspect.deviceName') }}</div>
                    <el-select-v2 v-model="form.DeviceCode" size="small" clearable filterable style="width: 100%"
                      :disabled="!form.LineName" :options="deviceOptions"
                      :placeholder="t('esd.inspect.deviceNamePlaceholder')" @change="onDeviceChange" />
                  </el-col>
                  <el-col :span="5">
                    <div class="field-label">{{ t('esd.inspect.deviceCode') }}</div>
                    <el-input v-model="form.DeviceCode" size="small" readonly
                      :placeholder="t('esd.inspect.deviceCodePlaceholder')" />
                  </el-col>
                </el-row>
                <div v-if="deviceQueried && !deviceList.length" class="device-tip">
                  {{ t('esd.inspect.deviceNotQueried') }}
                </div>
              </el-card>

              <!-- 多组模板切换：每次只能提交一组 -->
              <div v-if="groupedTemplates.length > 1" class="group-switch mb-2">
                <span class="filter-label">{{ t('esd.inspect.groupLabel') }}</span>
                <el-radio-group v-model="currentGroupKey" size="small">
                  <el-radio-button v-for="(g, i) in groupedTemplates" :key="g.key" :value="g.key">
                    {{ t('esd.inspect.groupItem', { index: i + 1, count: g.items.length }) }}
                  </el-radio-button>
                </el-radio-group>
              </div>

              <!-- 当前组明细 -->
              <el-table :data="currentGroupItems" border size="small" height="100%" class="detail-table"
                row-key="ExecutionDetailId">
                <el-table-column type="index" :label="t('publicText.index')" width="55" align="center" />
                <el-table-column prop="CheckContent" :label="t('esd.inspect.checkContent')" min-width="160"
                  show-overflow-tooltip />
                <el-table-column prop="MeasureDevice" :label="t('esd.inspect.measureDevice')" min-width="110"
                  show-overflow-tooltip />
                <el-table-column :label="t('esd.inspect.limits')" min-width="110" align="center">
                  <template #default="{ row }">{{ row.LowerLimit }} ~ {{ row.UpperLimit }}</template>
                </el-table-column>
                <el-table-column prop="WorkStation" :label="t('esd.inspect.workStation')" min-width="90" />
                <el-table-column prop="ResponsibleUser" :label="t('esd.inspect.responsibleUser')" min-width="90" />
                <el-table-column :label="t('esd.inspect.checkValue')" min-width="200" align="center">
                  <template #default="{ row }">
                    <el-input v-if="row._status === 0" v-model="row._inputValue" size="small"
                      :placeholder="t('esd.inspect.checkValuePlaceholder')" @keyup.enter="confirmValue(row)" />
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
                <el-table-column :label="t('esd.inspect.result')" min-width="90" align="center">
                  <template #default="{ row }">
                    <el-tag v-if="row._status === 0" type="info">{{ t('esd.inspect.unchecked') }}</el-tag>
                    <el-tag v-else :type="row._status === 1 ? 'success' : 'danger'">
                      {{ row._status === 1 ? t('esd.inspect.qualified') : t('esd.inspect.unqualified') }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column :label="t('publicText.operation')" width="90" fixed="right" align="center">
                  <template #default="{ row }">
                    <el-button v-if="row._status === 0" size="small" type="success" @click="confirmValue(row)">
                      {{ t('publicText.confirm') }}
                    </el-button>
                    <el-button v-else size="small" type="primary" @click="resetItem(row)">
                      {{ t('esd.inspect.modify') }}
                    </el-button>
                  </template>
                </el-table-column>
                <template #empty>
                  <el-empty :description="t('esd.inspect.noPendingDetails')" />
                </template>
              </el-table>
            </div>
          </el-tab-pane>

          <!-- 已完成：已提交的点检记录 -->
          <el-tab-pane name="submitted" class="detail-pane">
            <template #label>
              {{ t('esd.inspect.submittedTab') }}（{{ submittedDetails.length }}）
            </template>

            <div class="pane-body">
              <el-table :data="submittedDetails" border size="small" height="100%" class="detail-table"
                row-key="ExecutionDetailId">
                <el-table-column type="index" :label="t('publicText.index')" width="55" align="center" />
                <el-table-column prop="CheckContent" :label="t('esd.inspect.checkContent')" min-width="160"
                  show-overflow-tooltip />
                <el-table-column prop="CheckValue" :label="t('esd.inspect.checkValue')" min-width="100" />
                <el-table-column :label="t('esd.inspect.limits')" min-width="110" align="center">
                  <template #default="{ row }">{{ row.LowerLimit }} ~ {{ row.UpperLimit }}</template>
                </el-table-column>
                <el-table-column :label="t('esd.inspect.workshopLine')" min-width="150" show-overflow-tooltip>
                  <template #default="{ row }">{{ row.Workshop || '-' }} / {{ row.LineName || '-' }}</template>
                </el-table-column>
                <el-table-column prop="WorkStation" :label="t('esd.inspect.workStation')" min-width="90" />
                <el-table-column :label="t('esd.inspect.deviceName')" min-width="160" show-overflow-tooltip>
                  <template #default="{ row }">{{ deviceText(row) }}</template>
                </el-table-column>
                <el-table-column :label="t('esd.inspect.abnormalInfo')" min-width="200">
                  <template #default="{ row }">
                    <template v-if="row.AbnormalPhenomenon || row.ProblemLocation || row.PreliminaryCause">
                      <div>{{ t('esd.inspect.abnormalPhenomenon') }}：{{ row.AbnormalPhenomenon || '-' }}</div>
                      <div>{{ t('esd.inspect.problemLocation') }}：{{ row.ProblemLocation || '-' }}</div>
                      <div>{{ t('esd.inspect.preliminaryCause') }}：{{ row.PreliminaryCause || '-' }}</div>
                    </template>
                    <span v-else>-</span>
                  </template>
                </el-table-column>
                <el-table-column :label="t('esd.inspect.result')" min-width="90" align="center">
                  <template #default="{ row }">
                    <el-tag :type="submittedTagType(row)">{{ submittedStatusText(row) }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column :label="t('esd.inspect.inspector')" min-width="150" show-overflow-tooltip>
                  <template #default="{ row }">
                    {{ row.Inspector || '-' }} {{ submittedTime(row) }}
                  </template>
                </el-table-column>
                <template #empty>
                  <el-empty :description="t('esd.inspect.submittedEmpty')" />
                </template>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>

      <template #footer>
        <div class="drawer-footer">
          <el-button size="small" type="success" plain :disabled="isTaskCompleted || actionDisabled"
            :loading="appendSubmitting" @click="handleAppend">
            {{ t('esd.inspect.appendDetail') }}
          </el-button>
          <div>
            <el-button @click="drawerVisible = false">{{ t('publicText.close') }}</el-button>
            <el-button type="success" :disabled="isTaskCompleted || actionDisabled || !currentGroupItems.length"
              :loading="submitting" @click="submitGroup">
              {{ t('esd.inspect.submitGroup') }}
            </el-button>
            <el-button type="primary" :disabled="isTaskCompleted || actionDisabled" :loading="completing"
              @click="completeTask">
              {{ t('esd.inspect.completeTask') }}
            </el-button>
          </div>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick, onBeforeMount, onMounted, onBeforeUnmount } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';
import { useUserStoreWithOut } from '@/stores/modules/user';
import { calculateColumnsWidth } from '@/utils/tableminWidth';
import {
  QueryExecutionTaskList,
  QueryExecutionDetail,
  SubmitExecutionTask,
  AddExecutionDetail,
  CompleteExecutionTask,
  QueryWorkshopList,
  QueryLineDeviceList,
} from '@/api/esdManage/ESDInspect';
import { GetSMTValorLine, GetICTValorLine } from '@/api/smtApply/changeover';
import { GetMillingValorLine } from '@/api/smtApply/changeoverMill';

const { t } = useI18n();
const userStore = useUserStoreWithOut();

// 后端 QueryExecutionTaskList 不支持按执行状态过滤（与 PDA 一致），故一次拉全后前端筛选+分页
const FETCH_PAGE_SIZE = 100;

// 车间兜底数据（接口不可用时使用）
const DEFAULT_WORKSHOP_LIST = [
  { Workshop: 'SMT车间', code: 'SMT' },
  { Workshop: 'ICT车间', code: 'ICT' },
  { Workshop: '铣板车间', code: 'MILL' },
  { Workshop: '组装车间', code: 'ASSY' },
  { Workshop: '电子料仓库', code: 'ELEC' },
  { Workshop: '半成品仓库', code: 'SEMI' },
  { Workshop: '成品仓库', code: 'FINISHED' },
  { Workshop: '不良品仓库', code: 'DEFECT' },
  { Workshop: '喷涂三防车间', code: 'SPRAY' },
  { Workshop: 'DIP车间', code: 'DIP' },
  { Workshop: '自动化车间', code: 'AUTO' },
  { Workshop: '老化测试车间', code: 'AGING' },
  { Workshop: '成品包装车间', code: 'PACK' },
  { Workshop: '各车间', code: 'ALL' },
];

// ==================== 任务列表 ====================
const activeTab = ref('all');
const allTasks = ref<any[]>([]);
const loading = ref(false);
const query = reactive({ PageIndex: 1, PageSize: 20 });
const tableRef = ref();
const tableHeight = ref(0);

// 0待执行,1已完成,2已作废,3执行中
const getExecuteStatusText = (status: number) => {
  if (status === 0) return t('esd.inspect.pending');
  if (status === 1) return t('esd.task.status2');
  if (status === 2) return t('esd.task.status3');
  if (status === 3) return t('esd.inspect.executing');
  return status ?? '-';
};
const getExecuteStatusType = (status: number) => {
  if (status === 0) return 'info';
  if (status === 1) return 'success';
  if (status === 2) return 'warning';
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
const appendSubmitting = ref(false);
const completing = ref(false);
const inspectTask = ref<any>({});
const detailTab = ref('pending');
const templateDetails = ref<any[]>([]); // 当前待填写、待提交的模板明细
const submittedDetails = ref<any[]>([]); // 已提交的点检记录
const currentGroupKey = ref('');
const workshopList = ref<{ Workshop: string; code: string }[]>([]);
const lineList = ref<{ name: string }[]>([]);
const deviceList = ref<any[]>([]);
const deviceQueried = ref(false);

// 本次点检信息（提交时才绑定）
const form = reactive({
  Workshop: '',
  LineName: '',
  WorkStation: '',
  DeviceName: '',
  DeviceCode: '',
});

const isTaskCompleted = computed(() => Number(inspectTask.value.ExecuteStatus) === 1);
const actionDisabled = computed(
  () => detailLoading.value || submitting.value || appendSubmitting.value || completing.value
);

const deviceOptions = computed(() =>
  deviceList.value.map((d: any) => ({
    value: d.DeviceCode,
    label: d.DeviceName ? `${d.DeviceName}（${d.DeviceCode}）` : d.DeviceCode,
  }))
);

// 模板分组（AdditionalDetailGroupKey 区分，每次只能提交一组）
const groupKeyOf = (item: any) =>
  String(item.AdditionalDetailGroupKey ?? item.AdditionalDetailGroupId ?? 'default');

const groupedTemplates = computed(() => {
  const map = new Map<string, any[]>();
  templateDetails.value.forEach((item: any) => {
    const key = groupKeyOf(item);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(item);
  });
  return Array.from(map.entries()).map(([key, items]) => ({ key, items }));
});

const currentGroupItems = computed(() => {
  const group = groupedTemplates.value.find((g) => g.key === currentGroupKey.value);
  return group ? group.items : [];
});

const resetLocationForm = () => {
  form.Workshop = '';
  form.LineName = '';
  form.WorkStation = '';
  form.DeviceName = '';
  form.DeviceCode = '';
  lineList.value = [];
  deviceList.value = [];
  deviceQueried.value = false;
};

const openInspect = (row: any) => {
  inspectTask.value = { ...row };
  templateDetails.value = [];
  submittedDetails.value = [];
  currentGroupKey.value = '';
  detailTab.value = 'pending';
  resetLocationForm();
  drawerVisible.value = true;
  fetchWorkshopList();
  fetchDetail();
};

// 按表单号查询车间
const normalizeWorkshopList = (list: any[]) =>
  list
    .map((v: any) => {
      if (typeof v === 'string') return { Workshop: v, code: '' };
      return {
        Workshop: v.Workshop || v.WorkshopName || v.Name || '',
        code: v.WorkshopCode || v.Code || '',
      };
    })
    .filter((v) => v.Workshop);

const fetchWorkshopList = async () => {
  try {
    const res: any = await QueryWorkshopList();
    const list = res?.Success ? res.Data || [] : [];
    workshopList.value = list.length ? normalizeWorkshopList(list) : DEFAULT_WORKSHOP_LIST;
  } catch (error) {
    console.error('查询车间失败:', error);
    workshopList.value = DEFAULT_WORKSHOP_LIST;
  }
};

// 车间编码匹配线体接口
const resolveWorkshopCode = (workshopName: string, code: string) => {
  if (code) return String(code).toUpperCase();
  if (workshopName.includes('SMT')) return 'SMT';
  if (workshopName.includes('ICT')) return 'ICT';
  if (workshopName.includes('铣')) return 'MILL';
  return '';
};

// 根据车间获取线体
const fetchLineData = async (workshopName: string) => {
  lineList.value = [];
  if (!workshopName) return;
  const workshop = workshopList.value.find((w) => w.Workshop === workshopName);
  const code = resolveWorkshopCode(workshopName, workshop?.code || '');
  let apiFn: any = null;
  if (code === 'SMT') apiFn = GetSMTValorLine;
  else if (code === 'ICT') apiFn = GetICTValorLine;
  else if (code === 'MILL') apiFn = GetMillingValorLine;
  try {
    if (apiFn) {
      const res: any = await apiFn({});
      if (res?.Success && res.Data) {
        lineList.value = res.Data.map((v: any) => ({ name: v.line || v.LineName || v.name || '' })).filter(
          (v: any) => v.name
        );
      }
    }
    // 无对应线体接口时，按设备接口反推线体
    if (!lineList.value.length) {
      const res: any = await QueryLineDeviceList({
        Workshop: workshopName,
        LineName: '',
        EsdType: inspectTask.value.EsdType || '',
      });
      if (res?.Success && Array.isArray(res.Data)) {
        lineList.value = Array.from(new Set(res.Data.map((v: any) => v.LineName).filter(Boolean))).map(
          (name: any) => ({ name })
        );
      }
    }
  } catch (error) {
    console.error('查询线体失败:', error);
  }
};

// 车间变化：重载线体，清空后续选择
const onWorkshopChange = () => {
  form.LineName = '';
  form.WorkStation = '';
  form.DeviceName = '';
  form.DeviceCode = '';
  deviceList.value = [];
  deviceQueried.value = false;
  fetchLineData(form.Workshop);
};

// 线体变化：查询该线体下的设备
const onLineChange = () => {
  fetchDeviceData();
};

const fetchDeviceData = async () => {
  deviceList.value = [];
  deviceQueried.value = false;
  form.WorkStation = '';
  form.DeviceName = '';
  form.DeviceCode = '';
  if (!form.Workshop || !form.LineName) return;
  try {
    const res: any = await QueryLineDeviceList({
      Workshop: form.Workshop,
      LineName: form.LineName,
      EsdType: inspectTask.value.EsdType || '',
    });
    deviceList.value = res?.Success && Array.isArray(res.Data) ? res.Data : [];
  } catch (error) {
    console.error('查询设备失败:', error);
    deviceList.value = [];
  } finally {
    deviceQueried.value = true;
  }
};

// 选择设备：带出设备名称、设备编号、工位
const onDeviceChange = (value: any) => {
  if (!value) {
    form.DeviceName = '';
    form.WorkStation = '';
    return;
  }
  const device = deviceList.value.find((d: any) => d.DeviceCode === value);
  form.DeviceCode = value;
  form.DeviceName = device?.DeviceName || '';
  form.WorkStation = device?.WorkStation || '';
};

// 解析数值：支持普通数字与科学计数法（如 1.00e06），非法返回 NaN
const parseNumber = (value: any) => {
  if (value === null || value === undefined) return NaN;
  const str = String(value).trim();
  if (!/^[+-]?(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?$/.test(str)) return NaN;
  return Number(str);
};

// 计算单条判定结果：0 未点检，1 合格，2 不合格
const calcStatus = (item: any) => {
  if (item.CheckValue === null || item.CheckValue === undefined || String(item.CheckValue).trim() === '') return 0;
  const val = parseNumber(item.CheckValue);
  if (isNaN(val)) return 0;
  const lower = parseNumber(item.LowerLimit);
  const upper = parseNumber(item.UpperLimit);
  if (isNaN(lower) || isNaN(upper)) return 1;
  return val >= lower && val <= upper ? 1 : 2;
};

const decorateTemplates = (list: any[]) =>
  list.map((item: any) => ({
    ...item,
    _status: calcStatus(item),
    _actualValue: item.CheckValue || '',
    _inputValue: '',
    AbnormalPhenomenon: item.AbnormalPhenomenon || '',
    ProblemLocation: item.ProblemLocation || '',
    PreliminaryCause: item.PreliminaryCause || '',
  }));

const deviceText = (item: any) => {
  if (!item.DeviceName && !item.DeviceCode) return '-';
  if (item.DeviceName && item.DeviceCode) return `${item.DeviceName}（${item.DeviceCode}）`;
  return item.DeviceName || item.DeviceCode;
};

const submittedTime = (item: any) => {
  const time = item.CheckTime || item.SubmitTime || '';
  if (!time) return '';
  const date = dayjs(time);
  return date.isValid() ? date.format('YYYY-MM-DD HH:mm:ss') : String(time);
};

const submittedStatusText = (item: any) => {
  const status = calcStatus(item);
  if (status === 0) return t('esd.inspect.submitted');
  return status === 1 ? t('esd.inspect.qualified') : t('esd.inspect.unqualified');
};

const submittedTagType = (item: any) => {
  const status = calcStatus(item);
  if (status === 2) return 'danger';
  return status === 1 ? 'success' : 'info';
};

const fetchDetail = async () => {
  if (!inspectTask.value.TaskId) return;
  detailLoading.value = true;
  try {
    const res: any = await QueryExecutionDetail({
      TaskId: Number(inspectTask.value.TaskId),
      TaskCode: inspectTask.value.TaskCode,
    });
    if (res.Success) {
      const data = res.Data || {};
      templateDetails.value = decorateTemplates(data.TemplateDetails || []);
      submittedDetails.value = Array.isArray(data.SubmittedDetails) ? data.SubmittedDetails : [];
      inspectTask.value = {
        ...inspectTask.value,
        TaskId: data.TaskId ?? inspectTask.value.TaskId,
        TaskCode: data.TaskCode || inspectTask.value.TaskCode,
        EsdType: data.EsdType || inspectTask.value.EsdType,
        FormName: data.FormName || inspectTask.value.FormName,
        FormCode: data.FormCode || inspectTask.value.FormCode,
        ProductionBatch: data.ProductionBatch || inspectTask.value.ProductionBatch,
      };
      // 保持当前分组，分组不存在时回到第一组
      const exists = groupedTemplates.value.some((g) => g.key === currentGroupKey.value);
      if (!exists) currentGroupKey.value = groupedTemplates.value[0]?.key || '';
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

// 确认检测值并本地判定（提交时统一保存）
const confirmValue = (row: any) => {
  if (row._status !== 0) return;
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
  row._status = val >= lower && val <= upper ? 1 : 2;
  row._actualValue = inputStr;
  row._inputValue = '';
  if (row._status === 2) {
    ElMessage.warning(t('esd.inspect.ngTip'));
  }
};

// 追加明细（默认追加一组）
const handleAppend = async () => {
  if (appendSubmitting.value) return;
  appendSubmitting.value = true;
  try {
    const res: any = await AddExecutionDetail({
      taskCode: inspectTask.value.TaskCode,
      addCount: 1,
    });
    if (res.Success) {
      ElMessage.success(res.Message || t('esd.inspect.appendSuccess'));
      detailTab.value = 'pending';
      await fetchDetail();
    } else {
      ElMessage.error(res.Message || t('esd.inspect.appendFailure'));
    }
  } catch (error) {
    console.error('追加明细失败:', error);
    ElMessage.error(t('esd.inspect.appendFailure'));
  } finally {
    appendSubmitting.value = false;
  }
};

// 提交当前一组点检明细（仅暂存，任务仍为执行中）
const submitGroup = () => {
  if (!form.Workshop || !form.LineName) {
    ElMessage.warning(t('esd.inspect.workshopRequired'));
    return;
  }
  const items = currentGroupItems.value;
  if (!items.length) {
    ElMessage.warning(t('esd.inspect.noPendingDetails'));
    return;
  }
  const invalidNg = items.some(
    (item: any) =>
      item._status === 2 && (!item.AbnormalPhenomenon || !item.ProblemLocation || !item.PreliminaryCause)
  );
  if (invalidNg) {
    ElMessage.warning(t('esd.inspect.submitValidate'));
    return;
  }

  const details = items.map((item: any) => ({
    ExecutionDetailId: item.ExecutionDetailId,
    CheckValue: String(item._actualValue ?? ''),
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
          Workshop: form.Workshop,
          LineName: form.LineName,
          WorkStation: form.WorkStation || '',
          DeviceName: form.DeviceName || '',
          DeviceCode: form.DeviceCode || '',
          Inspector: userStore.getUserInfo || 'system',
          ProductionBatch: inspectTask.value.ProductionBatch || '',
          Details: details,
        });
        if (res?.Success) {
          ElMessage.success(res.Message || t('esd.inspect.submitSuccess'));
          detailTab.value = 'pending';
          // 本次地点已随提交保存，重置后可选择其他地点继续提交
          resetLocationForm();
          await fetchDetail();
          fetchTasks();
        } else {
          ElMessage.error(res?.Message || res?.msg || t('esd.inspect.submitFailure'));
        }
      } catch (error: any) {
        console.error('提交点检失败:', error);
        ElMessage.error(error?.Message || error?.msg || error?.message || t('esd.inspect.submitFailure'));
      } finally {
        submitting.value = false;
      }
    })
    .catch(() => {});
};

// 是否有已填写但未提交的明细
const hasUnsubmitted = () =>
  templateDetails.value.some(
    (item: any) => item._status !== 0 || String(item._inputValue || '').trim() !== ''
  );

// 完成任务（只有该接口才会把任务置为已完成）
const completeTask = async () => {
  if (completing.value) return;
  if (!submittedDetails.value.length) {
    ElMessage.warning(t('esd.inspect.noSubmittedCannotComplete'));
    return;
  }
  if (hasUnsubmitted()) {
    ElMessage.warning(t('esd.inspect.hasUnsubmittedCannotComplete'));
    return;
  }
  try {
    await ElMessageBox.confirm(t('esd.inspect.confirmComplete'), t('publicText.tip'), {
      confirmButtonText: t('publicText.confirm'),
      cancelButtonText: t('publicText.cancel'),
      type: 'warning',
    });
  } catch {
    return;
  }
  completing.value = true;
  try {
    const res: any = await CompleteExecutionTask({
      TaskId: Number(inspectTask.value.TaskId),
      TaskCode: inspectTask.value.TaskCode,
      Inspector: userStore.getUserInfo || 'system',
    });
    if (res.Success) {
      ElMessage.success(res.Message || t('esd.inspect.completeSuccess'));
      drawerVisible.value = false;
      fetchTasks();
    } else {
      ElMessage.error(res.Message || t('esd.inspect.completeFailure'));
    }
  } catch (error: any) {
    console.error('完成任务失败:', error);
    ElMessage.error(error?.Message || error?.message || t('esd.inspect.completeFailure'));
  } finally {
    completing.value = false;
  }
};

const handleDrawerClosed = () => {
  templateDetails.value = [];
  submittedDetails.value = [];
  currentGroupKey.value = '';
  resetLocationForm();
};

// ==================== 高度与列宽自适应 ====================
const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 210;
  });
};

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
  white-space: nowrap;
}

.inspect-body {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.task-desc {
  flex-shrink: 0;
}

.detail-tabs {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.detail-tabs :deep(.el-tabs__header) {
  flex-shrink: 0;
  margin-bottom: 8px;
}

.detail-tabs :deep(.el-tabs__content) {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.detail-tabs :deep(.el-tab-pane) {
  height: 100%;
}

.pane-body {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.pane-body>.location-card,
.pane-body>.group-switch {
  flex-shrink: 0;
}

.detail-table {
  flex: 1;
  min-height: 0;
}

.location-card {
  background: #fafbfc;
}

.card-title {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  font-size: 13px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 10px;
}

.card-tip {
  font-size: 12px;
  font-weight: 400;
  color: #909399;
}

.field-label {
  font-size: 12px;
  color: #606266;
  margin-bottom: 4px;
}

.required {
  color: #f56c6c;
  margin-left: 2px;
}

.device-tip {
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
}

.group-switch {
  display: flex;
  align-items: center;
  gap: 10px;
}

.drawer-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
