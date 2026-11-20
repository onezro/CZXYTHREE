<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <el-form :model="searchForm" label-width="auto" :inline="true" size="small"
                @submit.prevent>
                <el-form-item :label="t('smtapply.changeOverHistory.timeRange')" class="mb-1">
                    <el-date-picker v-model="queryTime" type="datetimerange" range-separator="-"
                        start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD HH:mm:ss"
                        style="width: 340px;" :shortcuts="shortcuts1" :default-time="defaultTimeRange"
                        :clearable="false" :disabled-date="disabledDate" />
                </el-form-item>
                <el-form-item :label="t('smtapply.changeOverHistory.lineName')" class="mb-1">
                    <el-select v-model="searchForm.LineName" clearable filterable
                        :placeholder="t('smtapply.changeOverHistory.lineNamePlaceholder')" style="width: 180px">
                        <el-option v-for="item in lineList" :key="item.line" :label="item.line" :value="item.line" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="t('smtapply.changeOverHistory.orderName')" class="mb-1">
                    <el-input v-model="searchForm.OrderName" clearable
                        :placeholder="t('smtapply.changeOverHistory.orderNamePlaceholder')" style="width: 180px"
                        @keyup.enter="handleSearch" />
                </el-form-item>
                <el-form-item :label="t('smtapply.changeOverHistory.side')" class="mb-1">
                    <el-select v-model="searchForm.Side" clearable
                        :placeholder="t('smtapply.changeOverHistory.sidePlaceholder')" style="width: 140px">
                        <el-option label="TOP" value="TOP" />
                        <el-option label="BOT" value="BOT" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="t('smtapply.changeOverHistory.changeUser')" class="mb-1">
                    <el-input v-model="searchForm.ChangeUser" clearable
                        :placeholder="t('smtapply.changeOverHistory.changeUserPlaceholder')" style="width: 160px"
                        @keyup.enter="handleSearch" />
                </el-form-item>
                <el-form-item :label="t('smtapply.changeOverHistory.machineId')" class="mb-1">
                    <el-input-number v-model="searchForm.MachineID" :controls="false" :min="0"
                        :placeholder="t('smtapply.changeOverHistory.machineIdPlaceholder')" style="width: 160px"
                        @keyup.enter="handleSearch" />
                </el-form-item>
                <el-form-item class="mb-1">
                    <el-button type="primary" @click="handleSearch">{{ t("publicText.query") }}</el-button>
                    <el-button @click="handleReset">{{ t("publicText.reset") }}</el-button>
                </el-form-item>
            </el-form>

            <el-table v-loading="loading" :data="tableData" ref="tableRef" border size="small"
                :height="tableHeight" style="width: 100%" highlight-current-row tooltip-effect="dark"
                :header-cell-style="{ backgroundColor: '#006487', color: '#fff' }">
                <el-table-column type="index" :label="t('publicText.index')" width="55" align="center" fixed>
                    <template #default="{ $index }">
                        <span>{{ $index + pageObj.pageSize * (pageObj.currentPage - 1) + 1 }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="MachineID" :label="t('smtapply.changeOverHistory.machineId')" width="110"
                    align="center" />
                <el-table-column prop="MachineName" :label="t('smtapply.changeOverHistory.machineName')"
                    :min-width="getColumnWidth('MachineName')" show-overflow-tooltip />
                <el-table-column prop="ProductName" :label="t('smtapply.changeOverHistory.productName')"
                    :min-width="getColumnWidth('ProductName')" show-overflow-tooltip />
                <el-table-column prop="OrderName" :label="t('smtapply.changeOverHistory.orderName')"
                    :min-width="getColumnWidth('OrderName')" show-overflow-tooltip />
                <el-table-column prop="LineName" :label="t('smtapply.changeOverHistory.lineName')"
                    :min-width="getColumnWidth('LineName')" show-overflow-tooltip />
                <el-table-column prop="Side" :label="t('smtapply.changeOverHistory.side')" width="90"
                    align="center" />
                <el-table-column prop="ChangeUser" :label="t('smtapply.changeOverHistory.changeUser')"
                    :min-width="getColumnWidth('ChangeUser')" show-overflow-tooltip />
                <el-table-column prop="InsertTime" :label="t('smtapply.changeOverHistory.insertTime')" width="160"
                    align="center">
                    <template #default="{ row }">{{ formatTime(row.InsertTime) }}</template>
                </el-table-column>
                <el-table-column prop="ExecuteStatus" :label="t('smtapply.changeOverHistory.executeStatus')"
                    width="110" align="center">
                    <template #default="{ row }">
                        <el-tag v-if="row.ExecuteStatus !== null && row.ExecuteStatus !== undefined && row.ExecuteStatus !== ''"
                            :type="Number(row.ExecuteStatus) == 1 ? 'success' : 'danger'" size="small">
                            {{ Number(row.ExecuteStatus) === 1 ? t('smtapply.changeOverHistory.success') :
                                t('smtapply.changeOverHistory.failure') }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="ErrorMessage" :label="t('smtapply.changeOverHistory.errorMessage')"
                    :min-width="200" show-overflow-tooltip>
                    <template #default="{ row }">
                        <el-button v-if="row.ErrorMessage" type="primary" link class="error-link"
                            @click="viewErrorMessage(row)">
                            {{ row.ErrorMessage }}
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
                    @current-change="handleCurrentChange" :pager-count="5" :current-page="pageObj.currentPage"
                    :page-size="pageObj.pageSize" :page-sizes="[10, 20, 30, 50, 100]"
                    layout="total, sizes, prev, pager, next" :total="total" />
            </div>
        </el-card>

        <el-dialog v-model="errorDialogVisible" :title="t('smtapply.changeOverHistory.errorDetail')" width="700px"
            top="8vh" :close-on-click-modal="false" align-center>
            <div class="dialog-info-bar">
                <div class="info-item">
                    <span class="info-label">{{ t("smtapply.changeOverHistory.lineName") }}:</span>
                    <el-tag type="primary" effect="plain">{{ currentErrorRow.LineName || "-" }}</el-tag>
                </div>
                <div class="info-item">
                    <span class="info-label">{{ t("smtapply.changeOverHistory.orderName") }}:</span>
                    <el-tag type="primary" effect="plain">{{ currentErrorRow.OrderName || "-" }}</el-tag>
                </div>
                <div class="info-item">
                    <span class="info-label">{{ t("smtapply.changeOverHistory.machineId") }}:</span>
                    <el-tag type="primary" effect="plain">{{ currentErrorRow.MachineID ?? "-" }}</el-tag>
                </div>
                <div class="info-item">
                    <span class="info-label">{{ t("smtapply.changeOverHistory.changeUser") }}:</span>
                    <el-tag type="primary" effect="plain">{{ currentErrorRow.ChangeUser || "-" }}</el-tag>
                </div>
                <div class="info-item">
                    <span class="info-label">{{ t("smtapply.changeOverHistory.insertTime") }}:</span>
                    <el-tag type="primary" effect="plain">{{ formatTime(currentErrorRow.InsertTime) }}</el-tag>
                </div>
                <div class="info-item">
                    <span class="info-label">{{ t("smtapply.changeOverHistory.executeStatus") }}:</span>
                    <el-tag effect="plain" size="small"
                        :type="Number(currentErrorRow.ExecuteStatus) === 1 ? 'success' : 'danger'">
                        {{ Number(currentErrorRow.ExecuteStatus) === 1 ?
                            t("smtapply.changeOverHistory.success") : t("smtapply.changeOverHistory.failure") }}
                    </el-tag>
                </div>
            </div>
            <div class="error-container">
                <div class="error-header">
                    <span>{{ t("smtapply.changeOverHistory.errorMessage") }}</span>
                    <el-button type="success" size="small" @click="copyErrorMessage">{{
                        t("publicText.copy")
                        }}</el-button>
                </div>
                <pre class="error-pre">{{ currentErrorRow.ErrorMessage }}</pre>
            </div>
            <template #footer>
                <el-button @click="errorDialogVisible = false">{{ t("publicText.close") }}</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';
import { shortcuts1, disabledDate } from '@/utils/dataMenu';
import { useTableColumnWidth } from '@/hooks/useTableColumnWidth';
import { useTableHeight } from '@/hooks/useTableHeight';
import { GetChangeOverHistory, GetAllValorLine } from '@/api/smtApply/changeover';

const { t } = useI18n();

const tableRef = ref();
const loading = ref(false);
const tableData = ref<any[]>([]);
const total = ref(0);
const queryTime = ref<string[]>([]);
const lineList = ref<any[]>([]);

const defaultTimeRange = [
    new Date(2000, 0, 1, 0, 0, 0),
    new Date(2000, 0, 1, 23, 59, 59),
];

const searchForm = reactive({
    LineName: '',
    OrderName: '',
    Side: '',
    ChangeUser: '',
    MachineID: null as number | null,
});

const pageObj = reactive({
    currentPage: 1,
    pageSize: 20,
});

const { tableHeight } = useTableHeight(tableRef);
const { getColumnWidth } = useTableColumnWidth(tableRef, tableData, {
    excludeLabels: [t('publicText.index')],
});

const formatTime = (val: any) => {
    if (!val) return '';
    const d = dayjs(val);
    return d.isValid() ? d.format('YYYY-MM-DD HH:mm:ss') : String(val);
};

const errorDialogVisible = ref(false);
const currentErrorRow = reactive<any>({
    LineName: '',
    OrderName: '',
    MachineID: null,
    ChangeUser: '',
    InsertTime: '',
    ExecuteStatus: null,
    ErrorMessage: '',
});

const viewErrorMessage = (row: any) => {
    Object.assign(currentErrorRow, {
        LineName: row.LineName,
        OrderName: row.OrderName,
        MachineID: row.MachineID,
        ChangeUser: row.ChangeUser,
        InsertTime: row.InsertTime,
        ExecuteStatus: row.ExecuteStatus,
        ErrorMessage: row.ErrorMessage || '',
    });
    errorDialogVisible.value = true;
};

const copyErrorMessage = () => {
    const text = currentErrorRow.ErrorMessage || '';
    if (!text) {
        ElMessage.warning(t('publicText.empty'));
        return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
            .then(() => ElMessage.success(t('publicText.copySuccess')))
            .catch(() => fallbackCopy(text));
    } else {
        fallbackCopy(text);
    }
};

const fallbackCopy = (text: string) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy')
            ? ElMessage.success(t('publicText.copySuccess'))
            : ElMessage.error(t('publicText.copyFailure'));
    } catch {
        ElMessage.error(t('publicText.copyFailure'));
    } finally {
        document.body.removeChild(textarea);
    }
};

const getLineList = () => {
    GetAllValorLine({}).then((res: any) => {
        lineList.value = res && Array.isArray(res.Data) ? res.Data : [];
    }).catch(() => {
        lineList.value = [];
    });
};

const getData = () => {
    const [startTime, endTime] = queryTime.value || [];
    if (!startTime || !endTime) {
        ElMessage.warning(t('smtapply.changeOverHistory.timeRangeRequired'));
        return;
    }

    loading.value = true;
    const params: any = {
        StartTime: startTime,
        EndTime: endTime,
        PageIndex: pageObj.currentPage,
        PageSize: pageObj.pageSize,
    };
    if (searchForm.LineName.trim()) params.LineName = searchForm.LineName.trim();
    if (searchForm.OrderName.trim()) params.OrderName = searchForm.OrderName.trim();
    if (searchForm.Side) params.Side = searchForm.Side;
    if (searchForm.ChangeUser.trim()) params.ChangeUser = searchForm.ChangeUser.trim();
    if (searchForm.MachineID !== null && searchForm.MachineID !== undefined) params.MachineID = searchForm.MachineID;

    GetChangeOverHistory(params)
        .then((res: any) => {
            if (res && res.Data && Array.isArray(res.Data.rows)) {
                tableData.value = res.Data.rows;
                total.value = res.Data.total || 0;
            } else {
                tableData.value = [];
                total.value = 0;
                ElMessage.warning((res && (res.Message || res.msg)) || t('message.queryFailure'));
            }
        })
        .catch(() => {
            tableData.value = [];
            total.value = 0;
        })
        .finally(() => {
            loading.value = false;
        });
};

const handleSearch = () => {
    pageObj.currentPage = 1;
    getData();
};

const handleReset = () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    queryTime.value = [
        dayjs(start).format('YYYY-MM-DD HH:mm:ss'),
        dayjs(end).format('YYYY-MM-DD HH:mm:ss'),
    ];
    searchForm.LineName = '';
    searchForm.OrderName = '';
    searchForm.Side = '';
    searchForm.ChangeUser = '';
    searchForm.MachineID = null;
    pageObj.currentPage = 1;
    getData();
};

const handleSizeChange = (val: number) => {
    pageObj.pageSize = val;
    pageObj.currentPage = 1;
    getData();
};

const handleCurrentChange = (val: number) => {
    pageObj.currentPage = val;
    getData();
};

onMounted(() => {
    getLineList();
    handleReset();
});
</script>

<style lang="scss" scoped>
.error-link {
    max-width: 100%;
    justify-content: flex-start;
}

.error-link :deep(span) {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.dialog-info-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    padding: 12px 16px;
    background-color: #f5f7fa;
    border-radius: 4px;
    margin-bottom: 16px;
    border: 1px solid #ebeef5;
}

.info-item {
    display: flex;
    align-items: center;
    gap: 6px;
}

.info-label {
    font-size: 13px;
    color: #606266;
    font-weight: 500;
}

.error-container {
    display: flex;
    flex-direction: column;
    max-height: 400px;
}

.error-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background-color: #f0f2f5;
    border-radius: 4px 4px 0 0;
    font-weight: bold;
    font-size: 14px;
}

.error-pre {
    font-family: "Consolas", "Monaco", "Courier New", monospace;
    font-size: 12px;
    line-height: 1.6;
    color: #333;
    background-color: #f5f5f5;
    padding: 12px;
    border-radius: 0 0 4px 4px;
    white-space: pre-wrap;
    word-break: break-all;
    margin: 0;
    flex: 1;
    overflow: auto;
    border-top: 1px solid #e4e7ed;
}
</style>
