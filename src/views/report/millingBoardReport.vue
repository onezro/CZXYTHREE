<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between">
                <el-form ref="searchFormRef" :model="searchForm" label-width="auto" :inline="true" :size="'small'"
                    @submit.prevent>
                    <el-form-item :label="t('report.millingBoardReport.inboundTime')" prop="TimeRange" class="mb-2">
                        <el-date-picker style="width: 350px;" v-model="queryTime" type="datetimerange"
                            range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                            value-format="YYYY-MM-DD HH:mm:ss" :shortcuts="shortcuts1" :default-time="[
                                new Date(2000, 1, 1, 0, 0, 0),
                                new Date(2000, 1, 1, 23, 59, 59),
                            ]" :clearable="false" @change="handleDateRangeChange" />
                    </el-form-item>
                    <el-form-item :label="t('report.millingBoardReport.workOrderNo')" prop="WorkOrder" class="mb-2">
                        <el-input v-model="searchForm.WorkOrder" clearable @clear="handleSearch" @keyup.enter="handleSearch"
                            style="width: 180px" :placeholder="t('report.millingBoardReport.inputWorkOrderNo')" />
                    </el-form-item>
                    <el-form-item :label="t('report.millingBoardReport.boxNo')" prop="Box" class="mb-2">
                        <el-input v-model="searchForm.Box" clearable @clear="handleSearch" @keyup.enter="handleSearch"
                            style="width: 180px" :placeholder="t('report.millingBoardReport.inputBoxNo')" />
                    </el-form-item>
                    <el-form-item :label="t('report.millingBoardReport.productCode')" prop="ProductCode" class="mb-2">
                        <el-input v-model="searchForm.ProductCode" clearable @clear="handleSearch"
                            @keyup.enter="handleSearch" style="width: 220px"
                            :placeholder="t('report.millingBoardReport.inputProductCode')" />
                    </el-form-item>
                    
                    <el-form-item class="mb-2">
                        <el-button type="primary" @click="handleSearch">{{ t("publicText.query") }}</el-button>
                        <el-button @click="handleReset">{{ t("publicText.reset") }}</el-button>
                    </el-form-item>
                </el-form>
            </div>

            <el-table :data="pagedTableData" size="small" ref="eltableRef" :style="{ width: '100%' }" :height="tableHeight"
                border fit highlight-current-row v-loading="loading"
                :header-cell-style="{ backgroundColor: '#006487', color: '#fff' }">
                <el-table-column type="index" align="center" fixed :label="t('publicText.index')" width="60">
                    <template #default="scope">
                        <span>{{ scope.$index + pageObj.pageSize * (pageObj.currentPage - 1) + 1 }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="ProductionOrderNo" fixed :label="t('report.millingBoardReport.productionOrderNo')"
                    :min-width="getColumnWidth('ProductionOrderNo')" show-overflow-tooltip />
                <el-table-column prop="LineNo" align="center" :label="t('report.millingBoardReport.lineNo')"
                    :min-width="getColumnWidth('LineNo')" show-overflow-tooltip />
                <el-table-column prop="ProductCode" :label="t('report.millingBoardReport.productCode')"
                    :min-width="getColumnWidth('ProductCode')" show-overflow-tooltip />
                <el-table-column prop="ProductSpec" :label="t('report.millingBoardReport.productSpec')"
                    :min-width="getColumnWidth('ProductSpec')" show-overflow-tooltip />
                <el-table-column prop="Version" align="center" :label="t('report.millingBoardReport.version')"
                    :min-width="getColumnWidth('Version')" show-overflow-tooltip />
                <el-table-column prop="WorkOrder" :label="t('report.millingBoardReport.workOrderNo')"
                    :min-width="getColumnWidth('WorkOrder')" show-overflow-tooltip />
                <el-table-column prop="WorkOrderQuantity" align="center"
                    :label="t('report.millingBoardReport.workOrderQuantity')"
                    :min-width="getColumnWidth('WorkOrderQuantity')" show-overflow-tooltip />
                <el-table-column prop="BoxNo" :label="t('report.millingBoardReport.boxNo')"
                    :min-width="getColumnWidth('BoxNo')" show-overflow-tooltip />
                <el-table-column prop="ProcessName" align="center" :label="t('report.millingBoardReport.processName')"
                    :min-width="getColumnWidth('ProcessName')" show-overflow-tooltip />
                <el-table-column prop="ProcessStatus" :label="t('report.millingBoardReport.processStatus')"
                    :min-width="getColumnWidth('ProcessStatus')" show-overflow-tooltip />
                <el-table-column prop="InboundTime" :label="t('report.millingBoardReport.inboundTime')"
                    :min-width="getColumnWidth('InboundTime')">
                    <template #default="{ row }">
                        {{ formatDate(row.InboundTime) }}
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
    </div>
</template>

<script setup lang="ts">
import { QueryPackingData } from "@/api/report/index";
import { shortcuts1 } from "@/utils/dataMenu";
import { ref, reactive, computed, onMounted, watch } from "vue";
import { ElMessage } from "element-plus";
import { useTableColumnWidth } from "@/hooks/useTableColumnWidth";
import { useTableHeight } from "@/hooks/useTableHeight";
import dayjs from "dayjs";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const loading = ref(false);
const eltableRef = ref();
const { tableHeight, calcTableHeight } = useTableHeight(eltableRef);
const tableData = ref<any[]>([]);
const total = ref(0);

const queryTime = ref<any[]>([]);

const searchForm = reactive({
    WorkOrder: "",
    Box: "",
    ProductCode: "",
    StartDate: "",
    EndDate: "",
});

const pageObj = reactive({
    currentPage: 1,
    pageSize: 50,
});

const pagedTableData = computed(() => {
    const start = (pageObj.currentPage - 1) * pageObj.pageSize;
    const end = start + pageObj.pageSize;
    return tableData.value.slice(start, end);
});

const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr === "1900-01-01T00:00:00") return "-";
    return dayjs(dateStr).format("YYYY-MM-DD HH:mm:ss");
};

const { getColumnWidth } = useTableColumnWidth(eltableRef, tableData, {
    excludeLabels: [t("publicText.index")],
});

const handleDateRangeChange = (val: any[]) => {
    searchForm.StartDate = val?.[0] || "";
    searchForm.EndDate = val?.[1] || "";
};

const getData = () => {
    loading.value = true;
    const params = {
        WorkOrder: searchForm.WorkOrder || "",
        Box: searchForm.Box || "",
        ProductCode: searchForm.ProductCode || "",
        StartDate: searchForm.StartDate || "",
        EndDate: searchForm.EndDate || "",
    };
    QueryPackingData(params)
        .then((res: any) => {
            if (res.Success && Array.isArray(res.Data)) {
                tableData.value = res.Data;
                total.value = res.Data.length;
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
    pageObj.currentPage = 1;
    getData();
};

const handleReset = () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    queryTime.value = [
        `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}-${String(start.getDate()).padStart(2, "0")} 00:00:00`,
        `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, "0")}-${String(end.getDate()).padStart(2, "0")} 23:59:59`,
    ];
    searchForm.StartDate = queryTime.value[0] || "";
    searchForm.EndDate = queryTime.value[1] || "";
    searchForm.WorkOrder = "";
    searchForm.Box = "";
    searchForm.ProductCode = "";
    pageObj.currentPage = 1;
    getData();
};

const handleSizeChange = (val: number) => {
    pageObj.pageSize = val;
    pageObj.currentPage = 1;
};

const handleCurrentChange = (val: number) => {
    pageObj.currentPage = val;
};

watch(
    queryTime,
    (newVal) => {
        handleDateRangeChange(newVal);
    },
);

onMounted(() => {
    handleReset();
});
</script>

<style lang="scss" scoped>
.el-pagination {
    justify-content: center;
}
</style>
