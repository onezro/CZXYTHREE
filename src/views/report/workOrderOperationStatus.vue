<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between">
                <el-form ref="searchFormRef" :model="searchForm" label-width="auto" :inline="true" :size="'small'"
                    @submit.prevent>
                    <el-form-item :label="t('report.workOrderOperationStatus.orderName')" prop="OrderName" class="mb-2"
                        required>
                        <el-input v-model="searchForm.OrderName" clearable @keyup.enter="handleSearch"
                            style="width: 220px"
                            :placeholder="t('report.workOrderOperationStatus.inputOrderName')" />
                    </el-form-item>
                    <el-form-item :label="t('report.workOrderOperationStatus.timeRange')" prop="TimeRange" class="mb-2">
                        <el-date-picker style="width: 350px;" v-model="queryTime" type="datetimerange"
                            range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                            value-format="YYYY-MM-DD HH:mm:ss" :shortcuts="shortcuts1" :default-time="[
                                new Date(2000, 1, 1, 0, 0, 0),
                                new Date(2000, 1, 1, 23, 59, 59),
                            ]" @change="handleDateRangeChange" />
                    </el-form-item>
                    <el-form-item :label="t('report.workOrderOperationStatus.operationName')" prop="OperationName"
                        class="mb-2">
                        <el-select v-model="searchForm.OperationName" clearable filterable allow-create
                            default-first-option style="width: 160px"
                            :placeholder="t('report.workOrderOperationStatus.selectOperationName')">
                            <el-option label="SMT-AOI" value="SMT-AOI" />
                            <el-option label="ICT" value="ICT" />
                            <el-option label="铣板" value="铣板" />
                            <el-option label="电检" value="电检" />
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="t('report.workOrderOperationStatus.side')" prop="Side" class="mb-2">
                        <el-select v-model="searchForm.Side" clearable style="width: 120px"
                            :placeholder="t('report.workOrderOperationStatus.selectSide')">
                            <el-option label="TOP" value="TOP" />
                            <el-option label="BOT" value="BOT" />
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="t('report.workOrderOperationStatus.status')" prop="Status" class="mb-2">
                        <el-select v-model="searchForm.Status" clearable filterable allow-create default-first-option
                            style="width: 140px"
                            :placeholder="t('report.workOrderOperationStatus.selectStatus')">
                            <el-option :label="t('report.workOrderOperationStatus.statusNotStarted')" value="未开始" />
                            <el-option :label="t('report.workOrderOperationStatus.statusInProgress')" value="进行中" />
                            <el-option :label="t('report.workOrderOperationStatus.statusCompleted')" value="已完成" />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="mb-2">
                        <el-button type="primary" @click="handleSearch">{{ t("publicText.query") }}</el-button>
                        <el-button @click="handleReset">{{ t("publicText.reset") }}</el-button>
                    </el-form-item>
                </el-form>
            </div>

            <el-table :data="tableData" size="small" ref="eltableRef" :style="{ width: '100%' }" :height="tableHeight"
                border fit highlight-current-row v-loading="loading"
                :header-cell-style="{ backgroundColor: '#006487', color: '#fff' }">
                <el-table-column type="index" align="center" fixed :label="t('publicText.index')" width="60">
                    <template #default="scope">
                        <span>{{ scope.$index + pageObj.pageSize * (pageObj.currentPage - 1) + 1 }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="OrderName" :label="t('report.workOrderOperationStatus.orderName')"
                    :min-width="getColumnWidth('OrderName')" show-overflow-tooltip />
                <el-table-column prop="OperationName" align="center"
                    :label="t('report.workOrderOperationStatus.operationName')"
                    :min-width="getColumnWidth('OperationName')" show-overflow-tooltip />
                <el-table-column prop="Side" align="center" :label="t('report.workOrderOperationStatus.side')"
                    :min-width="getColumnWidth('Side')" show-overflow-tooltip />
                <el-table-column prop="SmallBoardPlanQty" align="center"
                    :label="t('report.workOrderOperationStatus.smallBoardPlanQty')"
                    :min-width="getColumnWidth('SmallBoardPlanQty')" show-overflow-tooltip />
                <el-table-column prop="BigBoardPlanQty" align="center"
                    :label="t('report.workOrderOperationStatus.bigBoardPlanQty')"
                    :min-width="getColumnWidth('BigBoardPlanQty')" show-overflow-tooltip />
                <el-table-column prop="OkSmallBoardQty" align="center"
                    :label="t('report.workOrderOperationStatus.okSmallBoardQty')"
                    :min-width="getColumnWidth('OkSmallBoardQty')" show-overflow-tooltip />
                <el-table-column prop="OkBigBoardQty" align="center"
                    :label="t('report.workOrderOperationStatus.okBigBoardQty')"
                    :min-width="getColumnWidth('OkBigBoardQty')" show-overflow-tooltip />
                <el-table-column prop="Status" align="center" :label="t('report.workOrderOperationStatus.status')"
                    :min-width="getColumnWidth('Status')" show-overflow-tooltip>
                    <template #default="{ row }">
                        <el-tag v-if="row.Status" :type="getStatusTagType(row.Status)">{{ row.Status }}</el-tag>
                        <span v-else>--</span>
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
                    :page-size="pageObj.pageSize" :page-sizes="[10, 20, 50, 100, 200, 500]"
                    layout="total, sizes, prev, pager, next" :total="total" />
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { QueryWorkOrderOperationStatus } from "@/api/report/index";
import { shortcuts1 } from "@/utils/dataMenu";
import { ref, reactive, onMounted, watch } from "vue";
import { ElMessage } from "element-plus";
import { useTableColumnWidth } from "@/hooks/useTableColumnWidth";
import { useTableHeight } from "@/hooks/useTableHeight";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const loading = ref(false);
const eltableRef = ref();
const { tableHeight, calcTableHeight } = useTableHeight(eltableRef);
const tableData = ref<any[]>([]);
const total = ref(0);

const queryTime = ref<any[]>([]);

const searchForm = reactive({
    OrderName: "",
    OperationName: "",
    Side: "",
    Status: "",
    StartTime: "",
    EndTime: "",
});

const pageObj = reactive({
    currentPage: 1,
    pageSize: 50,
});

const { getColumnWidth } = useTableColumnWidth(eltableRef, tableData, {
    excludeLabels: [t("publicText.index")],
});

// 工序状态标签颜色：已完成绿色、进行中橙色、其余（未开始等）灰色
const getStatusTagType = (status: string) => {
    if (status.includes("完成")) return "success";
    if (status.includes("进行")) return "warning";
    return "info";
};

const handleDateRangeChange = (val: any[]) => {
    searchForm.StartTime = val?.[0] || "";
    searchForm.EndTime = val?.[1] || "";
};

const getData = () => {
    loading.value = true;
    const params = {
        OrderName: searchForm.OrderName.trim(),
        StartTime: searchForm.StartTime || null,
        EndTime: searchForm.EndTime || null,
        OperationName: searchForm.OperationName || "",
        Side: searchForm.Side || "",
        Status: searchForm.Status || "",
        PageIndex: pageObj.currentPage,
        PageSize: pageObj.pageSize,
    };
    QueryWorkOrderOperationStatus(params)
        .then((res: any) => {
            if (res.Success) {
                tableData.value = Array.isArray(res.Data?.rows) ? res.Data.rows : [];
                total.value = res.Data?.total || 0;
            } else {
                tableData.value = [];
                total.value = 0;
                ElMessage.warning(res.Message || t("message.queryFailure"));
            }
        })
        .catch(() => {
            tableData.value = [];
            total.value = 0;
        })
        .finally(() => {
            loading.value = false;
            calcTableHeight();
        });
};

const handleSearch = () => {
    if (!searchForm.OrderName.trim()) {
        ElMessage.warning(t("report.workOrderOperationStatus.orderRequired"));
        return;
    }
    pageObj.currentPage = 1;
    getData();
};

const handleReset = () => {
    queryTime.value = [];
    searchForm.OrderName = "";
    searchForm.OperationName = "";
    searchForm.Side = "";
    searchForm.Status = "";
    searchForm.StartTime = "";
    searchForm.EndTime = "";
    pageObj.currentPage = 1;
    pageObj.pageSize = 50;
    tableData.value = [];
    total.value = 0;
};

const handleSizeChange = (val: number) => {
    pageObj.pageSize = val;
    pageObj.currentPage = 1;
    if (searchForm.OrderName.trim()) {
        getData();
    }
};

const handleCurrentChange = (val: number) => {
    pageObj.currentPage = val;
    if (searchForm.OrderName.trim()) {
        getData();
    }
};

watch(
    queryTime,
    (newVal) => {
        handleDateRangeChange(newVal);
    },
);

onMounted(() => {
    calcTableHeight();
});
</script>

<style lang="scss" scoped>
.el-pagination {
    justify-content: center;
}
</style>
