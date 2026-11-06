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
                    <el-input v-model="searchForm.LineName" clearable
                        :placeholder="t('smtapply.changeOverHistory.lineNamePlaceholder')" style="width: 180px"
                        @keyup.enter="handleSearch" />
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
                            :type="Number(row.ExecuteStatus) === 1 ? 'success' : 'danger'" size="small">
                            {{ Number(row.ExecuteStatus) === 1 ? t('smtapply.changeOverHistory.success') :
                                t('smtapply.changeOverHistory.failure') }}
                        </el-tag>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column prop="ErrorMessage" :label="t('smtapply.changeOverHistory.errorMessage')"
                    :min-width="getColumnWidth('ErrorMessage')" show-overflow-tooltip>
                    <template #default="{ row }">{{ row.ErrorMessage || '-' }}</template>
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
import { GetChangeOverHistory } from '@/api/smtApply/changeover';

const { t } = useI18n();

const tableRef = ref();
const loading = ref(false);
const tableData = ref<any[]>([]);
const total = ref(0);
const queryTime = ref<string[]>([]);

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
    if (!val) return '-';
    const d = dayjs(val);
    return d.isValid() ? d.format('YYYY-MM-DD HH:mm:ss') : String(val);
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
    handleReset();
});
</script>
