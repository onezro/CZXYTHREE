<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <!-- 查询表单 -->
            <el-form ref="queryFormRef" :inline="true" :model="queryParams" label-width="auto" @submit.prevent>
                <el-form-item :label="t('esd.exception.taskCode')" class="mb-2">
                    <el-input v-model="queryParams.TaskCode" :placeholder="t('esd.exception.taskCodePlaceholder')"
                        clearable style="width: 150px" size="small" />
                </el-form-item>
                <el-form-item :label="t('esd.exception.esdType')" class="mb-2">
                    <el-input v-model="queryParams.EsdType" :placeholder="t('esd.exception.esdTypePlaceholder')"
                        clearable style="width: 150px" size="small" />
                </el-form-item>
                <el-form-item :label="t('esd.exception.esdTypeCode')" class="mb-2">
                    <el-input v-model="queryParams.EsdTypeCode" :placeholder="t('esd.exception.esdTypeCodePlaceholder')"
                        clearable style="width: 150px" size="small" />
                </el-form-item>
                <el-form-item :label="t('esd.exception.workshop')" class="mb-2">
                    <el-input v-model="queryParams.Workshop" :placeholder="t('esd.exception.workshopPlaceholder')"
                        clearable style="width: 150px" size="small" />
                </el-form-item>
                <el-form-item :label="t('esd.exception.lineName')" class="mb-2">
                    <el-input v-model="queryParams.LineName" :placeholder="t('esd.exception.lineNamePlaceholder')"
                        clearable style="width: 150px" size="small" />
                </el-form-item>
                <el-form-item :label="t('esd.exception.workStation')" class="mb-2">
                    <el-input v-model="queryParams.WorkStation" :placeholder="t('esd.exception.workStationPlaceholder')"
                        clearable style="width: 150px" size="small" />
                </el-form-item>
                <el-form-item :label="t('esd.exception.deviceCode')" class="mb-2">
                    <el-input v-model="queryParams.DeviceCode" :placeholder="t('esd.exception.deviceCodePlaceholder')"
                        clearable style="width: 150px" size="small" />
                </el-form-item>
                <el-form-item :label="t('esd.exception.responsibleUser')" class="mb-2">
                    <el-input v-model="queryParams.ResponsibleUser"
                        :placeholder="t('esd.exception.responsibleUserPlaceholder')" clearable style="width: 150px"
                        size="small" />
                </el-form-item>
                <el-form-item :label="t('esd.exception.productionBatch')" class="mb-2">
                    <el-input v-model="queryParams.ProductionBatch"
                        :placeholder="t('esd.exception.productionBatchPlaceholder')" clearable style="width: 150px"
                        size="small" />
                </el-form-item>
                <el-form-item :label="t('esd.exception.rectifyStatus')" class="mb-2">
                    <el-select v-model="queryParams.RectifyStatus"
                        :placeholder="t('esd.exception.rectifyStatusPlaceholder')" clearable style="width: 150px"
                        size="small">
                        <el-option :label="t('esd.exception.statusPending')" :value="0" />
                        <el-option :label="t('esd.exception.statusRectified')" :value="1" />
                        <el-option :label="t('esd.exception.statusRechecked')" :value="2" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="t('esd.exception.inspectTime')" class="mb-2">
                    <el-date-picker v-model="inspectTimeRange" type="datetimerange"
                        :start-placeholder="t('esd.exception.startTime')" :end-placeholder="t('esd.exception.endTime')"
                        format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" size="small"
                        style="width: 240px" @change="handleTimeRangeChange" />
                </el-form-item>
                <el-form-item class="mb-2">
                    <el-button type="primary" @click="handleSearch" size="small">{{ t("publicText.query") }}</el-button>
                    <el-button @click="resetSearch" size="small">{{ t("publicText.reset") }}</el-button>
                </el-form-item>
            </el-form>

            <!-- 表格 -->
            <el-table :data="tableData" ref="tableRef" border :height="tableHeight" style="width: 100%" stripe
                size="small" highlight-current-row tooltip-effect="light">
                <el-table-column type="index" :label="t('publicText.index')" width="55" fixed="left" align="center">
                    <template #default="{ $index }">
                        {{ $index + 1 + (queryParams.PageIndex - 1) * queryParams.PageSize }}
                    </template>
                </el-table-column>
                <el-table-column prop="TaskCode" :label="t('esd.exception.taskCode')" :min-width="getColumnWidth('TaskCode')" />
                <el-table-column prop="EsdType" :label="t('esd.exception.esdType')" :min-width="getColumnWidth('EsdType')" />
                <el-table-column prop="EsdTypeCode" :label="t('esd.exception.esdTypeCode')" :min-width="getColumnWidth('EsdTypeCode')" />
                <el-table-column prop="Workshop" :label="t('esd.exception.workshop')" :min-width="getColumnWidth('Workshop')" />
                <el-table-column prop="LineName" :label="t('esd.exception.lineName')" :min-width="getColumnWidth('LineName')" />
                <el-table-column prop="WorkStation" :label="t('esd.exception.workStation')" :min-width="getColumnWidth('WorkStation')" />
                <el-table-column prop="DeviceName" :label="t('esd.exception.deviceName')" :min-width="getColumnWidth('DeviceName')" />
                <el-table-column prop="DeviceCode" :label="t('esd.exception.deviceCode')" :min-width="getColumnWidth('DeviceCode')" />
                <el-table-column prop="ResponsibleUser" :label="t('esd.exception.responsibleUser')" :min-width="getColumnWidth('ResponsibleUser')" />
                <el-table-column prop="ProductionBatch" :label="t('esd.exception.productionBatch')" :min-width="getColumnWidth('ProductionBatch')" />
                <el-table-column prop="CheckContent" :label="t('esd.exception.checkContent')" :min-width="getColumnWidth('CheckContent')" />
                <el-table-column prop="CheckValue" :label="t('esd.exception.checkValue')" :min-width="getColumnWidth('CheckValue')" />
                <el-table-column prop="CheckResult" :label="t('esd.exception.checkResult')" :min-width="getColumnWidth('CheckResult')" />
                <el-table-column prop="Inspector" :label="t('esd.exception.inspector')" :min-width="getColumnWidth('Inspector')" />
                <el-table-column prop="InspectTime" :label="t('esd.exception.inspectTime')" :min-width="getColumnWidth('InspectTime')" />
                <el-table-column prop="AbnormalPhenomenon" :label="t('esd.exception.abnormalPhenomenon')"
                    min-width="150" />
                <el-table-column prop="ProblemLocation" :label="t('esd.exception.problemLocation')" :min-width="getColumnWidth('ProblemLocation')" />
                <el-table-column prop="PreliminaryCause" :label="t('esd.exception.preliminaryCause')" :min-width="getColumnWidth('PreliminaryCause')" />
                <el-table-column prop="RectifyStatus" :label="t('esd.exception.rectifyStatus')" :min-width="getColumnWidth('RectifyStatus')">
                    <template #default="{ row }">
                        <el-tag :type="statusTagType(row.RectifyStatus)" size="small">
                            {{ statusLabel(row.RectifyStatus) }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column :label="t('publicText.operation')" fixed="right" width="160" align="center">
                    <template #default="{ row }">
                        <el-button size="small" type="warning" @click="openRectify(row)"
                            :disabled="row.RectifyStatus !== 0">
                            {{ t('esd.exception.rectify') }}
                        </el-button>
                        <el-button size="small" type="success" @click="openRecheck(row)"
                            :disabled="row.RectifyStatus === 0">
                            {{ t('esd.exception.recheck') }}
                        </el-button>
                    </template>
                </el-table-column>
                <template #empty>
                    <div class="flex items-center justify-center h-100%">
                        <el-empty />
                    </div>
                </template>
            </el-table>

            <!-- 分页 -->
            <div style="margin-top: 8px">
                <el-pagination align="center" background size="small" @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :current-page="queryParams.PageIndex"
                    :page-size="queryParams.PageSize" :page-sizes="[10, 20, 50, 100, 200]"
                    layout="total,sizes, prev, pager, next" :total="total" />
            </div>
        </el-card>

        <!-- ========== 整改对话框 ========== -->
        <el-dialog :title="t('esd.exception.rectifyTitle')" v-model="rectifyDialogVisible" width="500px" align-center
            :close-on-click-modal="false" @closed="handleRectifyDialogClosed">
            <el-form ref="rectifyFormRef" :model="rectifyForm" :rules="rectifyRules" label-width="120px" size="small">
                <el-form-item :label="t('esd.exception.responsibleDept')" prop="ResponsibleDept">
                    <el-input v-model="rectifyForm.ResponsibleDept"
                        :placeholder="t('esd.exception.responsibleDeptPlaceholder')" />
                </el-form-item>
                <el-form-item :label="t('esd.exception.rectifyUser')" prop="RectifyUser">
                    <el-input v-model="rectifyForm.RectifyUser"
                        :placeholder="t('esd.exception.rectifyUserPlaceholder')" />
                </el-form-item>
                <el-form-item :label="t('esd.exception.rectifyContent')" prop="RectifyContent">
                    <el-input v-model="rectifyForm.RectifyContent" type="textarea" :rows="3"
                        :placeholder="t('esd.exception.rectifyContentPlaceholder')" />
                </el-form-item>
                <el-form-item :label="t('esd.exception.lockProduction')" prop="LockProduction">
                    <el-switch v-model="rectifyForm.LockProduction" :active-value="1" :inactive-value="0"
                        active-text="是" inactive-text="否" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="rectifyDialogVisible = false">{{ t("publicText.cancel") }}</el-button>
                <el-button type="primary" @click="submitRectify" :loading="rectifyLoading">{{ t("publicText.confirm")
                    }}</el-button>
            </template>
        </el-dialog>

        <!-- ========== 复检对话框 ========== -->
        <el-dialog :title="t('esd.exception.recheckTitle')" v-model="recheckDialogVisible" width="500px" align-center
            :close-on-click-modal="false" @closed="handleRecheckDialogClosed">
            <el-form ref="recheckFormRef" :model="recheckForm" :rules="recheckRules" label-width="120px" size="small">
                <el-form-item :label="t('esd.exception.recheckUser')" prop="RecheckUser">
                    <el-input v-model="recheckForm.RecheckUser"
                        :placeholder="t('esd.exception.recheckUserPlaceholder')" />
                </el-form-item>
                <el-form-item :label="t('esd.exception.recheckResult')" prop="RecheckResult">
                    <el-input v-model="recheckForm.RecheckResult" type="textarea" :rows="3"
                        :placeholder="t('esd.exception.recheckResultPlaceholder')" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="recheckDialogVisible = false">{{ t("publicText.cancel") }}</el-button>
                <el-button type="primary" @click="submitRecheck" :loading="recheckLoading">{{ t("publicText.confirm")
                    }}</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount, onMounted, onBeforeUnmount, nextTick, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { useUserStoreWithOut } from '@/stores/modules/user';
import { calculateColumnsWidth } from "@/utils/tableminWidth";
import {
    QueryExceptionRecordList,
    RectifyExceptionRecord,
    RecheckExceptionRecord
} from '@/api/esdManage/ESDRecord'; // 假设接口已封装
import dayjs from 'dayjs';

const { t } = useI18n();
const userStore = useUserStoreWithOut();

// ========== 查询参数 ==========
const queryParams = reactive({
    PageIndex: 1,
    PageSize: 20,
    TaskCode: '',
    EsdType: '',
    EsdTypeCode: '',
    Workshop: '',
    LineName: '',
    WorkStation: '',
    DeviceCode: '',
    ResponsibleUser: '',
    ProductionBatch: '',
    RectifyStatus: undefined as number | undefined,
    StartInspectTime: '',
    EndInspectTime: '',
});

const inspectTimeRange = ref<[string, string] | null>(null);

// ========== 表格数据 ==========
const tableData = ref<any[]>([]);
const total = ref(0);
const tableHeight = ref(0);
const tableRef = ref();

// ========== 整改相关 ==========
const rectifyDialogVisible = ref(false);
const rectifyFormRef = ref();
const rectifyForm = reactive({
    ExceptionId: 0,
    ResponsibleDept: '',
    RectifyUser: '',
    RectifyContent: '',
    LockProduction: 0,
});
const rectifyRules = {
    ResponsibleDept: [{ required: true, message: t('message.pleaseInput') + t('esd.exception.responsibleDept'), trigger: 'blur' }],
    RectifyUser: [{ required: true, message: t('message.pleaseInput') + t('esd.exception.rectifyUser'), trigger: 'blur' }],
    RectifyContent: [{ required: true, message: t('message.pleaseInput') + t('esd.exception.rectifyContent'), trigger: 'blur' }],
};
const rectifyLoading = ref(false);

// ========== 复检相关 ==========
const recheckDialogVisible = ref(false);
const recheckFormRef = ref();
const recheckForm = reactive({
    ExceptionId: 0,
    RecheckUser: '',
    RecheckResult: '',
});
const recheckRules = {
    RecheckUser: [{ required: true, message: t('message.pleaseInput') + t('esd.exception.recheckUser'), trigger: 'blur' }],
    RecheckResult: [{ required: true, message: t('message.pleaseInput') + t('esd.exception.recheckResult'), trigger: 'blur' }],
};
const recheckLoading = ref(false);

// ========== 状态辅助函数 ==========
const statusLabel = (status: number) => {
    const map: Record<number, string> = {
        0: t('esd.exception.statusPending'),
        1: t('esd.exception.statusRectified'),
        2: t('esd.exception.statusRechecked'),
    };
    return map[status] || status;
};

const statusTagType = (status: number) => {
    const map: Record<number, string> = {
        0: 'danger',
        1: 'warning',
        2: 'success',
    };
    return map[status] || 'info';
};

// ========== 获取数据 ==========
const getData = async () => {
    try {
        const res: any = await QueryExceptionRecordList(queryParams);
        if (res.Success) {
            tableData.value = (res.Data.rows || []).map((item: any) => ({
                ...item,
                InspectTime: item.InspectTime ? dayjs(item.InspectTime).format('YYYY-MM-DD HH:mm:ss') : '',
            }));
            total.value = res.Data.total || 0;
        } else {
            ElMessage.error(res.Message || t('message.queryFailure'));
        }
    } catch (error) {
        console.error('查询异常记录失败:', error);
        tableData.value = [];
        total.value = 0;
    }
};

// ========== 查询与重置 ==========
const handleSearch = () => {
    queryParams.PageIndex = 1;
    getData();
};

const resetSearch = () => {
    queryParams.TaskCode = '';
    queryParams.EsdType = '';
    queryParams.EsdTypeCode = '';
    queryParams.Workshop = '';
    queryParams.LineName = '';
    queryParams.WorkStation = '';
    queryParams.DeviceCode = '';
    queryParams.ResponsibleUser = '';
    queryParams.ProductionBatch = '';
    queryParams.RectifyStatus = undefined;
    queryParams.StartInspectTime = '';
    queryParams.EndInspectTime = '';
    inspectTimeRange.value = null;
    queryParams.PageIndex = 1;
    getData();
};

const handleTimeRangeChange = (val: [string, string] | null) => {
    if (val) {
        queryParams.StartInspectTime = val[0];
        queryParams.EndInspectTime = val[1];
    } else {
        queryParams.StartInspectTime = '';
        queryParams.EndInspectTime = '';
    }
};

// ========== 分页 ==========
const handleSizeChange = (val: number) => {
    queryParams.PageSize = val;
    queryParams.PageIndex = 1;
    getData();
};

const handleCurrentChange = (val: number) => {
    queryParams.PageIndex = val;
    getData();
};

// ========== 整改 ==========
const openRectify = (row: any) => {
    rectifyForm.ExceptionId = row.ExceptionId;
    rectifyForm.ResponsibleDept = '';
    rectifyForm.RectifyUser = '';
    rectifyForm.RectifyContent = '';
    rectifyForm.LockProduction = 0;
    rectifyDialogVisible.value = true;
};

const submitRectify = async () => {
    await rectifyFormRef.value.validate();
    rectifyLoading.value = true;
    try {
        const currentUser = userStore.getUserInfo || 'system';
        const params = {
            ...rectifyForm,
            UserName: currentUser,
        };
        const res: any = await RectifyExceptionRecord(params);
        if (res.Success) {
            ElMessage.success(t('message.rectifySuccess'));
            rectifyDialogVisible.value = false;
            getData();
        } else {
            ElMessage.error(res.Message || t('message.rectifyFailure'));
        }
    } catch (error) {
        console.error('整改失败:', error);
        ElMessage.error(t('message.rectifyFailure'));
    } finally {
        rectifyLoading.value = false;
    }
};

const handleRectifyDialogClosed = () => {
    rectifyFormRef.value?.resetFields();
};

// ========== 复检 ==========
const openRecheck = (row: any) => {
    recheckForm.ExceptionId = row.ExceptionId;
    recheckForm.RecheckUser = '';
    recheckForm.RecheckResult = '';
    recheckDialogVisible.value = true;
};

const submitRecheck = async () => {
    await recheckFormRef.value.validate();
    recheckLoading.value = true;
    try {
        const currentUser = userStore.getUserInfo || 'system';
        const params = {
            ...recheckForm,
            UserName: currentUser,
        };
        const res: any = await RecheckExceptionRecord(params);
        if (res.Success) {
            ElMessage.success(t('message.recheckSuccess'));
            recheckDialogVisible.value = false;
            getData();
        } else {
            ElMessage.error(res.Message || t('message.recheckFailure'));
        }
    } catch (error) {
        console.error('复检失败:', error);
        ElMessage.error(t('message.recheckFailure'));
    } finally {
        recheckLoading.value = false;
    }
};

const handleRecheckDialogClosed = () => {
    recheckFormRef.value?.resetFields();
};

// 表格列宽自动计算
const tableColumns = computed(() => {
    if (!tableRef.value) return [];
    const columns = tableRef.value.columns
        .map((item: any) => ({ prop: item.property, label: item.label }))
        .filter(
            (item: any) =>
                item.label !== t("publicText.index") &&
                item.label !== t("publicText.operation"),
        );
    return columns;
});

const columnWidths = computed(() => {
    return calculateColumnsWidth(tableColumns.value, tableData.value, {
        padding: 25,
        fontSize: 13,
    });
});

const getColumnWidth = (prop: string) => columnWidths.value[prop] || "auto";

// ========== 表格高度自适应 ==========
const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 270;
    });
};

// ========== 生命周期 ==========
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